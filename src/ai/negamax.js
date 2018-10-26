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
  var bestArr = []
  var points = evaluatePoints(board, boardConfig.aiChess)
  for (let i = 0, len = points.length; i < len; i++) {
    let point = points[i]
    board.put(point.row, point.col, boardConfig.aiChess)
    let score = minimax(board, boardConfig.aiChess, _deep, -1, alpha, beta)
    board.remove(point.row, point.col)
    if (score > best.score) {
      bestArr = []
      alpha = score
      best.score = score
      best.point = point
    }
    if (score == best.score) {
      bestArr.push({
        point,
        score
      })
    }
  }
  let bestArrLen = bestArr.length
  let index = Math.floor(Math.random() * bestArrLen)
  if (bestArrLen > 0) {
    return bestArr[index]
  } else {
    return best
  }
}
var count = 0
var minimax = function (board, currentChess, deep, role, _alpha, _beta) {
  if (deep <= 0) {
    let score = evaluateSituation(board)
    count++
    return score
  }
  var alpha = _alpha, beta = _beta
  var _deep = deep - 1
  var rivalChess = currentChess == STR_NUM.BLACK ? STR_NUM.WHITE : STR_NUM.BLACK
  var best = role > 0 ? -Infinity : Infinity
  var points = evaluatePoints(board, rivalChess)
  if (points.length <= 0) {
    throw new Error('无合适的落子位置')
  }
  for (let i = 0, len = points.length; i < len; i++) {
    let point = points[i]
    board.put(point.row, point.col, rivalChess)
    let score = minimax(board, rivalChess, _deep, -role, alpha, beta)
    board.remove(point.row, point.col)
    if (role < 0 && score < alpha || role > 0 && score > beta) { // 剪枝
      best = score
      break
    }
    if (role > 0 && score > best) {
      alpha = score
      best = score
    }
    if (role < 0 && score < best) {
      beta = score
      best = score
    }
  }
  return best
}
