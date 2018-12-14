import {STR_NUM} from '../config/chess_map'
import {scoreMap} from '../config/score_map'

// 单点评分并排序
var pointsGet = function (board, currentChess) {
  let points = []
  let len = board.length
  var isWinPoint = false
  for (let row = 0; row < len; row++) {
    for (let col = 0; col < len; col++) {
      if (board.readPoint(row, col) == STR_NUM.EMPTY) {
        let nearby = hasChess(board, row, col, 2)
        if (nearby) { // 考虑先去除部分点
          let scorePoint = pointScore(board, currentChess, row, col)
          if (scorePoint.score <= 10) continue
          let pointMes = {
            row,
            col,
            score: scorePoint.score,
            isWin: scorePoint.isWin
          }
          if (pointMes.isWin) {
            points = [pointMes]
            isWinPoint = true
            break
          } else {
            points.push(pointMes)
          }
        }
      }
    }
    if (isWinPoint) break
  }
  if (!isWinPoint) {
    points.sort((a, b) => {
      return b.score - a.score
    })
  }
  return points.slice(0, 10)
}

// 查看附近是否有棋子
var hasChess = function (board, row, col, distance) {
  let hasChess = false
  let len = board.length
  for (let i = 1; i <= distance; i++) {
    let dirKeyArr = [
      [row - i, col],
      [row + i, col],
      [row, col - i],
      [row, col + i],
      [row - i, col - i],
      [row + i, col + i],
      [row - i, col + i],
      [row + i, col - i]
    ]
    for (let val of dirKeyArr) {
      if (val[0] >= 0 && val[1] >= 0 && val[0] < len - distance && val[1] < len - distance) {
        if (board.readPoint(val[0], val[1]) != STR_NUM.EMPTY) {
          hasChess = true
          break
        }
      }
    }
    if (hasChess) break
  }
  return hasChess
}

