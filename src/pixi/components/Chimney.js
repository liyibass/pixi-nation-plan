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
  }

  _turnOnObstacle() {
    if (this.vibrateDirection === 'left') {
      this.container.x++

      if (this.container.x > this.defaultX + 1) {
        this.vibrateDirection = 'right'
      }
    } else {
      this.container.x--

      if (this.container.x < this.defaultX - 1) {
        this.vibrateDirection = 'left'
      }
    }
  }
}
