<template>
  <div class="app">
    <navbar />
    <Pixi />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Pixi from './components/Pixi.vue'

export default {
  name: 'App',
  components: {
    Pixi,
    Navbar,
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
  position: fixed;
  top: 0%;
  left: 0%;
  height: 100%;

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
