import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
import { Obstacle } from './Obstacle'
// const gameStageDimention = Globals.getRunGameStageDimention()

export class SolarBoard extends Obstacle {
  constructor(index = 0, collisionMonitor = () => {}) {
    super()
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'solarBoard'

    this.createSolarBoard()
    this.isInWindow = false
    this.isInOperate = true
    this.vibrateDirection = this.index % 2 ? 'right' : 'left'

    this._setWidthAndHeight()
  }

  createSolarBoard() {
    const solarBoardTexture = new PIXI.Texture(
      Globals.resources[`solarBoard`]?.texture
    )
    this.solarBoardSprite = new PIXI.Sprite(solarBoardTexture)

    this.container.addChild(this.solarBoardSprite)

    this.solarBoardSprite.pivot.set(
      this.solarBoardSprite.width / 2,
      this.solarBoardSprite.height
    )
  }
}
