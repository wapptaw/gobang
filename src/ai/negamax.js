import evaluateSituation from './evaluate/evaluate_situation'
import evaluatePoints from './evaluate/evaluate_points'
import boardConfig from './config/board_config'
import {STR_NUM} from './config/chess_map'

export default function (board) {
  var alpha = -Infinity, beta = Infinity
  var _deep = boardConfig.deep - 1
  var best = {
    point: null,
    score: -Infinity
  }
  var points = evaluatePoints(board, boardConfig.chessType)
  for (let i = 0, len = points.length; i < len; i++) {
    let point = points[i]
    board.put(point.row, point.col, STR_NUM[boardConfig.chessType])
    let score = minimax(board, boardConfig.chessType, _deep, -1, alpha, beta)
    if (score > best.score) {
      alpha = score
      best.score = score
      best.point = point
    }
    board.remove(point.row, point.col)
  }
  return best
}

var minimax = function (board, point_type_str, deep, role, _alpha, _beta) {
  if (deep <= 0) {
    let score = evaluateSituation(board)
    return score
  }

  var alpha = _alpha, beta = _beta
  var _deep = deep - 1
  var point_type_rival = point_type_str == 'BLACK' ? 'WHITE' : 'BLACK'
  var best = role > 0 ? -Infinity : Infinity
  var points = evaluatePoints(board, point_type_rival)
  if (points.length <= 0) {
    throw new Error('无合适的落子位置')
  }
  for (let i = 0, len = points.length; i < len; i++) {
    let point = points[i]
    board.put(point.row, point.col, STR_NUM[point_type_rival])
    let score = minimax(board, point_type_rival, _deep, -role, alpha, beta)

    if (role > 0 && score < alpha || role < 0 && score > beta) { // 剪枝
      board.remove(point.row, point.col)
      break
    }
    if (score > best && role > 0) {
      alpha = score
      best = score
    }
    if (score < best && role < 0) {
      beta = score
      best = score
    }
    board.remove(point.row, point.col)
  }
  return best
}
