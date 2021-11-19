import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class PauseGame {
  constructor(pauseMenuButtons) {
    this.container = new PIXI.Container()
    this.pauseMenuButtons = pauseMenuButtons
    this.init()
  }
  init() {
    const mask = new PIXI.Graphics()
    mask.beginFill(0x000000)
    mask.drawRect(0, 0, Globals.width, Globals.height)
    mask.endFill()
    mask.alpha = 0.6

    this.container.addChild(mask, this.pauseMenuButtons.container)

    const menuPosition = Globals.getSnakeMenuPosition()
    this.pauseMenuButtons.container.x = menuPosition.x
    this.pauseMenuButtons.container.y = menuPosition.y
  }
}
