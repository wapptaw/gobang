export default function (board, row, col, currentChess) { // 判断点是否是连五点
  let len = board.length
  let dir = ['hor', 'ver', 'left', 'right']
  let str = ''
  let isWin = {
    result: false,
    winPoints: []
  }
  for (let i = 0; i < 5; i++) {
    str += currentChess + ''
  } 
  let reg = new RegExp(str) // 判断连五的正则
  for (let v of dir) {
    let dirArr = {
      chess: [currentChess],
      point: [[row, col]]
    }
    let rowAdd = row, rowSub = row, colAdd = col, colSub = col
    let nextChessLeft = 0, nextChessRight = 0, nextPointLeft = [], nextPointRight = []
    let stopSeachLeft = false, stopSeachRight = false
    for (let i = 0; i < 4; i++) {
      if (stopSeachLeft && stopSeachRight) break
      switch (v) {
        case 'hor':
          if (!stopSeachLeft) {
            colSub--
            if (colSub < 0) {
              stopSeachLeft = true
            } else {
              nextChessLeft = board.readPoint(row, colSub)
              nextPointLeft = [row, colSub]
            }
          }
          if (!stopSeachRight) {
            colAdd++
            if (colAdd >= len) {
              stopSeachRight = true
            } else {
              nextChessRight = board.readPoint(row, colAdd)
              nextPointRight = [row, colAdd]
            }
          }
          break
        case 'ver':
          if (!stopSeachLeft) {
            rowSub--
            if (rowSub < 0) {
              stopSeachLeft = true
            } else {
              nextChessLeft = board.readPoint(rowSub, col)
              nextPointLeft = [rowSub, col]
            }
          }
          if (!stopSeachRight) {
            rowAdd++
            if (rowAdd >= len) {
              stopSeachRight = true
            } else {
              nextChessRight = board.readPoint(rowAdd, col)
              nextPointRight = [rowAdd, col]
            }
          }
          break
        case 'left':
          if (!stopSeachLeft) {
            rowSub--
            colSub--
            if (rowSub < 0 || colSub < 0) {
              stopSeachLeft = true
            } else {
              nextChessLeft = board.readPoint(rowSub, colSub)
              nextPointLeft = [rowSub, colSub]
            }
          }
          if (!stopSeachRight) {
            rowAdd++
            colAdd++
            if (rowAdd >= len || colAdd >= len) {
              stopSeachRight = true
            } else {
              nextChessRight = board.readPoint(rowAdd, colAdd)
              nextPointRight = [rowAdd, colAdd]
            }
          }
          break
        case 'right':
          if (!stopSeachLeft) {
            rowAdd++
            colSub--
            if (rowAdd >= len || colSub < 0) {
              stopSeachLeft = true
            } else {
              nextChessLeft = board.readPoint(rowAdd, colSub)
              nextPointLeft = [rowAdd, colSub]
            }
          }
          if (!stopSeachRight) {
            rowSub--
            colAdd++
            if (colAdd >= len || rowSub < 0) {
              stopSeachRight = true
            } else {
              nextChessRight = board.readPoint(rowSub, colAdd)
              nextPointRight = [rowSub, colAdd]
            }
          }
          break
        default:
          throw new Error('未知的方向')
      }
      if (!stopSeachLeft) {
        if (nextChessLeft != currentChess) {
          stopSeachLeft = true
        } else {
          dirArr.chess.unshift(nextChessLeft)
          dirArr.point.unshift(nextPointLeft)
        }
      }
      if (!stopSeachRight) {
        if (nextChessRight != currentChess) {
          stopSeachRight = true
        } else {
          dirArr.chess.push(nextChessRight)
          dirArr.point.push(nextPointRight)
        }
      }
    }
    let dirStr = dirArr.chess.join('')
    isWin.result = reg.test(dirStr)
    if (isWin.result) {
      isWin.winPoints = dirArr.point
      break
    }
  }
  return isWin
}