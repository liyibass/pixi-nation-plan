import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

const DIALOG_WIDTH = window.innerWidth
const DIALOG_HEIGHT = (window.innerHeight * 2) / 5 - 50

export class GameTitle {
  constructor(gameName) {
    this.container = new PIXI.Container()
    this.gameName = gameName
    this.init()
  }

  init() {
    this._createBackground()
    this.createTitle()
  }

  _createBackground() {
    this.bg = new PIXI.Graphics()
    this.bg.beginFill(0x000000)
    this.bg.drawRect(0, 0, Globals.width, Globals.height)
    this.bg.endFill()
    this.bg.alpha = 0.7

    this.container.addChild(this.bg)
  }

  createTitle() {}

  // destorySpeakDialog() {
  //   this.talkTicker?.destroy?.()
  //   this.arrowTicker?.destroy?.()
  // }
}