// 计算四个方向总得分
var pointScore = function (board, currentChess, row, col) {
  var hor = {
    current: [currentChess],
    rival: [STR_NUM.EMPTY],
    currentIndex: 0,
    rivalIndex: 0
  }
  var ver = {
    current: [currentChess],
    rival: [STR_NUM.EMPTY],
    currentIndex: 0,
    rivalIndex: 0
  }
  var left = {
    current: [currentChess],
    rival: [STR_NUM.EMPTY],
    currentIndex: 0,
    rivalIndex: 0
  }
  var right = {
    current: [currentChess],
    rival: [STR_NUM.EMPTY],
    currentIndex: 0,
    rivalIndex: 0
  }
  var rivalChess = currentChess == STR_NUM.BLACK ? STR_NUM.WHITE : STR_NUM.BLACK
  var dirMes = [
    {
      dirName: 'hor',
      dir: hor,
      rowAdd: row,
      rowSub: row,
      colAdd: col,
      colSub: col,
      get nextRight () { // 右侧下一个子
        return board.readPoint(row, this.colAdd)
      },
      get nextLeft () { // 左侧下一个子
        return board.readPoint(row, this.colSub)
      },
      hasCurrentLeft: false, // 左侧是否有current棋子
      hasCurrentRight: false,
      hasRivalLeft: false,
      hasRivalRight: false,
      stopSeachLeft: false, // 是否停止搜索
      stopSeachRight: false
    },
    {
      dirName: 'ver',
      dir: ver,
      rowAdd: row,
      rowSub: row,
      colAdd: col,
      colSub: col,
      get nextRight () {
        return board.readPoint(this.rowAdd, col)
      },
      get nextLeft () {
        return board.readPoint(this.rowSub, col)
      },
      hasCurrentLeft: false, // 左侧是否有current棋子
      hasCurrentRight: false,
      hasRivalLeft: false,
      hasRivalRight: false,
      stopSeachLeft: false, // 是否停止搜索
      stopSeachRight: false
    },
    {
      dirName: 'left',
      dir: left,
      rowAdd: row,
      rowSub: row,
      colAdd: col,
      colSub: col,
      get nextRight () {
        return board.readPoint(this.rowAdd, this.colAdd)
      },
      get nextLeft () {
        return board.readPoint(this.rowSub, this.colSub)
      },
      hasCurrentLeft: false, // 左侧是否有current棋子
      hasCurrentRight: false,
      hasRivalLeft: false,
      hasRivalRight: false,
      stopSeachLeft: false, // 是否停止搜索
      stopSeachRight: false
    },
    {
      dirName: 'right',
      dir: right,
      rowAdd: row,
      rowSub: row,
      colAdd: col,
      colSub: col,
      get nextRight () {
        return board.readPoint(this.rowSub, this.colAdd)
      },
      get nextLeft () {
        return board.readPoint(this.rowAdd, this.colSub)
      },
      hasCurrentLeft: false, // 左侧是否有current棋子
      hasCurrentRight: false,
      hasRivalLeft: false,
      hasRivalRight: false,
      stopSeachLeft: false, // 是否停止搜索
      stopSeachRight: false
    }
  ]
  let boardLen = board.length
  for (let i = 0; i < 4; i++) {
    for (let v of dirMes) {
      if (v.stopSeachLeft && v.stopSeachRight) break
      switch (v.dirName) {
        case 'hor':
          if (!v.stopSeachLeft) {
            v.colSub--
            if (v.colSub < 0) {
              v.stopSeachLeft = true
            }
          }
          if (!v.stopSeachRight) {
            v.colAdd++
            if (v.colAdd >= boardLen) {
              v.stopSeachRight = true
            }
          }
          break
        case 'ver':
          if (!v.stopSeachLeft) {
            v.rowSub--
            if (v.rowSub < 0) {
              v.stopSeachLeft = true
            }
          }
          if (!v.stopSeachRight) {
            v.rowAdd++
            if (v.rowAdd >= boardLen) {
              v.stopSeachRight = true
            }
          }
          break
        case 'left':
          if (!v.stopSeachLeft) {
            v.rowSub--
            v.colSub--
            if (v.rowSub < 0 || v.colSub < 0) {
              v.stopSeachLeft = true
            }
          }
          if (!v.stopSeachRight) {
            v.rowAdd++
            v.colAdd++
            if (v.rowAdd >= boardLen || v.colAdd >= boardLen) {
              v.stopSeachRight = true
            }
          }
          break
        case 'right':
          if (!v.stopSeachLeft) {
            v.colSub--
            v.rowAdd++
            if (v.rowAdd >= boardLen || v.colSub < 0) {
              v.stopSeachLeft = true
            }
          }
          if (!v.stopSeachRight) {
            v.colAdd++
            v.rowSub--
            if (v.rowSub < 0 || v.colAdd >= boardLen) {
              v.stopSeachRight = true
            }
          }
          break
        default:
          throw new Error('未知的方向')
      }
      if (!v.stopSeachRight) {
        let nextRight = v.nextRight
        if (!v.stopSeachRight) { // 是否停止搜索
          if (nextRight == currentChess) { // 判断当前棋色
            if (v.hasRivalRight) { // 判断是否搜索过对手棋
              v.stopSeachRight = true // 是的话就停止搜索
            } else {
              v.dir.current.push(nextRight) // 否则就push该子，同时标注当前棋子已被搜索过
              v.hasCurrentRight = true
            }
          }
          if (nextRight == rivalChess) {
            if (v.hasCurrentRight) {
              v.stopSeachRight = true
            } else {
              v.dir.rival.push(nextRight)
              v.hasRivalRight = true
            }
          }
          if (nextRight == STR_NUM.EMPTY) { // 搜索到空子
            if (!v.hasCurrentRight && !v.hasRivalRight) { // 从未搜索到非空子，就都添加空子
              v.dir.current.push(nextRight)
              v.dir.rival.push(nextRight)
            }
            if (v.hasCurrentRight) { // 曾经搜索过哪种非空子，就在该数组添加空子
              v.dir.current.push(nextRight)
            }
            if (v.hasRivalRight) {
              v.dir.rival.push(nextRight)
            }
          }
        }
      }

      if (!v.stopSeachLeft) {
        let nextLeft = v.nextLeft
        if (nextLeft == currentChess) {
          if (v.hasRivalLeft) {
            v.stopSeachLeft = true
          } else {
            v.dir.current.unshift(nextLeft)
            v.dir.currentIndex++
            v.hasCurrentLeft = true
          }
        }
        if (nextLeft == rivalChess) {
          if (v.hasCurrentLeft) {
            v.stopSeachLeft = true
          } else {
            v.dir.rival.unshift(nextLeft)
            v.dir.rivalIndex++
            v.hasRivalLeft = true
          }
        }
        if (nextLeft == STR_NUM.EMPTY) {
          if (!v.hasCurrentLeft && !v.hasRivalLeft) {
            v.dir.current.unshift(nextLeft)
            v.dir.currentIndex++
            v.dir.rival.unshift(nextLeft)
            v.dir.rivalIndex++
          }
          if (v.hasCurrentLeft) {
            v.dir.current.unshift(nextLeft)
            v.dir.currentIndex++
          }
          if (v.hasRivalLeft) {
            v.dir.rival.unshift(nextLeft)
            v.dir.rivalIndex++
          }
        }
      }
    }
  }

  let dirArr = [hor, ver, left, right]
  let scoreAll = {
    score: 0,
    isWin: false
  }
  for (let v of dirArr) {
    let s = dirScore(v, currentChess, rivalChess)
    if (s.isWin) {
      scoreAll.isWin = true
    }
    scoreAll.score += s.score
  }

  return scoreAll
}

