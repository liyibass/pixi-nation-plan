import * as PIXI from 'pixi.js'

// import { Globals } from '../script/Globals'
import { Obstacle } from './Obstacle'
// const gameStageDimention = Globals.getRunGameStageDimention()

export class Water extends Obstacle {
  constructor(index = 0, collisionMonitor = () => {}, player) {
    super()
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'water'
    this.player = player

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

  getObstacleTickerCallback(obstacleCallbackArray) {
    this.defaultX = this.container.x
    this.defaultY = this.container.y
    // this.ObstacleOperateTicker = new PIXI.Ticker()

    const tickerCallback = () => {
      this.isInWindow = this._checkIfObstacleIsInWindow()

      if (this.isInWindow) {
        // get water and player's global position
        const { tx: playerX, ty: playerY } =
          this.player.container.worldTransform
        this._setGlobalXAndY()
        const rightBoundaryHit =
          playerX >= this.obstacleGlobalX - this.obstacleWidth / 2
        const leftBoundaryHit =
          playerX <= this.obstacleGlobalX + this.obstacleWidth / 2
        const isInObstacleArea = rightBoundaryHit && leftBoundaryHit
        const standOnWater =
          playerY === this.obstacleGlobalY - this.obstacleHeight
        if (isInObstacleArea && standOnWater) {
          console.log('DEAD')
          // this.ObstacleOperateTicker.stop()
          this.collisionMonitor(this)
        }
        // this.isAddedToProcesser = true
      }
    }
    // this.ObstacleOperateTicker.add(tickerCallback)
    // this.ObstacleOperateTicker.start()

    obstacleCallbackArray.push(tickerCallback.bind(this))
  }
}
