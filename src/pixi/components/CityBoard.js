import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'

export class CityBoard {
  constructor(cityName) {
    this.cityName = cityName
    this.container = new PIXI.Container()
    this.container.name = `cityBoard-${this.cityName}`

    this.createCityBoard()
    this.createBar()
    this.position()
  }

  createCityBoard() {
    const boardTexture = new PIXI.Texture(
      Globals.resources[`board${this.cityName}`].texture
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
}