var dirScore = function (dirMes, currentChess, rivalChess) { // 计算单一方向分数
  let scoreCur = 0, scoreRival = 0
  if (dirMes.current.length >= 5) {
    let effectCur = effectiveArr(dirMes.current, dirMes.currentIndex, currentChess)
    scoreCur = currentScore(effectCur)
  }
  if (dirMes.rival.length >= 5) {
    let effectRival = effectiveArr(dirMes.rival, dirMes.rivalIndex, rivalChess)
    scoreRival = rivalScore(effectRival)
  }
  if (scoreCur >= scoreMap.WIN_FIVE) {
    return {
      score: scoreCur + scoreRival,
      isWin: true
    }
  } else {
    return {
      score: scoreCur + scoreRival,
      isWin: false
    }
  }
}

var effectiveArr = function (arr, index, chess) { // 获取有效片段
  let len = arr.length
  let effective = []
  let leftCount = 0, rightCount = 0
  let startIndex = 0, endIndex = len - 1

  for (let i = 0; i < index; i++) { // 中间子左侧非空子个数
    if (arr[i] == chess) {
      leftCount++
    }
  }
  for (let j = len - 1; j > index; j--) {
    if (arr[j] == chess) {
      rightCount++
    }
  }
  
  // 从两头开始搜索，搜索到两侧有效值并比较两个有效值距离，直到距离小于或等于5则返回
  for (let i = 0, j = len - 1; i <= index || j >= index;) {
    if (i <= index) {
      startIndex = i
      if (endIndex - startIndex < 5 && (arr[startIndex] == chess || arr[endIndex] == chess)) { // 为了得到离边缘最近的棋子位置而加的判断，从而判断棋型死活
        effective = arr.slice(startIndex, endIndex + 1)
        break
      } else {
        if (arr[i] == chess) {
          if (arr[j] == chess && leftCount < rightCount) {
            i++
            leftCount--
          }
        } else {
          i++
        }
      }
    }

    if (j >= index) {
      endIndex = j
      if (endIndex - startIndex < 5 && (arr[startIndex] == chess || arr[endIndex] == chess)) {
        effective = arr.slice(startIndex, endIndex + 1)
        break
      } else {
        if (arr[j] == chess) {
          if (arr[i] == chess && rightCount <= leftCount) {
            j--
            rightCount--
          }
        } else {
          j--
        }
      }
    }
  }
  let effectiveMes = {
    count: 0,
    type: 'alive'
  }
  for (let v of effective) { // 统计棋子个数
    if (v == chess) {
      effectiveMes.count++
    }
  }
  if (arr[startIndex - 1] === undefined || arr[endIndex + 1] === undefined) { // 判断死活
    effectiveMes.type = 'die'
  } else {
    effectiveMes.type = 'alive'
  }
  return effectiveMes
}

var currentScore = function (message) { // 当前棋子评分
  if (message.count == 5) {
    return scoreMap.WIN_FIVE
  }
  if (message.type == 'alive') {
    switch (message.count) {
      case 4:
        return scoreMap.ALIVE_FOUR
      case 3:
        return scoreMap.ALIVE_THREE
      case 2:
        return scoreMap.ALIVE_TWO
      default:
        return 0
    }
  }
  if (message.type == 'die') {
    switch (message.count) {
      case 4:
        return scoreMap.DIE_FOUR
      case 3:
        return scoreMap.DIE_THREE
      case 2:
        return scoreMap.DIE_TWO
      default:
        return 0
    }
  }
}

// 我方棋子通常是下一个子后才能达到目标棋型，而对手则是已经达到目标棋型，所以给予较高分值
var rivalScore = function (message) {
  if (message.count == 4) {
    return scoreMap.ALIVE_FOUR * 1.5
  }
  if (message.type == 'alive') {
    switch (message.count) {
      case 3:
        return scoreMap.ALIVE_THREE * 1.5
      case 2:
        return scoreMap.ALIVE_TWO // 连二威胁不大不考虑加分
      default:
        return 0
    }
  }
  if (message.type == 'die') { // 死三死二威胁也不大，不加分
    switch (message.count) {
      case 3:
        return scoreMap.DIE_THREE
      case 2:
        return scoreMap.DIE_TWO
      default:
        return 0
    }
  }
}

export {pointsGet, dirScore}
