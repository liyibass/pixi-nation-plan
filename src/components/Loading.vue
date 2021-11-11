<template>
  <div class="loading">
    <transition name="loadFade" mode="out-in">
      <div class="loading__progress">{{ progressInInteger }}%</div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      isRequired: true,
      default: 0,
    },
  },

  computed: {
    isLoaded() {
      return this.progress === 100
    },
    progressInInteger() {
      return Math.floor(this.progress)
    },
  },
  watch: {
    isLoaded: function () {
      setTimeout(() => {
        this.$emit('start')
      }, 500)
    },
  },
}
</script>

<style scoped>
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.loading__enter {
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;
  width: 80%;
  height: 80%;

  display: flex;
  justify-content: center;
  align-items: center;

  animation-name: beat;
  animation-delay: 1.5s;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}
</style>
