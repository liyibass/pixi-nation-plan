import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
// const gameStageDimention = Globals.getRunGameStageDimention()

export class Chimney {
  constructor(index = 0, collisionMonitor = () => {}) {
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'chimney'

    this.container = new PIXI.Container()
    this.container.name = `index`

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

  startChimneyTicker() {
    this.defaultX = this.container.x

    this.chimneyOperateTicker = new PIXI.Ticker()

    this.chimneyOperateTicker.add(() => {
      this.checkIfObstacleIsInWindow()

      if (this.isInWindow) {
        this.turnOnChimney()

        if (!this.isAddedToProcesser) {
          // console.log('in window')
          this.collisionMonitor(this)
          this.isAddedToProcesser = true
        }
      } else {
        if (this.isAddedToProcesser) {
          // console.log('out of window')
          this.collisionMonitor(this)
          this.isAddedToProcesser = false
        }
      }
    })

    this.chimneyOperateTicker.start()
  }

  checkIfObstacleIsInWindow() {
    const { tx } = this.container.worldTransform

    this.isInWindow =
      // tx >= gameStageDimention.x &&
      // tx <= gameStageDimention.x + gameStageDimention.width
      tx >= 0 && tx <= window.innerWidth
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
