import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class Ground {
  constructor(position = { x: 0, y: 0 }) {
    this.createGround()
    this.x = position.x
    this.y = position.y
    this.setupPosition()
  }

  createGround() {
    const texture = Globals.resources['ground']?.texture
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
  }

  setupPosition() {
    this.sprite.x = this.x
    this.sprite.y = this.y
  }
}
