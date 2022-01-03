import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'

export class CityBoard {
  constructor(cityName, currentCityNameMonitor) {
    this.cityName = cityName
    this.currentCityNameMonitor = currentCityNameMonitor
    this.container = new PIXI.Container()
    this.container.name = `cityBoard-${this.cityName}`

    this.createCityBoard()
    this.createBar()
    this.position()
    this.cityMonitor()
  }

  createCityBoard() {
    if (!Globals.resources[`board${this.cityName}`]?.texture) {
      this.boardSprite = new PIXI.Sprite()
      return
    }

    const boardTexture = new PIXI.Texture(
      Globals.resources[`board${this.cityName}`]?.texture
    )
    this.boardSprite = new PIXI.Sprite(boardTexture)

    this.container.addChild(this.boardSprite)

    this.boardSprite.pivot.set(
      this.boardSprite.width / 2,
      this.boardSprite.height
    )
  }

  createBar() {
    this.bar = new PIXI.Graphics()
    this.bar.beginFill(0xc4c4c4)
    this.bar.drawRect(0, 0, 5, 35)
    this.bar.endFill()

    this.container.addChild(this.bar)

    this.bar.pivot.set(this.bar.width / 2, this.bar.height)
  }

  position() {
    // this.container.pivot
    this.boardSprite.y = -this.bar.height
  }

  cityMonitor() {
    this.cityMonitorTicker = new PIXI.Ticker()

    this.cityMonitorTicker.add(() => {
      this._checkIfObstacleIsInWindow()

      if (this.isInWindow) {
        this.currentCityNameMonitor(this.cityName)
      }
    })

    this.cityMonitorTicker.start()
  }

  _checkIfObstacleIsInWindow() {
    const { tx } = this.container.worldTransform

    this.isInWindow = tx >= 0 && tx <= window.innerWidth
  }
}
