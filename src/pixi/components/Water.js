import * as PIXI from 'pixi.js'

// import { Globals } from '../script/Globals'
import { Obstacle } from './Obstacle'
// const gameStageDimention = Globals.getRunGameStageDimention()

export class Water extends Obstacle {
  constructor(index = 0, collisionMonitor = () => {}) {
    super()
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'car'

    this.createWater()
    this.isInWindow = false
    this.isInOperate = true
    this.vibrateDirection = this.index % 2 ? 'up' : 'down'

    this._setWidthAndHeight()
  }

  createWater() {
    this.waterGraphic = new PIXI.Graphics()
    this.waterGraphic.beginFill(0x3b6bd6)
    this.waterGraphic.drawRect(0, 0, 158, 31)
    this.waterGraphic.endFill()

    this.container.addChild(this.waterGraphic)

    this.waterGraphic.pivot.set(
      this.waterGraphic.width / 2,
      this.waterGraphic.height
    )

    // const chimneyTexture = new PIXI.Texture(
    //   Globals.resources[`car${Math.floor(this.index % 4)}`]?.texture
    // )
    // this.chimneySprite = new PIXI.Sprite(chimneyTexture)

    // this.container.addChild(this.chimneySprite)

    // this.chimneySprite.pivot.set(
    //   this.chimneySprite.width / 2,
    //   this.chimneySprite.height
    // )
  }

  _setWidthAndHeight() {
    this.obstacleWidth = this.container.width
    this.obstacleHeight = this.container.height - this.waterGraphic.height
  }

  // _turnOnObstacle() {
  //   if (this.vibrateDirection === 'up') {
  //     this.container.y++

  //     if (this.container.y > this.defaultY + 0.5) {
  //       this.vibrateDirection = 'down'
  //     }
  //   } else {
  //     this.container.y--

  //     if (this.container.y < this.defaultY - 0.5) {
  //       this.vibrateDirection = 'up'
  //     }
  //   }
  // }
}
