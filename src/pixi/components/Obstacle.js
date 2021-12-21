import * as PIXI from 'pixi.js'

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

  startObstacleTicker() {
    this.defaultX = this.container.x
    this.defaultY = this.container.y

    this.ObstacleOperateTicker = new PIXI.Ticker()

    this.ObstacleOperateTicker.add(() => {
      this._checkIfObstacleIsInWindow()

      if (this.isInWindow) {
        this._turnOnObstacle()

        if (!this.isAddedToProcesser) {
          // console.log('in window')
          this.collisionMonitor(this)
          this.container.visible = true
          this.isAddedToProcesser = true
        }
      } else {
        if (this.isAddedToProcesser) {
          // console.log('out of window')
          this.collisionMonitor(this)
          this.container.visible = false
          this.isAddedToProcesser = false
          this.ObstacleOperateTicker.destroy()
          this.container.destroy()
          console.log('destroyed')
        }
      }
    })

    this.ObstacleOperateTicker.start()
  }

  _checkIfObstacleIsInWindow() {
    const { tx } = this.container.worldTransform

    this.isInWindow = tx >= 0 && tx <= window.innerWidth
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
