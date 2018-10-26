import {STR_NUM} from './config/chess_map'

export default class Matrix {
  constructor (size) {
    let matrix = []
    for (let row = 0; row < size; row++) {
      matrix[row] = []
      for (let col = 0; col < size; col++) {
        matrix[row][col] = 0
      }
    }
    this.matrix = matrix
  }

  readPoint (row, col) { // 读取点
    return this.matrix[row][col]
  }

  readRow (row) { // 读取整行
    return this.matrix[row]
  }

  readColumn (col) { // 读取整列
    let column = []
    for (let i = 0; i < this.length; i++) {
      column.push(this.readPoint(i, col))
    }
    return column
  }

  readLeft (row, col) { // 读取左斜行
    var line = [], r = 0, c = 0, len = 0
    var diff = row - col
    if (diff < 0) {
      r = 0
      c = Math.abs(diff)
      len = this.length - c
    } else {
      r = diff
      c = 0
      len = this.length - r
    }
    for (let i = r, j = c; i < len; i++, j++) {
      line.push(this.readPoint(i, j))
    }
    return line
  }

  readRight (row, col) { // 读取右斜行
    var line = [], r = 0, c = 0, len = 0
    var max = this.length - 1
    if (row + col > max) {
      r = row + col - max
      c = max
      len = this.length
    } else {
      r = 0
      c = row + col
      len = c + 1
    }
    for (let i = r, j = c; i < len; i++, j--) {
      line.push(this.readPoint(i, j))
    }
    return line
  }

  put (row, col, currentChess) { // 下子
    this.matrix[row][col] = currentChess
  }

  remove (row, col) { // 还原
    this.matrix[row][col] = STR_NUM.EMPTY
  }

  get length () { // 长度
    return this.matrix.length
  }
}