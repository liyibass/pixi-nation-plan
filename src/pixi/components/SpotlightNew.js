import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class Spotlight {
  constructor(position = { x: 0, y: 0, width: 1 }) {
    this.width = position.width
    this.createSpotlight()
    this.x = position.x
    this.y = position.y
    this.setupPosition()
  }

  createSpotlight() {
    const texture = Globals.resources['spotlight']?.texture
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 1)
    this.sprite.width = this.width
    this.sprite.height = window.innerHeight
  }

  setupPosition() {
    this.sprite.x = this.x
    this.sprite.y = this.y
  }
}
