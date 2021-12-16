import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
import { Obstacle } from './Obstacle'
// const gameStageDimention = Globals.getRunGameStageDimention()

export class Car extends Obstacle {
  constructor(index = 0, collisionMonitor = () => {}) {
    super()
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'car'

    this.createChimney()
    this.isInWindow = false
    this.isInOperate = true
    this.vibrateDirection = this.index % 2 ? 'up' : 'down'

    this._setWidthAndHeight()
  }

  createChimney() {
    const chimneyTexture = new PIXI.Texture(
      Globals.resources[`car${Math.floor(this.index % 4)}`]?.texture
    )
    this.chimneySprite = new PIXI.Sprite(chimneyTexture)

    this.container.addChild(this.chimneySprite)

    this.chimneySprite.pivot.set(
      this.chimneySprite.width / 2,
      this.chimneySprite.height
    )
  }

  _turnOnObstacle() {
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
