import {STR_NUM} from '../config/chess_map'

export default function (array, currentChess) {
  var model_value = chessModel(array, currentChess, 2) // 这里deep值为2,意味着我们最多尝试增加2个子，看是否能组成死四/活四
  var value = 5 - Math.abs(model_value)
  var result = model_value >= 0 ? value : -value
  switch (result) {
    case 2:
      return 'ALIVE_TWO'
    case 3:
      return 'ALIVE_THREE'
    case 4:
      return 'ALIVE_FOUR'
    case -2:
      return 'DIE_TWO'
    case -3:
      return 'DIE_THREE'
    case -4:
      return 'DIE_FOUR'
    case 5:
      return 'WIN_FIVE'
    default:
      return 'OTHERS'
  }
}

var chessModel = function (array, currentChess, deep) { // 判断棋型
  var _deep = deep - 1 // deep值可以限制最大增子数
  var best = Infinity

  var winFive = isWinFive(array, currentChess) // 判断连五
  if (winFive) {
    return 0
  }

  var isAlivefour = fourToFive(array, currentChess)
  if (Math.abs(isAlivefour) === 1) { // 判断死四/活四
    return isAlivefour
  }

  if (deep <= 0) return Infinity // 搜索层数限制

  for(let i = 0, len = array.length; i < len; i++) {
    if (array[i] == STR_NUM.EMPTY) {
      array[i] = currentChess
      var score = chessModel(array, currentChess, _deep)
      array[i] = STR_NUM.EMPTY
      score > 0 ? score++ : score--
      if (Math.abs(score) < Math.abs(best)) best = score // 找出所有结果里的最小值 
      if (Math.abs(score) === Math.abs(best)) best = score < best ? best : score // 相等时取正值
    }
  }
  return best
}

var fourToFive = function (array, currentChess) { // 四连五
  var count = 0
  for (let i = 0, len = array.length; i < len; i++) {
    if (array[i] == STR_NUM.EMPTY) {
      array[i] = currentChess
      let isFive = isWinFive(array, currentChess)
      if (isFive) {
        count++
      }
      array[i] = STR_NUM.EMPTY
    }
  }
  if (count >= 1) {
    if (count == 1) {
      return -1
    } else {
      return 1
    }
  } else {
    return Infinity
  }
}

var isWinFive = function (array, currentChess) { // 检测连五
  let str = array.join('')
  let reg_five = new RegExp(`${currentChess}{5,}`)
  if (reg_five.test(str)) {
    return true
  }
}

/*
WIN_FIVE: ooooo

ALIVE_FOUR: +oooo+

DIE_FOUR: +oooox  xoooo+  o+ooo+x  oo+oo

ALIVE_THREE: ++ooo+  +ooo++  o+oo

DIE_THREE: ++ooox  +o+oox  +oo+ox  o++oo  o+o+o  x+ooo+x

ALIVE_TWO: ++oo++  +o+o+  +o++o+

DIE_TWO: +++oox  ++o+ox  +o++ox  o+++o
*/