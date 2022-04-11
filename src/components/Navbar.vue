<template>
  <div class="navbar">
    <a
      class="navbar__home"
      href="https://www.readr.tw/"
      target="_blank"
      @click="logoHandler"
    >
      <img :src="require('@/assets/images/readr.png')" />
    </a>

    <a
      class="navbar__donate"
      href="https://www.readr.tw/donate"
      target="_blank"
    >
      <img :src="require('@/assets/images/donate.png')" />
    </a>
  </div>
</template>

<script>
import gaHandler from '../gaHandler'

export default {
  methods: {
    logoHandler() {
      gaHandler.gaClickHandler('back to home')
    },
  },
}
</script>
<style>
.navbar {
  background: white;
  position: absolute;
}

.navbar__home {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 36px;
  height: 36px;
  cursor: pointer;
}

.navbar__donate {
  position: absolute;
  left: calc(100vw - 24px - 10px);
  top: 10px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
