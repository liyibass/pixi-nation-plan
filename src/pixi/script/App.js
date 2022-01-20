import * as PIXI from 'pixi.js'
// let type = 'WebGL'
// if (!PIXI.utils.isWebGLSupported()) {
//     type = 'canvas'
// }
import { Loader } from './Loader'
import { MainScene } from '../scenes/MainScene'
import { Globals } from '../script/Globals'

// import menu from '../stages/menu'
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
Globals.outerWidth = WIDTH
Globals.outerHeight = HEIGHT
// const WIDTH = 375
// const HEIGHT = 812
// const MOBILE_HEIGHT = 812
// const MOBILE_WIDTH = (window.innerHeight * 375) / 812

export class App {
  constructor(topLevelThis) {
    this.topLevelThis = topLevelThis
  }

  async run() {
    // add pixi application
    this.app = new PIXI.Application({
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: '0xeeeeee',
      antialias: true,
      resolution: 2,
    })
    // add app to global object
    Globals.app = this.app
    this.app.renderer.autoDensity = true
    this.app.renderer.resize(window.innerWidth, window.innerHeight)

    // add a canvas into DOM with pixi app
    document.querySelector('.pixi').appendChild(this.app.view)

    // create a Loader Class and pass in pixi app's loader
    this.loader = new Loader(this.app.loader, this.topLevelThis)
    await this.loader.preload()
    this.start()
  }

  start() {
    // menu.x = this.app.screen.width / 2
    // menu.y = this.app.screen.height / 2
    // this.app.stage.addChild(menu)

    this.scene = new MainScene()
    this.app.stage.addChild(this.scene.container)

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

    Globals.width = scale * WIDTH
    Globals.height = scale * HEIGHT
  }
}

// export default initPixi
