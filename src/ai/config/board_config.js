import {STR_NUM} from './chess_map'

export default {
  sente: 'COMPUTED', // 先手
  deep: 4, // 思考层数

  get aiChess () {
    switch (this.sente) {
      case 'COMPUTED':
        return STR_NUM.BLACK
      case 'PERSON':
        return STR_NUM.WHITE
      default:
        throw new Error('先手信息错误')
    } 
  }
}