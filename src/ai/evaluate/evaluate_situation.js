import {NUM_STR} from '../config/chess_map'
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

  for (let i = 0; i < len; i++) { // 水平方向
    let line = ''
    for (let col = 0, row = i; col < len; col++) {
      line += STR_CHAR[NUM_STR[board.read(row, col)]]
    }
    matrixArray.horizonta.push(line)
  }

  for (let i = 0; i < len; i++) { // 垂直方向
    let line = ''
    for (let row = 0, col = i; row < len; row++) {
      line += STR_CHAR[NUM_STR[board.read(row, col)]]
    }
    matrixArray.vertical.push(line)
  }

  for (let i = 0; i < len - 4; i++) { // 左斜
    let line1 = '', line2 = ''
    for (let row = 0, col = i; col < len; row++, col++) {
      line1 += STR_CHAR[NUM_STR[board.read(row, col)]]
    }
    matrixArray.left.push(line1)
    if (i > 0) {
      for (let col = 0, row = i; row < len; row++, col++ ) {
        line2 += STR_CHAR[NUM_STR[board.read(row, col)]]
      }
      matrixArray.left.push(line2)
    }
    
  }

  for (let i = 0; i < len - 4; i++) { // 右斜
    let line1 = '', line2 = ''
    for (let row = 0, col = len - 1 - i; col >= 0; row++, col--) {
      line1 += STR_CHAR[NUM_STR[board.read(row, col)]]
    }
    matrixArray.right.push(line1)
    if (i > 0) {
      for (let col = len - 1, row = i; row < len; row++, col--) {
        line2 += STR_CHAR[NUM_STR[board.read(row, col)]]
      }
      matrixArray.right.push(line2)
    }
  }

  var scoreBlack = 0, scoreWhite = 0

  for (let v in matrixArray) {
    matrixArray[v].forEach(v => {
      scoreBlack += score(v, 'BLACK')
      scoreWhite += score(v, 'WHITE')
    })
  }
  var score_result = scoreBlack - scoreWhite

  switch (boardConfig.chessType) {
    case 'BLACK':
      return score_result
    case 'WHITE':
      return -score_result
    default:
      throw new Error('先手信息有误')
  }
}
