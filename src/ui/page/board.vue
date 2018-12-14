<template>
  <div
    @click="windowClick()">
    <header class="title">五子棋</header>
    <div class="board">
      <section class="game-chunk board-left">
        <div class="left-align">
          <ul class="sente">
            <li v-for="(item, index) in playerMessage" :key="index" class="sente-list">
              <div :class="'mark-' + index" class="mark"></div>
              <span class="sente-name">{{item}}</span>
            </li>
          </ul>
          <div class="difficulty-setting">
            <div class="title">难度：</div>
            <div class="diff">
              <div
                class="diff-result"
                @click.stop="optionShow">{{diffSelected.title}}</div>
              <ul
                class="diff-ul"
                :class="{diffShow: diffSelected.optionClose}">
                <li 
                  v-for="(item, index) in difficulty"
                  :key="index"
                  :value="item"
                  class="diff-list"
                  :class="{optionSelected: index == diffSelected.selectedIndex}"
                  @click.stop="diffSelecte(index)">{{item.title}}</li>
              </ul>
            </div>
          </div>
          <div class="sente-select">
            <div class="title">先手：</div>
            <div
              class="sente-message"
              @click="senteSelect">{{senteName}}</div>
          </div>
        </div>
      </section>
      <section class="game-chunk board-center">
        <img src="../static/img/chessboard.png" alt="board" class="board-img">
        <ul class="chess-ul">
          <li
            v-for="(item_row, index_row) in myBoardMatrix"
            :key="index_row"
            class="chess-li">
            <ul class="chess-row-ul">
              <li
                v-for="(item_col, index_col) in item_row"
                :key="index_col"
                class="chess-row-li"
                :class="{
                  chessBlack: item_row[index_col] == STR_NUM.BLACK,
                  chessWhite: item_row[index_col] == STR_NUM.WHITE,
                  highlight: index_row == highlightPos[0] && index_col == highlightPos[1],
                  flicker: isFlickery(index_row, index_col)
                }"
                @click="personPlayChess(index_row, index_col)">
              </li>
            </ul>
          </li>
        </ul>
        <div class="bottom-button">
          <div
            class="button undo"
            @click="revocation">悔棋</div>
          <div
            class="button start"
            @click="gameStart">开始</div>
          <div
            class="button over"
            @click="gameEnd">认输</div>
        </div>
        <transition name="logo-scale">
          <div
            v-if="pupup"
            class="start-logo">{{gameResult}}</div>
        </transition>
      </section>
      <section class="game-chunk board-right">
        <div class="right-option game-time">
          <h4 class="right-title">本局计时：</h4>
          <div class="right-message">{{current.boardTime}}</div>
        </div>
        <div class="right-option step">
          <h4 class="right-title">步骤统计：</h4>
          <div class="right-message">{{current.step}}</div>
        </div>
        <div class="right-option current-score">
          <h4 class="right-title">当前局势：</h4>
          <div class="right-message">{{current.boardScore}}</div>
        </div>
        <div class="right-option step-time">
          <h4 class="right-title">本步耗时：</h4>
          <div class="right-message">{{current.stepTime}}</div>
        </div>
      </section>
    </div>
    <footer class="footer"></footer>
  </div>
</template>

<script>
import boardConfig from '../../ai/config/board_config'
import Matrix from '../../ai/matrix'
import {STR_NUM, NUM_STR} from '../../ai/config/chess_map'
import negamax from '../../ai/negamax'
import score from '../../ai/evaluate/score'
import isWin from '../../ai/evaluate/isWin'

