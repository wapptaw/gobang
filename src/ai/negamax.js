import evaluateSituation from './evaluate/evaluate_situation'
import {pointsGet} from './evaluate/evaluate_points'
import boardConfig from './config/board_config'
import {STR_NUM} from './config/chess_map'

export default function (board, boardScoreArr, boardScore) {
  var alpha = -Infinity, beta = Infinity
  var _deep = boardConfig.deep - 1
  var best = {
    point: null,
    score: -Infinity
  }
  var bestArr = []
  var points = pointsGet(board, boardConfig.aiChess)
  for (let i = 0, len = points.length; i < len; i++) {
    let point = points[i]
    let amendPoints = [{row: point.row, col: point.col}]
    board.put(point.row, point.col, boardConfig.aiChess)
    if (point.isWin) {
      // 这个点可以直接连五，所以直接选取这个点
      best.score = evaluateSituation(board, boardScoreArr, boardScore, amendPoints)
      best.point = point
      board.remove(point.row, point.col)
      break
    } else {
      let score = minimax(board, boardConfig.aiChess, _deep, -1, alpha, beta, boardScoreArr, boardScore, amendPoints)
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
  }

  let bestArrLen = bestArr.length
  let index = Math.floor(Math.random() * bestArrLen)
  if (bestArrLen > 0) {
    return bestArr[index]
  } else {
    return best
  }
}

// minimax求值
var minimax = function (board, currentChess, deep, role, _alpha, _beta, boardScoreArr, boardScore, amendPoints) {
  if (deep <= 0) {
    let _amendPoints = amendPoints.slice()
    let score = evaluateSituation(board, boardScoreArr, boardScore, _amendPoints)
    return score
  }
  var alpha = _alpha, beta = _beta
  var _deep = deep - 1
  var rivalChess = currentChess == STR_NUM.BLACK ? STR_NUM.WHITE : STR_NUM.BLACK
  var best = role > 0 ? -Infinity : Infinity
  let oldTime = new Date()
  var points = pointsGet(board, rivalChess)
  if (points.length <= 0) {
    throw new Error('无合适的落子位置')
  }
  for (let i = 0, len = points.length; i < len; i++) {
    let _amendPoints = amendPoints.slice()
    let point = points[i]
    board.put(point.row, point.col, rivalChess)
    _amendPoints.push({row: point.row, col: point.col})
    if (point.isWin) {
      // 这个点可以直接连五，所以直接选取这个点
      best = evaluateSituation(board, boardScoreArr, boardScore, _amendPoints)
      board.remove(point.row, point.col)
      break
    } else {
      let score = minimax(board, rivalChess, _deep, -role, alpha, beta, boardScoreArr, boardScore, _amendPoints)
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
  }
  return best
}
