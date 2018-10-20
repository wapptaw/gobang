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

  read (row, col) { // 读取
    return this.matrix[row][col]
  }

  put (row, col, point_type_str) { // 下子
    this.matrix[row][col] = STR_NUM[point_type_str]
  }

  remove (row, col) { // 还原
    this.matrix[row][col] = pointType.EMPTY
  }

  get length () { // 长度
    return this.matrix.length
  }
}