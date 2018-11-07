import {STR_NUM} from '../config/chess_map'
import score from './score'
import chessModel from '../evaluate/chess_model'

// 单点评分并排序
var pointsGet = function (board, currentChess) { // 取点太慢，需要修改
  let points = []
  let len = board.length
  var isWinPoint = false
  for (let row = 0; row < len; row++) {
    for (let col = 0; col < len; col++) {
      if (board.readPoint(row, col) == STR_NUM.EMPTY) {
        let nearby = hasChess(board, row, col, 2)
        if (nearby) { // 考虑先去除部分点
          let list = pointList(board, currentChess, row, col)
          let scorePoint = pointScore(list, currentChess) // 这玩意算的太慢
          if (scorePoint.score <= 10) continue
          points.push({
            row,
            col,
            score: scorePoint.score,
            isWin: false
          })
          if (scorePoint.isWin) {
            points = [
              {
                row,
                col,
                score: '算个啥分啊，你已经赢了',
                isWin: true
              }
            ]
            isWinPoint = true
            break
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
  return points
}

// 计算单点四个方向的数组
var pointList = function (board, currentChess, row, col) {
  var hor = {
    berfore: [STR_NUM.EMPTY],
    after: [currentChess]
  }
  var ver = {
    berfore: [STR_NUM.EMPTY],
    after: [currentChess]
  }
  var left = {
    berfore: [STR_NUM.EMPTY]
  }
  var right = {
    berfore: [STR_NUM.EMPTY],
    after: [currentChess]
  }
  var rowAdd = row, colAdd = col, rowSub = row, colSub = col
  for (let i = 0; i < 4; i++) {
    colAdd++
    colSub--
    rowAdd++
    rowSub--
    if (colAdd < board.length) {
      for (let key in hor) {
        hor[key].push(board.readPoint(row, colAdd))
      }
    }
    if (colSub >= 0) {
      for (let key in hor) {
        hor[key].unshift(board.readPoint(row, colSub))
      }
    }
    
    if (rowAdd < board.length) {
      for (let key in ver) {
        ver[key].push(board.readPoint(row, rowAdd))
      }
    }
    if (rowSub >= 0) {
      for (let key in ver) {
        ver[key].unshift(board.readPoint(row, rowSub))
      }
    }

    if (rowAdd < board.length && colAdd < board.length) {
      for (let key in left) {
        left[key].push(board.readPoint(rowAdd, colAdd))
      }
    }
    if (rowSub >= 0 && colSub >= 0) {
      for (let key in left) {
        left[key].unshift(board.readPoint(rowSub, colSub))
      }
    }

    if (rowSub >= 0 && colAdd < board.length) {
      for (let key in right) {
        right[key].push(board.readPoint(rowSub, colAdd))
      }
    }
    if (rowAdd < board.length && colSub >= 0) {
      for (let key in right) {
        right[key].unshift(board.readPoint(rowAdd, colSub))
      }
    }
  }

  let dir = {hor, ver, left, right}
  return dir
}

// 计算四个方向的得分
var pointScore = function (dir, currentChess) {
  let scorePoint = {
    isWin: false,
    score: 0
  }
  let rivalChess = 0
  switch (currentChess) {
    case STR_NUM.BLACK:
      rivalChess = STR_NUM.WHITE
      break
    case STR_NUM.WHITE:
      rivalChess = STR_NUM.BLACK
      break
    default:
      throw new Error('错误的棋子类型')
  }
  for (let v in dir) {
    if (dir[v].berfore.length < 5) continue
    let berforeArr = dir[v].berfore,
        afterArr = dir[v].after
    if (chessModel(afterArr, currentChess) == 'WIN_FIVE') {
      scorePoint.isWin = true
      scorePoint.score = '你赢了，还问多少分干嘛'
      break
    }
    let scoreBerfore = score(berforeArr, currentChess) - score(berforeArr, rivalChess),
        scoreAfter = score(afterArr, currentChess) - score(afterArr, rivalChess)
    let increasedScore = scoreAfter - scoreBerfore
    scorePoint.score += increasedScore
    if (scorePoint.isWin) break
  }
  return scorePoint
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

export {pointsGet}
