<template>
  <Pixi />
</template>

<script>
import Pixi from './components/Pixi.vue'

export default {
  name: 'App',
  components: {
    Pixi,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter, .fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
</style>
