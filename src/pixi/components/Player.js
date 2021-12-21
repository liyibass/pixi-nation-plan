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
    this.initStandHeight = 0
    this.standHeight = 0
    this.isFalling = false
    this.hasBeenTop = false
    this.touchedObstacleIndex = null
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
    const v0 = 17
    const gravity = 0.7
    const direction = -1 //to Top
    const jumpAtY = this.sprite.y
    // const jumpAtY = this.sprite.y

    this.jumpTicker = new PIXI.Ticker()
    this.jumpTicker.add((deltaMs) => {
      // console.log('jumpTicker')
      const jumpHeight = v0 * time + (1 / 2) * -gravity * Math.pow(time, 2)
      const v = v0 - gravity * time
      if (v < 0) {
        this.hasBeenTop = true
      }

      if (v < 0 && this.sprite.y > this.standHeight) {
        console.log('JUMP STOP')
        this.isJumping = false

        this.hasBeenTop = false
        this.jumpTicker.stop()
        this.sprite.y = this.standHeight
        return
      }

      this.sprite.y = jumpAtY + jumpHeight * direction
      time += deltaMs
    })

    this.jumpTicker.start()
  }

  fall() {
    console.log('fall')
    // console.log(this.sprite.y)
    // console.log(this.initStandHeight)
    // console.log(this.isJumping)
    // console.log(this.isFalling)
    if (this.sprite.y === this.initStandHeight) return
    if (this.isJumping || this.isFalling) return
    this.isFalling = true

    let time = 0
    const v0 = 0
    const gravity = 0.8
    const direction = -1 //to Top
    const fallAtY = this.sprite.y
    // const jumpAtY = this.sprite.y

    this.fallTicker = new PIXI.Ticker()
    this.fallTicker.add((deltaMs) => {
      const jumpHeight = v0 * time + (1 / 2) * -gravity * Math.pow(time, 2)

      if (this.sprite.y > this.initStandHeight) {
        this.fallTicker.stop()
        this.isFalling = false

        this.standHeight = this.initStandHeight
        this.sprite.y = this.standHeight
        return
      }

      this.sprite.y = fallAtY + jumpHeight * direction
      time += deltaMs
    })

    this.fallTicker.start()
  }

  setStandHeight(newStandHeight) {
    this.y = newStandHeight
    this.standHeight = newStandHeight
  }

  jumpIn(groundPlayer) {
    const { x: groundX, y: groundY } = groundPlayer.sprite.getGlobalPosition()
    const { x: playerX, y: playerY } = this.sprite.getGlobalPosition()
    const { x: destX, y: destY } = this.sprite
    const fromX = destX + (groundX - playerX)
    const fromY = destY + (groundY - playerY)

    this.sprite.x = fromX
    this.sprite.y = fromY

    if (this.isJumping) return
    this.isJumping = true

    let time = 0
    const v0 = 24
    const gravity = 0.7
    const direction = -1 //to Top
    const jumpAtY = groundY
    // const jumpAtY = this.sprite.y

    this.jumpTicker = new PIXI.Ticker()
    this.jumpTicker.add((deltaMs) => {
      if (this.sprite.x > destX) {
        this.sprite.x--
      }
      // console.log('jumpTicker')
      const jumpHeight = v0 * time + (1 / 2) * -gravity * Math.pow(time, 2)
      const v = v0 - gravity * time
      if (v < 0) {
        this.hasBeenTop = true
      }

      if (v < 0 && this.sprite.y > playerY) {
        console.log('JUMP STOP')
        this.isJumping = false

        this.hasBeenTop = false
        this.jumpTicker.stop()
        this.sprite.y = playerY
        return
      }

      this.sprite.y = jumpAtY + jumpHeight * direction
      time += deltaMs
    })

    this.jumpTicker.start()
  }

  jumpOut(groundPlayer) {
    const { x: groundX, y: groundY } = groundPlayer.sprite.getGlobalPosition()
    const { x: playerX, y: playerY } = this.sprite.getGlobalPosition()

    const destX = this.sprite.x + (groundX - playerX)
    const destY = this.sprite.y + (groundY - playerY)

    if (this.isJumping) return
    this.isJumping = true

    let time = 0
    const v0 = 24
    const gravity = 0.7
    const direction = -1 //to Top
    const jumpAtY = this.sprite.y
    // const jumpAtY = this.sprite.y

    this.jumpTicker = new PIXI.Ticker()
    this.jumpTicker.add((deltaMs) => {
      if (this.sprite.x < destX) {
        this.sprite.x += 5
      }
      // console.log('jumpTicker')
      const jumpHeight = v0 * time + (1 / 2) * -gravity * Math.pow(time, 2)
      const v = v0 - gravity * time
      if (v < 0) {
        this.hasBeenTop = true
      }

      if (v < 0 && this.sprite.y > destY) {
        console.log('JUMP STOP')
        this.isJumping = false

        this.hasBeenTop = false
        this.jumpTicker.stop()
        this.sprite.y = destY
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
