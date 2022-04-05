import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

function getRunningLoopCount(playerType) {
  switch (playerType) {
    case 'tiger':
      return 4

    default:
    case 'player':
      return 6
  }
}

export class Player {
  constructor(position = { x: 0, y: 0, scale: 1 }) {
    this.scale = position.scale
    this.playerType = Globals.playerType || 'player'
    this.runningLoopCount = getRunningLoopCount(this.playerType)
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

  setupPlayerType(newPlayerType) {
    this.playerType = newPlayerType
  }

  createPlayer() {
    const texture = Globals.resources[`${this.playerType}`]?.texture

    this.playerSprite = new PIXI.Sprite(texture)
    this.container.addChild(this.playerSprite)
    this.playerSprite.anchor.set(0.5, 1)
    this.playerSprite.width *= this.scale
    this.playerSprite.height *= this.scale

    // save character's size to Globals
    Globals.playerWidth = this.playerSprite.width
    Globals.playerHeight = this.playerSprite.height
    Globals.textureScale = this.scale
    this.spriteHeight = this.playerSprite.height
  }

  createRunningPlayerSprite() {
    const textureArray = []
    for (let i = 0; i < this.runningLoopCount; i++) {
      const texture = Globals.resources[`${this.playerType}_${i}`]?.texture
      textureArray.push(texture)
    }
    this.runningPlayerSprite = new PIXI.AnimatedSprite(textureArray)

    const heightScale = this.spriteHeight / this.runningPlayerSprite.height
    this.runningPlayerSprite.width *= heightScale
    this.runningPlayerSprite.height *= heightScale

    this.runningPlayerSprite.anchor.set(0.5, 1)
    this.runningPlayerSprite.animationSpeed = 0.2

    // this.container.play()
  }

  changePlayerTexture(type) {
    switch (type) {
      case 'running':
        this.container.removeChild(this.playerSprite)
        this.container.addChild(this.runningPlayerSprite)
        this.runningPlayerSprite.play()
        break

      default:
      case 'stand':
        this.container.removeChild(this.runningPlayerSprite)
        this.container.addChild(this.playerSprite)
        this.runningPlayerSprite.stop()
        break
    }
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
    this.runningPlayerSprite.stop()

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
        this.runningPlayerSprite.play()

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
    this.runningPlayerSprite.stop()

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
        console.log(this.runningPlayerSprite)
        this.runningPlayerSprite?.start?.()
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
    this.runningPlayerSprite.stop()

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
          this.isJumping = false

          this.hasBeenTop = false
          this.jumpTicker.stop()
          this.container.y = this.standHeight
          this.runningPlayerSprite.play()
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
    this.runningPlayerSprite.stop()

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
}

function wait(delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delayTime)
  })
}
