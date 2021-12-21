import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
import { Obstacle } from './Obstacle'
// const gameStageDimention = Globals.getRunGameStageDimention()

export class FinishLine extends Obstacle {
  constructor(index = 0, collisionMonitor = () => {}) {
    super()
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'finishLine'

    this.createFinishLine()
    this.isInWindow = false

    this._setWidthAndHeight()
  }

  createFinishLine() {
    const finishLineTexture = new PIXI.Texture(
      Globals.resources[`house`]?.texture
    )
    this.finishLineSprite = new PIXI.Sprite(finishLineTexture)

    this.container.addChild(this.finishLineSprite)

    this.finishLineSprite.pivot.set(
      this.finishLineSprite.width / 2,
      this.finishLineSprite.height
    )
  }
}
