<template>
  <transition name="fade" mode="out-in">
    <Loading v-if="!loaded" @start="startHandler" :progress="progress" />
  </transition>

  <div class="pixi" ref="pixi" />
  <div class="shareDialog" v-if="isHandlingShare">
    <a :href="fbUrl" target="_blank" @click="shareClickHandler('fb')"
      ><img :src="require('../assets/images/facebook.png')" alt=""
    /></a>
    <a :href="lineUrl" target="_blank" @click="shareClickHandler('line')"
      ><img :src="require('../assets/images/line.png')" alt=""
    /></a>
  </div>
</template>

<script>
// import player from '../pixi/components/player/index'
import Loading from '../components/Loading.vue'
// import loadingPage from '../pixi/stages/loadingPage'

import { App } from '../pixi/script/App'
import { shareUtil } from '../pixi/script/Utils'
import ga from '../gaHandler'

// const WIDTH = 375
// const HEIGHT = 812

export default {
  name: 'pixi',
  components: { Loading },
  data() {
    return {
      progress: 0,
      loaded: false,
      isHandlingShare: false,
      projectUrl: 'https://www.readr.tw/project/3/nation-plan',
    }
  },
  computed: {
    fbUrl() {
      return `https://www.facebook.com/sharer/sharer.php?u=${this.projectUrl}`
    },
    lineUrl() {
      return `http://line.naver.jp/R/msg/text/?nation-plan%0D%0A${this.projectUrl}`
    },
  },
  methods: {
    startHandler() {
      this.loaded = true
    },
    handlingShareToggle(boolean, gameName) {
      this.isHandlingShare = boolean || true
      this.gameName = gameName
    },
    shareClickHandler(shareSite) {
      this.gaClickHandler(`${this.gameName}/share/${shareSite}`)
      this.isHandlingShare = false
      shareUtil.doneShare()
    },
    gaClickHandler(event_label) {
      // console.log(eventLabel)
      this.$gtag.event('click', {
        event_category: 'projects',
        event_label,
      })
    },
    gaScrollHandler(event_label) {
      // console.log(eventLabel)
      this.$gtag.event('scroll', {
        event_category: 'projects',
        event_label,
      })
    },
  },
  async mounted() {
    const app = new App(this)
    app.run()

    shareUtil.shareHandler = this.handlingShareToggle.bind(this)
    ga.gaClickHandler = this.gaClickHandler.bind(this)
    ga.gaScrollHandler = this.gaScrollHandler.bind(this)
  },
}
</script>

<style>
.pixi {
  height: 100vh;
}

.shareDialog {
  position: fixed;

  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: row;
}

.shareDialog > a {
  flex: 1;
  opacity: 0;
}
</style>
