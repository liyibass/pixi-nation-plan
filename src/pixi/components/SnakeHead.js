import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class SnakeHead {
  constructor(position = { x: 0, y: 0 }) {
    this.createSprite()
    this.setupPosition(position.x, position.y)
    // this.setInteractive()
    this.dragging = false
  }

  createSprite() {
    const texture = Globals.resources['snakeHead']?.texture

    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
    this.sprite.pivot.set(0.5, 0.5)
  }

  setupPosition(x, y) {
    this.sprite.x = x
    this.sprite.y = y
  }
}
