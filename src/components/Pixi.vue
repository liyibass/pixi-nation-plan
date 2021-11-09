<template>
    <transition name="fade" mode="out-in">
        <Loading v-if="!loaded" @start="startHandler" :progress="progress" />
    </transition>

    <div class="pixi" ref="pixi" />
</template>

<script>
import * as PIXI from 'pixi.js'

// let type = 'WebGL'
// if (!PIXI.utils.isWebGLSupported()) {
//     type = 'canvas'
// }
// import player from '../pixi/components/player/index'
import Loading from '../components/Loading.vue'
// import loadingPage from '../pixi/stages/loadingPage'
import menu from '../pixi/stages/menu'
import loadMedia from '../pixi/utils/loader'

const WIDTH = 375
const HEIGHT = 812

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
        await loadMedia(this)

        //Create a Pixi Application
        const app = new PIXI.Application({
            width: WIDTH,
            height: HEIGHT,
        })
        document.querySelector('.pixi').appendChild(app.view)

        menu.x = app.screen.width / 2
        menu.y = app.screen.height / 2
        app.stage.addChild(menu)

        onResize()
        window.onresize = onResize

        function onResize() {
            var w = window.innerWidth
            var h = window.innerHeight
            var scale = Math.min(w / WIDTH, h / HEIGHT)
            app.view.style.left = (w - scale * WIDTH) / 2 + 'px'
            app.view.style.top = (h - scale * HEIGHT) / 2 + 'px'
            app.view.style.width = scale * WIDTH + 'px'
            app.view.style.height = scale * HEIGHT + 'px'
        }
    },
}
</script>

<style></style>
