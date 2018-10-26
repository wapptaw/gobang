import {STR_NUM} from '../config/chess_map'
import score from './score'
import boardConfig from '../config/board_config'

export default function (board) { // 全局评分
  var matrixArray = {
    horizonta: [],
    vertical: [],
    left: [],
    right: []
  }
  var len = board.length

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (!matrixArray.horizonta[i]) { // 水平方向
        matrixArray.horizonta[i] = []
      }
      matrixArray.horizonta[i].push(board.readPoint(i, j))
      if (!matrixArray.vertical[j]) { // 垂直方向
        matrixArray.vertical[j] = []
      }
      matrixArray.vertical[j].push(board.readPoint(i, j))

      if (!matrixArray.left[i - j + len - 1]) { // 左斜
        matrixArray.left[i - j + len - 1] = []
      }
      matrixArray.left[i - j + len - 1].push(board.readPoint(i, j))

      if (!matrixArray.right[i + j]) { // 右斜
        matrixArray.right[i + j] = []
      }
      matrixArray.right[i + j].push(board.readPoint(i, j))
    }
  }
  
  var scoreBlack = 0, scoreWhite = 0
  for (let arr in matrixArray) {
    scoreBlack += matrixArray[arr].reduce((a, b) => {
      return a + score(b, STR_NUM.BLACK)
    }, 0)
    scoreWhite += matrixArray[arr].reduce((a, b) => {
      return a + score(b, STR_NUM.WHITE)
    }, 0)
  }

  if (boardConfig.aiChess == STR_NUM.BLACK) {
    return scoreBlack - scoreWhite
  }
  if (boardConfig.aiChess == STR_NUM.WHITE) {
    return scoreWhite - scoreBlack
  }
}
