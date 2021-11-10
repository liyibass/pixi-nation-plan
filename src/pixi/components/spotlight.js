import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class Spotlight {
  constructor(position = { x: 0, y: 0 }) {
    this.createSpotlight()
    this.x = position.x
    this.y = position.y
    this.setupPosition()
  }

  createSpotlight() {
    const texture = Globals.resources['spotlight']?.texture
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 1)
  }

  setupPosition() {
    this.sprite.x = this.x
    this.sprite.y = this.y
  }
}
