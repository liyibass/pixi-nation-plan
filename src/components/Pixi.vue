<template>
    <transition name="fade" mode="out-in">
        <Loading v-if="!loaded" @start="startHandler" :progress="progress" />
    </transition>

    <div class="pixi" ref="pixi" />
</template>

<script>
// import player from '../pixi/components/player/index'
import Loading from '../components/Loading.vue'
// import loadingPage from '../pixi/stages/loadingPage'

import { App } from '../pixi/script/App'

// const WIDTH = 375
// const HEIGHT = 812

export default {
    name: 'pixi',
    components: { Loading },
    data() {
        return {
            progress: 0,
            loaded: false,
        }
    },
    methods: {
        startHandler() {
            this.loaded = true
        },
    },
    async mounted() {
        const app = new App(this)
        app.run()
    },
}
</script>

<style></style>