export default {
  name: 'board',

  data() {
    return {
      difficulty: [
        {
          title: '简单',
          coeff: 2
        },
        {
          title: '困难',
          coeff: 4
        }
      ],
      diffSelected: {
        title: '简单',
        selectedIndex: 0,
        optionClose: true
      },
      sente: boardConfig.sente, // 先手
      myBoard: [], // 棋盘对象
      myBoardMatrix: [],
      STR_NUM,
      pupup: false, // 弹窗
      start: false, // 开始
      current: { // 当前信息
        chess: 0,
        step: 0,
        boardTime: 0,
        stepTime: 0,
        boardScoreArr: null, // 单行得分数组
        boardScore: 0
      },
      stepRecord: [], // 保存所有步骤
      stepTimeStart: 0, // 当前步开始
      stepTimeEnd: 0, // 当前步结束
      highlightPos: [], // 当前高亮棋子
      winner: 0, // 胜利者
      winPoints: [], // 连五棋子列表
      gameResult: '' // 游戏结果
    }
  },

  computed: {
    playerMessage () {  // 先手预设
      return this.sente == 'COMPUTED' ? ['电脑', '我'] : ['我', '电脑']
    },

    senteName () { // 先手
      switch (this.sente) {
        case 'COMPUTED':
          return '电脑'
        case 'PERSON':
          return '我'
        default:
          throw new Error('先手信息出错')
      }
    },

    chess () { // 棋手棋子类型
      switch (this.sente) {
        case 'COMPUTED':
          return {
            COMPUTED: STR_NUM.BLACK,
            PERSON: STR_NUM.WHITE
          }
        case 'PERSON':
          return {
            COMPUTED: STR_NUM.WHITE,
            PERSON: STR_NUM.BLACK
          }
        default:
          throw new Error('先手信息错误')
      }
    }
  },

  mounted () {
    this.diffConfig()
  },

  methods: {
    diffConfig () { // 难度预设
      if (boardConfig.deep == 2) {
        this.diffSelected.title = '简单'
        this.diffSelected.selectedIndex = 0
      }
      if (boardConfig.deep == 4) {
        this.diffSelected.title = '困难'
        this.diffSelected.selectedIndex = 1
      }
    },

    diffSelecte (index) { // 难度选项选择
      boardConfig.deep = this.difficulty[index].coeff
      this.diffSelected.selectedIndex = index
      this.diffSelected.title = this.difficulty[index].title
      this.diffSelected.optionClose = true
    },

    optionShow () { // 难度选项打开
      if (this.diffSelected.optionClose) {
        this.diffSelected.optionClose = false
      } else {
        this.diffSelected.optionClose = true
      }
    },

    windowClick () { // 窗口点击
      this.diffSelected.optionClose = true
    },

    senteSelect () { // 先手选择
      if (this.start) return
      switch (this.sente) {
        case 'COMPUTED':
          boardConfig.sente = 'PERSON'
          this.sente = 'PERSON'
          break
        case 'PERSON':
          boardConfig.sente = 'COMPUTED'
          this.sente = 'COMPUTED'
          break
        default:
          throw new Error('先手信息出错')
      }
    },

    boardInit () { // 棋盘初始化
      this.myBoard = new Matrix(15)
      this.myBoardMatrix = this.myBoard.matrix
      this.current.chess = STR_NUM.BLACK
      this.current.step = 0
      this.current.boardTime = '00 : 00 : 00'
      this.current.stepTime = 0
      this.current.stepScore = 0
      this.current.boardScoreArr = {
        hor: [],
        ver: [],
        left: [],
        right: []
      }
      this.current.boardScore = 0
      this.highlightPos = []
      this.winPoints = []
      this.stepRecord = []
    },

    gameStart () { // 游戏开始
      if (this.start) return
      this.pupup = true
      this.gameResult = '开始'
      this.boardInit()
      setTimeout(() => {
        this.pupup = false
        setTimeout(() => {
          this.start = true
          this.stepTimeStart = new Date()
          this.chessTime()
          this.computedPlayChess()
        }, 500)
      }, 1000)
    },

    gameEnd () { // 游戏结束
      if (this.start) {
        switch (this.winner) {
          case this.chess.COMPUTED:
            this.gameResult = '你输了'
            break
          case this.chess.PERSON:
            this.gameResult = '你赢了'
            break
          case 0:
            this.gameResult = '认输'
            break
          default:
            throw new Error('输赢信息出错')
        }
        this.pupup = true
        setTimeout(() => {
          this.pupup = false
          this.start = false
        }, 1000)
      }
    },

    revocation () { // 悔棋
      if (this.start && this.chess.PERSON == this.current.chess && this.current.step > 2) {
        let pointLast = this.stepRecord[this.stepRecord.length - 1]
        let pointSecondLast = this.stepRecord[this.stepRecord.length - 2]
        let pointThirdLast = this.stepRecord[this.stepRecord.length - 3]
        this.myBoard.remove(pointLast[0], pointLast[1])
        this.myBoard.remove(pointSecondLast[0], pointSecondLast[1])
        this.highlightPos = [pointThirdLast[0], pointThirdLast[1]]
        this.boardScoreGet(pointLast[0], pointLast[1])
        this.boardScoreGet(pointSecondLast[0], pointSecondLast[1])
        this.current.step -= 2
        this.stepRecord.splice(-2, 2)
      }
    },

    winOrLose (row, col) { // 输赢结果
      let winMes = isWin(this.myBoard, row, col, this.current.chess)
      if (winMes.result) {
        this.winner = this.current.chess
        this.winPoints = winMes.winPoints
        this.gameEnd()
      }
    },

    isFlickery(row, col) { // 连五闪烁
      if (this.winPoints.length > 0) {
        for (let v of this.winPoints) {
          if (row == v[0] && col == v[1]) {
            return true
          }
        }
      }
      return false
    },

    personPlayChess (row, col) { // 人下子
      if (this.start && this.current.chess == this.chess.PERSON && this.myBoard.readPoint(row, col) == STR_NUM.EMPTY) {
        this.myBoard.put(row, col, this.current.chess)
        this.stepRecord.push([row, col])
        this.highlightPos = [row, col]
        this.boardScoreGet(row, col)
        this.stepEnd()
        this.winOrLose(row, col)
        this.chessSwitch(this.current.chess) // 切换棋色
        setTimeout(() => { // 切换为电脑下子
          this.computedPlayChess()
        }, 1000)
      }
    },

    computedPlayChess () { // 电脑下子
      if (this.start && this.current.chess == this.chess.COMPUTED) {
        let row = 0, col = 0
        if (this.current.step == 0) {
          let center = Math.floor((this.myBoard.length - 1) / 2)
          row = col = center
        } else if (this.current.step == 1 && this.sente == 'PERSON') {
          let firstStep = this.stepRecord[0]
          let ablePoints = []
          let boardLen = this.myBoard.length
          for (let i = 1; i <= 2; i++) {
            let dirKeyArr = [
              [firstStep[0] - i, firstStep[1]],
              [firstStep[0] + i, firstStep[1]],
              [firstStep[0], firstStep[1] - i],
              [firstStep[0], firstStep[1] + i],
              [firstStep[0] - i, firstStep[1] - i],
              [firstStep[0] + i, firstStep[1] + i],
              [firstStep[0] - i, firstStep[1] + i],
              [firstStep[0] + i, firstStep[1] - i]
            ]
            for (let val of dirKeyArr) {
              if (val[0] >= 0 && val[1] >= 0 && val[0] < boardLen && val[1] < boardLen && this.myBoard.readPoint(val[0], val[1]) == STR_NUM.EMPTY) {
                ablePoints.push(val)
              }
            }
          }
          let len = ablePoints.length - 1
          let index = Math.floor(len * Math.random())
          let point = ablePoints[index]
          row = point[0]
          col = point[1]
        } else {
          let pointMes = negamax(this.myBoard, this.current.boardScoreArr, this.current.boardScore)
          row = pointMes.point.row
          col = pointMes.point.col
        }
        this.myBoard.put(row, col, this.current.chess)
        this.stepRecord.push([row, col])
        this.highlightPos = [row, col]
        this.boardScoreGet(row, col)
        this.stepEnd()
        this.winOrLose(row, col)
        this.chessSwitch(this.current.chess)
      }
    },

    chessTime () { // 棋局时间
      let startTime = new Date()
      let interval = () => {
        setTimeout(() => {
          let currentTime = new Date()
          this.current.boardTime = this.timeSwitch(currentTime - startTime)
          if (this.start) {
            interval()
          }
        }, 1000)
      }
      interval()
    },

    boardScoreGet (row, col) { // 棋局分数
      let dirArr = ['hor', 'ver', 'left', 'right']
      for (let dir of dirArr) {
        let key = 0, line = []
        switch (dir) {
          case 'hor':
            key = row
            line = this.myBoard.readRow(row)
            break
          case 'ver':
            key = col
            line = this.myBoard.readColumn(col)
            break
          case 'left':
            key = row - col + this.myBoard.length - 1
            line = this.myBoard.readLeft(row, col)
            break
          case 'right':
            key = row + col
            line = this.myBoard.readRight(row, col)
            break
          default:
            throw new Error('不存在的方向')
        }
        let originalScore = this.current.boardScoreArr[dir][key]
        let scoreAfter = this.scoreDiff(line)
        if (originalScore) {
          this.current.boardScore += scoreAfter - originalScore
        } else {
          this.current.boardScore += scoreAfter
        }
        this.current.boardScoreArr[dir][key] = scoreAfter
      }
    },

    stepEnd () { // 单步结束操作
      this.current.step++
      this.stepTimeEnd = new Date()
      this.current.stepTime = (this.stepTimeEnd - this.stepTimeStart) / 1000 + 's'
      this.stepTimeStart = this.stepTimeEnd
    },

    timeSwitch (MS) { // 毫秒格式转换
      let hour = 0, minu = 0, second = 0
      hour = Math.floor(MS / 1000 / 3600)
      minu = Math.floor(MS % (1000 * 3600) / 1000 / 60)
      second = Math.floor(MS % (1000 * 60) / 1000)
      return `${this.timeStr(hour)} : ${this.timeStr(minu)} : ${this.timeStr(second)}`
    },

    timeStr (num) { // 数字前面添0
      if (num > 9) {
        return num
      } else {
        return '0' + num
      }
    },

    chessSwitch (chess) { // 棋色切换
      switch (chess) {
        case STR_NUM.BLACK:
          this.current.chess = STR_NUM.WHITE
          break
        case STR_NUM.WHITE:
          this.current.chess = STR_NUM.BLACK
          break
        default:
          throw new Error('未知棋色')
      }
    },

    scoreDiff (arr) { // 分数差
      return score(arr, this.chess.COMPUTED) - score(arr, this.chess.PERSON)
    }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    font-size: .2rem;
    color: #2f81b8;
    text-align: center;
  }
  .board {
    text-align: center;
    .game-chunk {
      display: inline-block;
      vertical-align: top;
    }
    .board-left, .board-right {
      width: 2rem;
    }
    .board-left {
      margin-top: .5rem;
      .left-align {
        width: 1rem;
        text-align: left;
        margin-left: 1.1rem;
        .sente {
          .sente-list {
            .mark {
              width: .4rem;
              height: .15rem;
              display: inline-block;
              vertical-align: middle;
              box-sizing: border-box;
            }
            .mark-0 {
              background-color: #000;
            }
            .mark-1 {
              background-color: #fff;
              border: 1px solid #000;
            }
            .sente-name {
              font-size: .12rem;
              color: #525252;
            }
          }
        }
        .difficulty-setting {
          margin-top: .2rem;
          .title {
            font-size: .13rem;
            color: #333333;
            display: inline-block;
          }
          .diff {
            display: inline-block;
            position: relative;
            .diff-result {
              width: .4rem;
              height: .2rem;
              line-height: .2rem;
              font-size: .13rem;
              border: 1px solid #5f5f5f;
              box-sizing: border-box;
              color: #585858;
              padding-left: .02rem;
              user-select: none;
              text-align: left;
            }
            .diff-ul {
              border: 1px solid #689be9;
              box-sizing: border-box;
              border-top: none;
              position: absolute;
              width: .4rem;
              .diff-list {
                font-size: .12rem;
                color: #464646;
                height: .2rem;
                line-height: .2rem;
                padding-left: .02rem;
                user-select: none;
                text-align: left;
              }
              .optionSelected {
                background-color: #2b88be;
                color: #fff;
              }
            }
            .diffShow {
              display: none;
            }
          }
        }
        .sente-select {
          margin-top: .2rem;
          .title, .sente-message {
            font-size: .13rem;
            color: #333;
            display: inline-block;
          }
          .sente-message {
            width: .35rem;
            height: .18rem;
            line-height: .18rem;
            border: 1px solid #b4b4b4;
            border-radius: 5px;
            text-align: center;
            color: #f0f0f0;
            background-color: #c063eb;
            user-select: none;
          }
        }
      }
    }
    .board-center {
      position: relative;
      width: 588px;
      height: 588px;
      margin: 0 .2rem;
      .chess-ul {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        .chess-li {
          width: 100%;
          .chess-row-ul {
            display: flex;
            justify-content: space-between;
            .chess-row-li {
              width: .3rem;
              height: .3rem;
              border-radius: 50%;
            }
            .chessBlack {
              background-color: #000;
            }
            .chessWhite {
              background-color: #fff;
            }
            .highlight {
              box-shadow: 0 0 5px 3px #e74848;
            }
            .flicker {
              animation: flicker .5s ease-in 1.5s infinite alternate;
            }
          }
        }
      }
      .bottom-button {
        margin: 0 auto;
        width: 100%;
        height: .35rem;
        display: flex;
        justify-content: center;
        background-color: #63a0bd;
        border-radius: .18rem;
        .button {
          font-size: .15rem;
          line-height: .35rem;
          flex: auto;
          text-align: center;
          color: #ffffff;
          user-select: none;
        }
        .start {
          border-left: 1px solid #fff;
          border-right: 1px solid #fff;
          background-color: #47ca88;
        }
      }
      .start-logo {
        font-size: .6rem;
        color: #e42828;
        position: absolute;
      }
    }
    .board-right {
      margin-top: .3rem;
      .right-option {
        display: flex;
        justify-content: flex-start;
        margin: .2rem 0;
        .right-title {
          font-size: .14rem;
          color: #525252;
        }
        .right-message {
          font-size: .14rem;
          color: #616060;
        }
      }
    }
  }
  @keyframes flicker {
    from {
      opacity: 1;
    }
    to {
      opacity: .2;
    }
  }
  .logo-scale-enter {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0, 0);
  }
  .logo-scale-enter-to {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1, 1);
  }
  .logo-scale-leave {
    opacity: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1, 1);
  }
  .logo-scale-leave-to {
    opacity: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1, 1);
  }
  .logo-scale-enter-active {
    transition: transform 1s ease;
  }
  .logo-scale-leave-active {
    transition: opacity .5s ease;
  }
</style>
