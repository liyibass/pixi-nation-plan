import * as PIXI from 'pixi.js'
// let type = 'WebGL'
// if (!PIXI.utils.isWebGLSupported()) {
//     type = 'canvas'
// }
import { Loader } from './Loader'

import menu from '../stages/menu'
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
// const MOBILE_HEIGHT = 812
// const MOBILE_WIDTH = (window.innerHeight * 375) / 812

export class App {
    constructor(topLevelThis) {
        this.topLevelThis = topLevelThis
    }

    run() {
        // add pixi application
        this.app = new PIXI.Application({
            width: WIDTH,
            height: HEIGHT,
        })

        // add a canvas into DOM with pixi app
        document.querySelector('.pixi').appendChild(this.app.view)

        // create a Loader Class and pass in pixi app's loader
        this.loader = new Loader(this.app.loader, this.topLevelThis)
        this.loader.preload()

        menu.x = this.app.screen.width / 2
        menu.y = this.app.screen.height / 2
        this.app.stage.addChild(menu)

        //設定遊戲大小隨視窗大小改變
        this.onResize()
        window.onresize = this.onResize
    }

    onResize() {
        var w = window.innerWidth
        var h = window.innerHeight
        var scale = Math.min(w / WIDTH, h / HEIGHT)
        this.app.view.style.left = (w - scale * WIDTH) / 2 + 'px'
        this.app.view.style.top = (h - scale * HEIGHT) / 2 + 'px'
        this.app.view.style.width = scale * WIDTH + 'px'
        this.app.view.style.height = scale * HEIGHT + 'px'
    }
}

// export default initPixi
