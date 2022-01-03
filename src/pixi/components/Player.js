import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class Player {
  constructor(position = { x: 0, y: 0 }) {
    this.container = new PIXI.Container()
    this.createPlayer()
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

  createPlayer() {
    const texture = Globals.resources['player']?.texture

    this.playerSprite = new PIXI.Sprite(texture)
    this.container.addChild(this.playerSprite)
    this.playerSprite.anchor.set(0.5, 1)
  }

  setupPosition() {
    this.container.x = this.x
    this.container.y = this.y
  }

  async lookAround(time = 2) {
    for (let i = 0; i < time; i++) {
      this.container.scale.x *= -1
      await wait(600)
    }
  }

  jump() {
    if (this.isJumping) return
    this.isJumping = true

    let time = 0
    const v0 = 15
    const gravity = 0.5
    const direction = -1 //to Top
    const jumpAtY = this.container.y
    // const jumpAtY = this.container.y

    this.jumpTicker = new PIXI.Ticker()
    this.jumpTicker.add((deltaMs) => {
      // console.log('jumpTicker')
      const jumpHeight = v0 * time + (1 / 2) * -gravity * Math.pow(time, 2)
      const v = v0 - gravity * time
      if (v < 0) {
        this.hasBeenTop = true
      }

      if (v < 0 && this.container.y > this.standHeight) {
        // console.log('JUMP STOP')
        this.isJumping = false

        this.hasBeenTop = false
        this.jumpTicker.stop()
        this.container.y = this.standHeight
        return
      }

      this.container.y = jumpAtY + jumpHeight * direction
      time += deltaMs
    })

    this.jumpTicker.start()
  }

  fall() {
    // console.log('fall')
    // console.log(this.container.y)
    // console.log(this.initStandHeight)
    // console.log(this.isJumping)
    // console.log(this.isFalling)
    if (this.container.y === this.initStandHeight) return
    if (this.isJumping || this.isFalling) return
    this.isFalling = true

    let time = 0
    const v0 = 0
    const gravity = 0.5
    const direction = -1 //to Top
    const fallAtY = this.container.y
    // const jumpAtY = this.container.y

    this.fallTicker = new PIXI.Ticker()
    this.fallTicker.add((deltaMs) => {
      const jumpHeight = v0 * time + (1 / 2) * -gravity * Math.pow(time, 2)

      if (this.container.y > this.initStandHeight) {
        this.fallTicker.stop()
        this.isFalling = false

        this.standHeight = this.initStandHeight
        this.container.y = this.standHeight
        return
      }

      this.container.y = fallAtY + jumpHeight * direction
      time += deltaMs
    })

    this.fallTicker.start()
  }

  setStandHeight(newStandHeight) {
    this.y = newStandHeight
    this.standHeight = newStandHeight
  }

  jumpIn(groundPlayer) {
    const { x: groundX, y: groundY } =
      groundPlayer.container.getGlobalPosition()
    const { x: playerX, y: playerY } = this.container.getGlobalPosition()
    const { x: destX, y: destY } = this
    const fromX = destX + (groundX - playerX)
    const fromY = destY + (groundY - playerY)

    this.container.x = fromX
    this.container.y = fromY

    if (this.isJumping) return
    this.isJumping = true

    let time = 0
    const v0 = 24
    const gravity = 0.5
    const direction = -1 //to Top
    const jumpAtY = groundY
    // const jumpAtY = this.container.y

    this.jumpTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.jumpTicker.add((deltaMs) => {
        if (this.container.x > destX) {
          this.container.x--
        }
        // console.log('jumpTicker')
        const jumpHeight = v0 * time + (1 / 2) * -gravity * Math.pow(time, 2)
        const v = v0 - gravity * time
        if (v < 0) {
          this.hasBeenTop = true
        }
        if (v < 0 && this.container.y >= destY - this.container.height / 2) {
          this.jumpTicker.stop()
          // console.log('JUMP STOP')

          this.isJumping = false

          this.hasBeenTop = false
          this.container.y = 0

          this._changePlayerTexture('run')
          resolve()
        }

        this.container.y = jumpAtY + jumpHeight * direction
        time += deltaMs
      })

      this.jumpTicker.start()
    })
  }

  jumpOut(groundPlayer) {
    if (this.jumpTicker.started) this.jumpTicker.stop()

    const { x: groundX, y: groundY } =
      groundPlayer.container.getGlobalPosition()
    const { x: playerX, y: playerY } = this.container.getGlobalPosition()

    const destX = this.container.x + (groundX - playerX)
    const destY =
      this.container.y + (groundY - playerY) - this.container.height / 2

    this.isJumping = true

    let time = 0
    const v0 = 10
    const gravity = 0.5
    const direction = -1 //to Top
    const jumpAtY = this.container.y
    // const jumpAtY = this.container.y

    this.jumpTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.jumpTicker.add((deltaMs) => {
        if (this.container.x < destX) {
          this.container.x += 5
        }
        // console.log('jumpTicker')
        const jumpHeight = v0 * time + (1 / 2) * -gravity * Math.pow(time, 2)
        const v = v0 - gravity * time
        if (v < 0) {
          this.hasBeenTop = true
        }

        if (v < 0 && this.container.y > destY) {
          // console.log('JUMP STOP')
          this.jumpTicker.stop()
          this.isJumping = false

          this.hasBeenTop = false
          this.container.y = destY
          resolve()
        }

        this.container.y = jumpAtY + jumpHeight * direction
        time += deltaMs
      })

      this.jumpTicker.start()
    })
  }

  _changePlayerTexture(type) {
    if (type === 'run') {
      // const textureArray = []
      // for (let i = 0; i < 6; i++) {
      //   const texture = Globals.resources[`player_${i}`]?.texture
      //   textureArray.push(texture)
      // }
      // this.container = new PIXI.AnimatedSprite(textureArray)
      // this.container.anchor.set(0.5, 1)
      // console.log(this.initStandHeight)
      // this.y = this.initStandHeight
      // this.standHeight = this.initStandHeight
      // this.container.y = 300
      // // this.container.play()
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
