import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class Player {
  constructor(position = { x: 0, y: 0 }) {
    this.createSprite()
    this.x = position.x
    this.y = position.y
    this.setupPosition()
    this.setInteractive()
    this.dragging = false
  }

  createSprite() {
    const texture = Globals.resources['player']?.texture

    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
  }

  setupPosition() {
    this.sprite.x = this.x
    this.sprite.y = this.y
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

  async lookAround(time = 2) {
    for (let i = 0; i < time; i++) {
      this.sprite.scale.x *= -1
      await wait(600)
    }
  }
}

function wait(delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delayTime)
  })
}
