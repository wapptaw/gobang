import {STR_NUM} from '../config/chess_map'
import score from './score'

// 单点评分并排序
export default function (board, currentChess) {
  let points = []
  let len = board.length
  for (let row = 0; row < len; row++) {
    for (let col = 0; col < len; col++) {
      if (board.readPoint(row, col) == STR_NUM.EMPTY) {
        var s = pointScore(board, currentChess, row, col)
        if (s > 0) {
          points.push({
            row,
            col,
            score: s
          })
        }
      }
    }
  }
  points.sort((a, b) => {
    return b.score - a.score
  })
  return points
}

// 计算单点得分
var pointScore = function (board, currentChess, row, col) {
  var hor = [currentChess]
  var ver = [currentChess]
  var left = [currentChess]
  var right = [currentChess]
  var rowAdd = row, colAdd = col, rowSub = row, colSub = col
  for (let i = 0; i < 4; i++) {
    colAdd++
    colSub--
    rowAdd++
    rowSub--
    if (colAdd < board.length) {
      hor.push(board.readPoint(row, colAdd))
    }
    if (colSub >= 0) {
      hor.unshift(board.readPoint(row, colSub))
    }
    
    if (rowAdd < board.length) {
      ver.push(board.readPoint(rowAdd, col))
    }
    if (rowSub >= 0) {
      ver.unshift(board.readPoint(rowSub, col))
    }

    if (rowAdd < board.length && colAdd < board.length) {
      left.push(board.readPoint(rowAdd, colAdd))
    }
    if (rowSub >= 0 && colSub >= 0) {
      left.unshift(board.readPoint(rowSub, colSub))
    }

    if (rowSub >= 0 && colAdd < board.length) {
      right.push(board.readPoint(rowSub, colAdd))
    }
    if (rowAdd < board.length && colSub >= 0) {
      right.unshift(board.readPoint(rowAdd, colSub))
    }
  }
  var scorePoint = 0; // 这里必须加分号
  [hor, ver, left, right].forEach(arr => {
    if (arr.length > 4) {
      let count = 0
      arr.forEach(v => {
        if (v == currentChess) count++
      })
      if (count > 1) {
        scorePoint += score(arr, currentChess)
      }
    }
  })
  return scorePoint
}
