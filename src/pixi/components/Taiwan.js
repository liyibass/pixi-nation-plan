import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class Taiwan {
  constructor(position = { x: 0, y: 0 }) {
    this.container = new PIXI.Container()
    this.createTaiwan()
    this.x = position.x
    this.y = position.y
    this.setupPosition()
  }

  createTaiwan() {
    const texture = Globals.resources['taiwan']?.texture
    const sprite = new PIXI.Sprite(texture)
    sprite.anchor.set(0.5, 0.5)

    this.container.addChild(sprite)
  }

  setupPosition() {
    this.container.x = this.x
    this.container.y = this.y
  }
}
