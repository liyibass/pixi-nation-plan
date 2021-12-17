import * as PIXI from 'pixi.js'

// import { Globals } from '../script/Globals'
import { Obstacle } from './Obstacle'
// const gameStageDimention = Globals.getRunGameStageDimention()

export class Water extends Obstacle {
  constructor(index = 0, collisionMonitor = () => {}) {
    super()
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'water'

    this.waterWidthLevel = (this.index % 3) + 1
    this.createWater()
    this.isInWindow = false
    this.isInOperate = true
    this.vibrateDirection = this.index % 2 ? 'up' : 'down'

    this._setWidthAndHeight()
  }

  createWater() {
    const waterWidth = this.waterWidthLevel * 170

    this.waterGraphic = new PIXI.Graphics()
    this.waterGraphic.beginFill(0x3b6bd6)
    this.waterGraphic.drawRect(0, 0, waterWidth, 31)
    this.waterGraphic.endFill()

    this.container.addChild(this.waterGraphic)

    this.waterGraphic.pivot.set(
      this.waterGraphic.width / 2,
      this.waterGraphic.height
    )
  }

  _setGlobalXAndY() {
    const global = this.container.worldTransform

    this.obstacleGlobalX = global.tx
    this.obstacleGlobalY = global.ty
  }
}
