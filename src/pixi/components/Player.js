import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class Player {
  constructor(position = { x: 0, y: 0 }) {
    this.createSprite()
    this.x = position.x
    this.y = position.y
    this.setupPosition()
    // this.setInteractive()
    this.dragging = false

    this.isJumping = false
  }

  createSprite() {
    const texture = Globals.resources['player']?.texture

    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 1)
  }

  setupPosition() {
    this.sprite.x = this.x
    this.sprite.y = this.y
  }

  async lookAround(time = 2) {
    for (let i = 0; i < time; i++) {
      this.sprite.scale.x *= -1
      await wait(600)
    }
  }

  jump() {
    if (this.isJumping) return
    this.isJumping = true

    let time = 0
    const v0 = 20
    const gravity = 1
    const direction = -1 //to Top
    const jumpAtY = this.sprite.y

    this.jumpTicker = new PIXI.Ticker()
    this.jumpTicker.add((deltaMs) => {
      const jumpHeight = v0 * time + (1 / 2) * -gravity * Math.pow(time, 2)

      if (jumpHeight < 0) {
        this.isJumping = false
        this.jumpTicker.stop()
        this.sprite.y = jumpAtY
        return
      }

      this.sprite.y = jumpAtY + jumpHeight * direction
      time += deltaMs
    })

    this.jumpTicker.start()
  }
}

function wait(delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delayTime)
  })
}
