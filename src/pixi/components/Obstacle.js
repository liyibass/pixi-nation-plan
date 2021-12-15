import * as PIXI from 'pixi.js'

export class Obstacle {
  constructor(index = 0, collisionMonitor = () => {}) {
    this.index = index
    this.collisionMonitor = collisionMonitor
    this.obstacleName = 'Obstacle'

    this.container = new PIXI.Container()
    this.isInWindow = false
  }

  startObstacleTicker() {
    this.defaultX = this.container.x

    this.ObstacleOperateTicker = new PIXI.Ticker()

    this.ObstacleOperateTicker.add(() => {
      this._checkIfObstacleIsInWindow()

      if (this.isInWindow) {
        this._turnOnObstacle()

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

    this.ObstacleOperateTicker.start()
  }

  _checkIfObstacleIsInWindow() {
    const { tx } = this.container.worldTransform

    this.isInWindow = tx >= 0 && tx <= window.innerWidth
  }

  _turnOnObstacle() {
    // overwrite by extended
  }
}
