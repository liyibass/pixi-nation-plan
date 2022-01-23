import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
import { Obstacle } from './Obstacle'
// const gameStageDimention = Globals.getRunGameStageDimention()

export class Car extends Obstacle {
  constructor(index = 0, collisionMonitor = () => {}, isCarInWater = false) {
    super()
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'car'
    this.canNotStanding = !isCarInWater

    this.createCar()
    this.isInWindow = false
    this.isInOperate = true
    this.vibrateDirection = this.index % 2 ? 'up' : 'down'

    this.isCarInWater = isCarInWater

    this._setWidthAndHeight()
  }

  createCar() {
    const chimneyTexture = new PIXI.Texture(
      Globals.resources[`car${Math.floor(this.index % 4)}`]?.texture
    )
    this.chimneySprite = new PIXI.Sprite(chimneyTexture)

    this.container.addChild(this.chimneySprite)

    this.chimneySprite.pivot.set(
      this.chimneySprite.width / 2,
      this.chimneySprite.height
    )

    if (this.isCarInWater) {
      this.container.y += this.container.y + (Math.random() * 5 - 2.5)
    }
  }

  _turnOnObstacle() {
    if (this.isCarInWater) {
      if (this.vibrateDirection === 'up') {
        this.container.y += 0.2
        if (this.container.y > this.defaultY + 5) {
          this.vibrateDirection = 'down'
        }
      } else {
        this.container.y -= 0.2
        if (this.container.y < this.defaultY - 5) {
          this.vibrateDirection = 'up'
        }
      }
    } else {
      if (this.vibrateDirection === 'up') {
        this.container.y++

        if (this.container.y > this.defaultY + 0.5) {
          this.vibrateDirection = 'down'
        }
      } else {
        this.container.y--

        if (this.container.y < this.defaultY - 0.5) {
          this.vibrateDirection = 'up'
        }
      }
    }
  }

  _setWidthAndHeight() {
    if (this.isCarInWater) {
      this.obstacleWidth = this.container.width
      this.obstacleHeight = this.container.height - 15
    } else {
      this.obstacleWidth = this.container.width
      this.obstacleHeight = this.container.height
    }
  }
}
