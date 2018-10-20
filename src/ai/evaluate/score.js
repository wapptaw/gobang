import chessTypeGet from './chess_model'
import {STR_NUM} from '../config/chess_map'
import {scoreMap} from '../config/score_map'

// 获取所有分组,计算总得分
export default function (arr, currentChess) {
  var list = [], group = [], empty = 0, chess = 0
  var len = arr.length
  for (let i = 0; i < len; i++) {
    // 统计空位
    if (arr[i] == STR_NUM.EMPTY) {
      empty++
      if (arr[i + 1] != STR_NUM.EMPTY) {
        group.push({
          num: empty,
          type: STR_NUM.EMPTY
        })
        empty = 0
      }
    }
    // 统计给定棋子
    if (arr[i] == currentChess) {
      chess++
      if (arr[i + 1] != currentChess) {
        group.push({
          num: chess,
          type: currentChess
        })
        chess = 0
      }
    }
    // 遇非给定棋子分割
    if (i == len - 1 || arr[i] != STR_NUM.EMPTY && arr[i] != currentChess) {
      if (arr[i + 1] == STR_NUM.EMPTY || arr[i + 1] == currentChess || i == len - 1) {
        // 统计两个非给定棋子之间的给定棋子和空位和是否大于5
        let emptyCount = 0, currentCount = 0
        group.forEach(v => {
          if (v.type == STR_NUM.EMPTY) emptyCount += v.num
          if (v.type == currentChess) currentCount += v.num
        })
        if (currentCount > 1 && emptyCount + currentCount > 4) {
          list.push(group)
        }
        group = []
      }
    }
  }
  var score = list.reduce((a, b) => {
    return a + groupScore(b, currentChess)
  }, 0)
  return score
}

// 计算单组的最高分
var groupScore = function (group, currentChess) {
  var best = 0, count = 0
  var len = group.length
  for (let i = 0; i < len; i++) {
    if (group[i].type == currentChess) {
      count++
    }
  }
  var sortList = sortAll(count)
  var score = mapScore(group, currentChess)
  sortList.forEach(v => {
    let single = 0
    for (let i = 0, vLen = v.length; i < vLen; i++) {
      single += score[i][v[i] - 1] // 映射表是0开头的，所以这里要减一
    }
    if (single > best) {
      best = single
    }
  })
  return best
}

// 分数映射
var mapScore = function (arr, currentChess) {
  var score = [], count = 0
  var len = arr.length
  for (let i = 0; i < len; i++) {
    if (arr[i].type == currentChess) {
      count++
    }
  }
  for (let i = 0; i < count; i++) {
    score[i] = []
    for (let j = 0; j < count - i; j++) {
      score[i][j] = singleScore(arr, currentChess, {
        start: i + 1,
        end: j + 1
      })
    }
  }
  return score
}

// 单序列得分, arr原数组，currentChess当前求取的棋色，index需要求取片段的位置
var singleScore = function (arr, currentChess, index) {
  var count = 0, left = 0, right = 0, startIndex = -1, endIndex = -1, centerArr = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].type == currentChess) {
      count++
    }
    if (startIndex < 0 && count == index.start) {
      if (i == 0) {
        left = 0
      } else {
        if (arr[i - 1].num > 4) {
          left = 4
        } else {
          left = arr[i - 1].num
        }
      }
      startIndex = i
    }
    if (endIndex < 0 && count == index.start + index.end - 1) {
      if (i == arr.length - 1) {
        right = 0
      } else {
        if (arr[i + 1].num > 4) {
          right = 4
        } else {
          right = arr[i + 1].num
        }
      }
      endIndex = i
    }
  }
  centerArr = arr.slice(startIndex, endIndex + 1)
  var centerArrComplete = []
  for (let i = 0, len = centerArr.length; i < len; i++) {
    let temp = new Array(centerArr[i].num).fill(centerArr[i].type)
    centerArrComplete = centerArrComplete.concat(temp)
  }
  if (centerArrComplete.length + left + right < 5) {
    return 0
  } else {
    let array = new Array(left).fill(STR_NUM.EMPTY).concat(centerArrComplete).concat(new Array(right).fill(STR_NUM.EMPTY)) // 拼接数组
    let chessType = chessTypeGet(array, currentChess)
    return scoreMap[chessType]
  }
}

// 获取单组所有可能的组合情况
var sortAll = function (n) {
  var list = []
  var listGet = function (n, arr) {
    if (n == 0) {
      list.push(arr)
    }

    for (let i = 1; i <= n; i++) {
      listGet(n - i, arr.concat(i))
    }
  }
  listGet(n, [])
  return list
}
