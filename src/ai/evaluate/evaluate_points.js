import {NUM_STR, STR_NUM} from '../config/chess_map'
import score from './score'

export default function (board, point_type_str) { // 单点评分并排序
  let points = []
  let len = board.length
  for (let row = 0; row < len; row++) {
    for (let col = 0; col < len; col++) {
      if (board.read(row, col) == STR_NUM.EMPTY) {
        // 需要先考虑冲5，活四，对手活三，活四，冲五的情况
        
      }
    }
  }
  
  points.sort((a, b) => {
    return b.score - a.score
  })
  return points
}

var stringArray = function (point, point_type_str, board) { // 四个方向字符串数组
  var array = ['horizonta', 'vertical', 'left', 'right'].map(v => {
    return evaluateString(point, point_type_str, board, v)
  })
  return array
}

var evaluateString = function (point, point_type_str, board, direction) { // 获取棋子布局字符串函数
  var list = ''
  var row = 0, col = 0, count = 9, i = 0, len = board.length
  var _row = point.row, _col = point.col

  switch (direction) { // 各方向初始值及遍历次数
    case 'horizonta':
      let difference_col = _col - 4
      row = _row
      if (difference_col >= 0) {
        col = difference_col
        count = 9
      } else {
        col = 0
        count = 5 + _col
      }
      break
    case 'vertical':
      let difference_row = _row - 4
      col = _col
      if (difference_row >= 0) {
        row = difference_row
        count = 9
      } else {
        row = 0
        count = 5 + _row
      }
      break
    case 'left':
      let min_left = _row < _col ? _row : _col
      let difference_left = min_left - 4
      if (difference_left >= 0) {
        row = _row - 4
        col = _col - 4
        count = 9
      } else {
        row = _row - min_left
        col = _col - min_left
        count = 5 + min_left
      }
      break
    case 'right':
      let min_right = len - 1 - _row < _col ? len - 1 - _row : _col
      let difference_right = min_right - 4
      if (difference_right >= 0) {
        row = _row + 4
        col = _col - 4
        count = 9
      } else {
        row = _row + min_right
        col = _col - min_right
        count = 5 + min_right
      }
      break
    default:
      throw new Error('未知的遍历方向')
  }
  
  while (row < len && col < len && row >= 0 && i < count) {
    if (row == _row && col == _col) {
      list += STR_CHAR[point_type_str]
    } else {
      list += STR_CHAR[NUM_STR[board.read(row, col)]]
    }
    
    i++
    switch (direction) {
      case 'horizonta':
        col++
        break
      case 'vertical':
        row++
        break
      case 'left':
        row++
        col++
        break
      case 'right':
        row--
        col++
        break
      default:
        throw new Error('着点遍历序号错误')
    }
  }
  return list
}
