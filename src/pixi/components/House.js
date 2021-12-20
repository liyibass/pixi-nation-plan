import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
import { Obstacle } from './Obstacle'
// const gameStageDimention = Globals.getRunGameStageDimention()

export class House extends Obstacle {
  constructor(index = 0, collisionMonitor = () => {}) {
    super()
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'house'
    this.canNotStanding = false

    this.createHouse()
    this.isInWindow = false
    this.isInOperate = true
    this.vibrateDirection = this.index % 2 ? 'up' : 'down'

    this._setWidthAndHeight()
  }

  createHouse() {
    const houseTexture = new PIXI.Texture(Globals.resources[`house`]?.texture)
    this.houseSprite = new PIXI.Sprite(houseTexture)

    this.container.addChild(this.houseSprite)

    this.houseSprite.pivot.set(
      this.houseSprite.width / 2,
      this.houseSprite.height
    )
  }

  _turnOnObstacle() {
    // if (this.vibrateDirection === 'up') {
    //   this.container.y++
    //   if (this.container.y > this.defaultY + 0.5) {
    //     this.vibrateDirection = 'down'
    //   }
    // } else {
    //   this.container.y--
    //   if (this.container.y < this.defaultY - 0.5) {
    //     this.vibrateDirection = 'up'
    //   }
    // }
  }
}
