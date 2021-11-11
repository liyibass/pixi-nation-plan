import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { GroundGroup } from '../components/GroundGroup'

export class SnakeScene {
  constructor() {
    this.container = new PIXI.Container()

    this.createSnakeScene()
  }

  createBackground() {
    const bg = new PIXI.Graphics()
    bg.lineStyle(4, 0x00000, 1)
    bg.beginFill(0x92b79c)
    bg.drawRect(0, 0, Globals.width, Globals.height)
    bg.endFill()

    this.container.addChild(bg)
  }

  createSnakeScene() {
    this.createBackground()
    console.log()

    const groundGroupPosition = Globals.groundPosition()

    this.groundGroup = new GroundGroup(groundGroupPosition)
    this.container.addChild(this.groundGroup.container)
  }
}
