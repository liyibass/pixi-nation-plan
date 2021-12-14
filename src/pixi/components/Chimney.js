import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
const gameStageDimention = Globals.getRunGameStageDimention()

export class Chimney {
  constructor(chimneyIndex = 0, collisionMonitor = () => {}) {
    this.chimneyIndex = chimneyIndex
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'chimney'

    this.container = new PIXI.Container()
    this.container.name = `chimneyIndex`

    this.createChimney()
    this.isInWindow = false
    this.isInOperate = true
    this.vibrateDirection = this.chimneyIndex % 2 ? 'right' : 'left'
  }

  createChimney() {
    const chimneyTexture = new PIXI.Texture(
      Globals.resources[`chimney${Math.floor(this.chimneyIndex % 4)}`]?.texture
    )
    this.chimneySprite = new PIXI.Sprite(chimneyTexture)

    this.container.addChild(this.chimneySprite)

    this.chimneySprite.pivot.set(
      this.chimneySprite.width / 2,
      this.chimneySprite.height
    )
  }

  startChimneyTicker() {
    this.defaultX = this.container.x

    this.chimneyOperateTicker = new PIXI.Ticker()

    this.chimneyOperateTicker.add(() => {
      this.checkIfObstacleIsInWindow()

      if (this.isInWindow) {
        this.turnOnChimney()
        this.collisionMonitor(this)
      }
    })

    this.chimneyOperateTicker.start()
  }

  tempCollisionMonitor(obstacle) {
    console.log(`moniter obstacle ${obstacle.chimneyIndex}`)
  }

  checkIfObstacleIsInWindow() {
    const { tx } = this.container.worldTransform

    this.isInWindow =
      tx >= gameStageDimention.x &&
      tx <= gameStageDimention.x + gameStageDimention.width
  }

  turnOnChimney() {
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

  destoryChimney() {
    this.chimneyOperateTicker.stop()
  }
}
