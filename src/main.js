import Matrix from './ai/matrix'
import evaluatePoints from './ai/evaluate/evaluate_points'
import evaluateSituation from './ai/evaluate/evaluate_situation'
import negamax from './ai/negamax'
import boardConfig from './ai/config/board_config'
import chessModel from './ai/evaluate/chess_model'
import score from './ai/evaluate/score'

var board = new Matrix(15)
board.put(5, 5, 2)
board.put(3, 2, 1)
board.put(5, 6, 2)
board.put(2, 3, 1)
board.put(5, 7, 2)
board.put(4, 3, 1)

// console.log(board.matrix)
// var test = negamax(board)
// console.log(board.matrix)
// evaluatePoints(board, 'BLACK')
// var test = chessModel([0, 0, 1, 1, 0, 0, 0, 1, 2], 1)
var test = score([0, 0, 1, 1, 0, 0, 0, 1, 2], 1)
console.log(test)