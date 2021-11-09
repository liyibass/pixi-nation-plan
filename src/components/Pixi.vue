<template>
    <div class="pixi" ref="pixi"></div>
</template>

<script>
import * as PIXI from 'pixi.js'
// let type = 'WebGL'
// if (!PIXI.utils.isWebGLSupported()) {
//     type = 'canvas'
// }
// import player from '../pixi/components/player/index'
import menu from '../pixi/stages/menu'

const WIDTH = 375
const HEIGHT = 812

export default {
    name: 'pixi',
    async mounted() {
        initGame()

        //Create a Pixi Application

        // Load the bunny texture
        // app.loader
        //     .add('player', '../pixi/components/player/player1.png')
        //     .load(startup)

        // function startup() {
        //     console.log('startup')

        //     // create a new Sprite from an image path
        //     const x = new PIXI.Sprite(app.loader.resources.player.texture)
        //     console.log(app.loader)
        //     // center the sprite's anchor point
        //     x.anchor.set(0.5)
        //     app.stage.addChild(x)
        // }
        function initGame() {
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
        }
    },
}
</script>

<style scoped></style>
