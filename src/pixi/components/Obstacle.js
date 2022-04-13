import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
const gameStageDimention = Globals.getRunGameStageDimention()

export class Obstacle {
  constructor(index = 0, collisionMonitor = () => {}) {
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'Obstacle'

    this.container = new PIXI.Container()
    this.isInWindow = false
    this.canNotStanding = true

    this.obstacleGlobalX = 0
    this.obstacleGlobalY = 0
    this.obstacleWidth = 0
    this.obstacleHeight = 0
  }

  getObstacleTickerCallback(obstacleCallbackArray) {
    this.defaultX = this.container.x
    this.defaultY = this.container.y
    // this.ObstacleOperateTicker = new PIXI.Ticker()

    const tickerCallback = () => {
      this.isInWindow = this._checkIfObstacleIsInWindow.bind(this)()

      if (this.isInWindow) {
        this._turnOnObstacle()
        if (!this.isAddedToProcesser) {
          // console.log('in window')
          this.collisionMonitor(this)
          this.container.visible = true
          this.isAddedToProcesser = true
        }
      } else {
        if (this.isAddedToProcesser && this.container.x < 0) {
          // console.log('out of window')
          this.collisionMonitor(this)
          this.destoryObstacle()
        }
      }
    }

    // this.ObstacleOperateTicker.add(tickerCallback)
    // this.ObstacleOperateTicker.start()

    obstacleCallbackArray.push(tickerCallback.bind(this))
  }

  destoryObstacle() {
    this.container.visible = false
    this.isAddedToProcesser = false
    // this.ObstacleOperateTicker.stop()
    // this.ObstacleOperateTicker.destroy()
    this.container.destroy()
    console.log('destroyed')

    this.isDestroyed = true
  }

  _checkIfObstacleIsInWindow() {
    // try {
    //   const tx = this?.container?.worldTransform?.tx + this?.container?.width

    //   return (
    //     tx >= gameStageDimention.x &&
    //     tx <= gameStageDimention.x + gameStageDimention.width
    //   )
    // } catch (error) {
    //   return false
    // }

    try {
      const tx = this?.container?.worldTransform?.tx + this?.container?.width

      return (
        tx >= gameStageDimention.x &&
        tx <=
          gameStageDimention.x +
            gameStageDimention.width +
            window.innerWidth / 3
      )
    } catch (error) {
      return false
    }
  }

  _turnOnObstacle() {
    // overwrite by extended
  }

  _setWidthAndHeight() {
    this.obstacleWidth = this.container.width
    this.obstacleHeight = this.container.height

    // console.log(this)
  }

  _setGlobalXAndY() {
    const global = this.container.worldTransform

    this.obstacleGlobalX = global.tx
    this.obstacleGlobalY = global.ty
  }
}
