import {STR_NUM} from '../config/chess_map'
import score from './score'
import boardConfig from '../config/board_config'

// 对更改后棋盘评分
export default function (board, boardScoreArr, boardScore, amendPoints) {
  let validKey = {
    hor: [],
    ver: [],
    left: [],
    right: []
  }
  let boardScoreAfter = boardScore
  amendPoints.forEach(val => {
    for (let dir in validKey) {
      let key = 0, line = []
      switch (dir) {
        case 'hor':
          key = val.row
          line = board.readRow(val.row)
          break
        case 'ver':
          key = val.col
          line = board.readColumn(val.col)
          break
        case 'left':
          key = val.row - val.col + board.length - 1
          line = board.readLeft(val.row, val.col)
          break
        case 'right':
          key = val.row + val.col
          line = board.readRight(val.row, val.col)
          break
        default:
          throw new Error('不存在的方向')
      }
      let judge = validKey[dir].every(v => {
        return v != key
      })
      if (judge) {
        validKey[dir].push(key)
        let lineScore = situationScore(line)
        let originalScore = boardScoreArr[dir][key]
        if (originalScore) {
          boardScoreAfter += lineScore - originalScore
        } else {
          boardScoreAfter += lineScore
        }
      }
    }
  })
  return boardScoreAfter
}

var situationScore = function (arr) { // 分数
  let scoreBlack = score(arr, STR_NUM.BLACK)
  let scoreWhite = score(arr, STR_NUM.WHITE)
  if (boardConfig.aiChess == STR_NUM.BLACK) {
    return scoreBlack - scoreWhite
  }
  if (boardConfig.aiChess == STR_NUM.WHITE) {
    return scoreWhite - scoreBlack
  }
}
