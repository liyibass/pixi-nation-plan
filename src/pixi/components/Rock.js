import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
import { Obstacle } from './Obstacle'
const gameStageDimention = Globals.getRunGameStageDimention()

export class Rock extends Obstacle {
  constructor(index = 0, collisionMonitor = () => {}, obstacleWidth) {
    super()
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'roc'
    this.obstacleWidth = obstacleWidth

    this.createRock()
    this.isInWindow = false
    this.isInOperate = true
    this.rotateDirection = Math.random() >= 0.5 ? 1 : -1

    this._setWidthAndHeight()
  }

  createRock() {
    const rockTexture = new PIXI.Texture(Globals.resources['rock']?.texture)
    this.rockSprite = new PIXI.Sprite(rockTexture)

    this.container.addChild(this.rockSprite)

    this.rockSprite.pivot.set(
      this.rockSprite.width / 2,
      this.rockSprite.height / 2
    )
  }

  _turnOnObstacle() {
    this.container.angle += 1 * this.rotateDirection

    if (this.container.y < gameStageDimention.height) {
      this.container.y += 1
    } else {
      this.container.y = 0
      // this.container.x = Math.floor(Math.random() * this.obstacleWidth)
    }
  }
}
