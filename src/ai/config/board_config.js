export default {
  sente: 'COMPUTED', // 先手
  deep: 4, // 思考层数

  get chessType () {
    switch (this.sente) {
      case 'COMPUTED':
        return 'BLACK'
      case 'PERSON':
        return 'WHITE'
      default:
        throw new Error('先手信息错误')
    } 
  }
}