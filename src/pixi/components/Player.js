import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class Player {
  constructor(position = { x: 0, y: 0 }) {
    this.createSprite()
    this.sprite.x = position.x
    this.sprite.y = position.y
    this.setInteractive()
    this.dragging = false
  }

  createSprite() {
    const texture = Globals.resources['player']?.texture

    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
  }

  setInteractive() {
    this.sprite.interactive = true

    this.sprite.on('mousedown', this.onTouchStart.bind(this))
    this.sprite.on('mousemove', this.onTouchMove.bind(this))
  }

  onTouchStart(event) {
    // 1. remember the position of the mouse cursor
    this.touchPosition = {
      x: event.data.global.x,
      y: event.data.global.y,
    }

    // 2.set the dragging state for this sprite
    this.dragging = !this.dragging
  }
  onTouchMove(event) {
    if (!this.dragging) return

    // 1. get the corrdinates of ther cursor
    const currentPosition = {
      x: event.data.global.x,
      y: event.data.global.y,
    }

    // 3. apply the rusulting offset
    this.sprite.x = currentPosition.x
    this.sprite.y = currentPosition.y
  }
}
