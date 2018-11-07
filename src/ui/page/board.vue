<template>
  <div
    @click="windowClick()">
    <header class="title">五子棋</header>
    <div class="board">
      <section class="board-left">
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
              @click.stop="optionShow()">{{diffSelected.title}}&gt;</div>
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
      </section>
      <section class="board-center">
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
                :class="{chessBlack: item_row[index_col] == STR_NUM.BLACK, chessWhite: item_row[index_col] == STR_NUM.WHITE}"
                @click="personPlayChess(index_row, index_col)"></li>
            </ul>
          </li>
        </ul>
        <div class="bottom-button">
          <div class="button undo">悔棋</div>
          <div
            class="button start"
            @click="gameStart">开始</div>
          <div
            class="button over"
            @click="gameEnd">认输</div>
        </div>
        <transition name="logo-scale">
          <div
            v-if="startLogo"
            class="start-logo">开始</div>
        </transition>
        <transition name="logo-scale">
          <div
            v-if="endLogo"
            class="start-logo">认输</div>
        </transition>
      </section>
      <section class="board-right">
        <div class="game-time">
          <h4>本局计时：</h4>
          <div>{{current.boardTime}}</div>
        </div>
        <div class="deep">
          <h4>步骤统计：</h4>
          <div>{{current.step}}</div>
        </div>
        <div>
          <h4>当前局势：</h4>
          <div>{{current.boardScore}}</div>
        </div>
        <div>
          <h4>本步耗时：</h4>
          <div>{{current.stepTime}}</div>
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
import evaluateSituation from '../../ai/evaluate/evaluate_situation'

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
      myBoard: [], // 棋盘对象
      myBoardMatrix: [],
      STR_NUM,
      startLogo: false, // 开始logo
      endLogo: false, // 认输logo
      start: false, // 开始
      current: { // 当前信息
        chess: 0,
        step: 0,
        boardTime: 0,
        stepTime: 0,
        boardScoreArr: null, // 单行得分数组
        boardScore: 0
      },
      stepTimeStart: 0, // 当前步开始
      stepTimeEnd: 0 // 当前步结束
    }
  },

  computed: {
    playerMessage () {  // 先手预设
      return boardConfig.sente == 'COMPUTED' ? ['电脑', '我'] : ['我', '电脑']
    },

    chessColorVal () { // 棋手棋色值
      switch (boardConfig.sente) {
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

  watch: {
    start (v) { // 监听开始状况
      if (v) {
        this.chessTime()
        this.computedPlayChess()
      } else {
        //
      }
    },

    'current.chess' (val) { // 监听当前棋手
      if (val == this.chessColorVal.COMPUTED) {
        setTimeout(() => {
          this.computedPlayChess()
        }, 1000)
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

    boardInit () { // 棋盘初始化
      this.myBoard = new Matrix(15)
      this.myBoardMatrix = this.myBoard.matrix
      switch (boardConfig.sente) {
        case 'COMPUTED':
          this.current.chess = STR_NUM.BLACK
          break
        case 'PERSON':
          this.current.chess = STR_NUM.WHITE
          break
        default:
          throw new Error('先手信息出错')
      }
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
    },

    gameStart () { // 游戏开始
      if (this.start) return
      this.startLogo = true
      this.boardInit()
      setTimeout(() => {
        this.startLogo = false
        setTimeout(() => {
          this.start = true
          this.stepTimeStart = new Date()
        }, 500)
      }, 1000)
    },

    gameEnd () { // 认输
      if (this.start) {
        this.endLogo = true
        setTimeout(() => {
          this.endLogo = false
          this.start = false
        }, 1000)
      }
    },

    personPlayChess (row, col) { // 人下子
      if (this.start && this.current.chess == this.chessColorVal.PERSON && this.myBoard.readPoint(row, col) == STR_NUM.EMPTY) {
        this.myBoard.put(row, col, this.current.chess)
        this.boardScoreGet(row, col)
        this.stepEnd()
      }
    },

    computedPlayChess () { // 电脑下子
      if (this.start && this.current.chess == this.chessColorVal.COMPUTED) {
        if (this.current.step == 0) {
          let center = Math.floor((this.myBoard.length - 1) / 2)
          this.myBoard.put(center, center, this.current.chess)
          this.boardScoreGet(center, center)
        } else {
          let pointMes = negamax(this.myBoard, this.current.boardScoreArr, this.current.boardScore)
          this.myBoard.put(pointMes.point.row, pointMes.point.col, this.current.chess)
          this.boardScoreGet(pointMes.point.row, pointMes.point.col)
        }
        this.stepEnd()
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
      this.chessSwitch(this.current.chess)
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
      return score(arr, this.chessColorVal.COMPUTED) - score(arr, this.chessColorVal.PERSON)
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
    display: flex;
    justify-content: center;
    .board-left {
      .sente {
        .sente-list {
          .mark {
            width: .5rem;
            height: .2rem;
            display: inline-block;
            vertical-align: middle;
          }
          .mark-0 {
            background-color: #000;
            border: 1px solid #fff;
          }
          .mark-1 {
            background-color: #fff;
            border: 1px solid #000;
          }
          .sente-name {
            font-size: .15rem;
            color: #525252;
          }
        }
      }
      .difficulty-setting {
        .title {
          font-size: .16rem;
          color: #333333;
          display: inline-block;
        }
        .diff {
          display: inline-block;
          position: relative;
          .diff-result {
            width: .6rem;
            height: .25rem;
            line-height: .25rem;
            border: 1px solid #5f5f5f;
            color: #585858;
          }
          .diff-ul {
            border: 1px solid #689be9;
            border-top: none;
            position: absolute;
            .diff-list {
              font-size: .12rem;
              color: #464646;
              width: .6rem;
              height: .2rem;
              line-height: .2rem;
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
    }
    .board-center {
      position: relative;
      width: 588px;
      height: 588px;
      .board-img {
        //
      }
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
        }
        .undo {
          //
        }
        .start {
          border-left: 1px solid #fff;
          border-right: 1px solid #fff;
          background-color: #47ca88;
        }
        .over {
          //
        }
      }
      .start-logo {
        font-size: .6rem;
        width: 1.2rem;
        height: .6rem;
        line-height: .6rem;
        color: #e42828;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -.6rem;
        margin-top: -.3rem;
      }
    }
  }
  .footer {
    //
  }
  .logo-scale-enter {
    transform: scale(0, 0);
  }
  .logo-scale-enter-to {
    transform: scale(1, 1);
  }
  .logo-scale-leave {
    opacity: 1;
  }
  .logo-scale-leave-to {
    opacity: 0;
  }
  .logo-scale-enter-active {
    transition: transform 1s ease;
  }
  .logo-scale-leave-active {
    transition: opacity .5s ease;
  }
</style>

