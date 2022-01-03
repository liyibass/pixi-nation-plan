import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
import { Obstacle } from './Obstacle'
// const gameStageDimention = Globals.getRunGameStageDimention()

export class Chimney extends Obstacle {
  constructor(index = 0, collisionMonitor = () => {}) {
    super()
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'chimney'

    this.createChimney()
    this.isInWindow = false
    this.isInOperate = true
    this.vibrateDirection = this.index % 2 ? 'right' : 'left'

    this._setWidthAndHeight()
  }

  createChimney() {
    const chimneyTexture = new PIXI.Texture(
      Globals.resources[`chimney${Math.floor(this.index % 4)}`]?.texture
    )
    this.chimneySprite = new PIXI.Sprite(chimneyTexture)

    this.container.addChild(this.chimneySprite)

    this.chimneySprite.pivot.set(
      this.chimneySprite.width / 2,
      this.chimneySprite.height
    )

    this.fireSprite = this._createFireSprite()
    this.container.addChild(this.fireSprite)

    if (this.index % 4 === 0) {
      this.fireSprite2 = this._createFireSprite()
      this.container.addChild(this.fireSprite2)

      this.fireSprite.x -= 14
      this.fireSprite2.x += 14
    }
    // for (let i = 0; i < this.index===0?2:1; i++) {

    // }
  }

  _createFireSprite() {
    const textureArray = []

    for (let i = 0; i < 4; i++) {
      const texture = new PIXI.Texture(Globals.resources[`fire_${i}`]?.texture)
      textureArray.push(texture)
    }

    const fireSprite = new PIXI.AnimatedSprite(textureArray)

    fireSprite.pivot.set(fireSprite.width / 2, fireSprite.height)
    fireSprite.y = -this.chimneySprite.height
    fireSprite.animationSpeed = 0.2
    fireSprite.play()

    return fireSprite
  }

  _turnOnObstacle() {
    if (this.vibrateDirection === 'left') {
      this.container.x++

      if (this.container.x > this.defaultX + 1) {
        this.vibrateDirection = 'right'
        this.fireSprite.scale.x = -1

        if (this.fireSprite2) {
          this.fireSprite2.scale.x = 1
        }
      }
    } else {
      this.container.x--

      if (this.container.x < this.defaultX - 1) {
        this.vibrateDirection = 'left'
        this.fireSprite.scale.x = 1

        if (this.fireSprite2) {
          this.fireSprite2.scale.x = -1
        }
      }
    }
  }
}
