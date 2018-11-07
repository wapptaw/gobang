<template>
  <div>
    <board></board>
  </div>
</template>

<script>
export default {
  name: 'app',

  components: {
    board: () => import('./page/board.vue')
  }
}
</script>

<style lang="scss">
  @import './static/style/init.scss'
</style>
