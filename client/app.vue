<template>
  <div id="app">
    <div class="cover"></div>
    <Header></Header>
    <Todo></Todo>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './Common/header.vue'
import Footer from './Common/footer.vue'
import Todo from './Components/Todo/todo.vue'
export default {
  components: {
    Header,
    Footer,
    Todo
  }
}
</script>

<style lang="stylus"  type="text/stylus" scoped>
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.cover {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #999;
  opacity: 0.3;
  z-index: -1;
}
</style>
