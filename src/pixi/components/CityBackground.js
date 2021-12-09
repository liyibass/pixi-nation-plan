import * as PIXI from 'pixi.js'
import { CityBoard } from './CityBoard'
import { Globals } from '../script/Globals'
const gameStageDimention = Globals.getSeesawGameStageDimention()

export class CityBackground {
  constructor(currentCityIndex = 0) {
    this.cityName = this._getCityName(currentCityIndex)
    this.container = new PIXI.Container()
    this.container.name = `cityBackground${this.cityName}`
    this.currentCityIndex = currentCityIndex

    this.createCityBackground()
  }

  createCityBackground() {
    this._createBoard()
    this._createBuildings()
  }

  _createBoard() {
    const cityBoard = new CityBoard(this.cityName)
    this.container.addChild(cityBoard.container)

    cityBoard.container.x = 0 + cityBoard.container.width / 2
    cityBoard.container.y = gameStageDimention.height
  }

  _createBuildings() {
    for (let i = 0; i < 9; i++) {
      const factoryTexture = new PIXI.Texture(
        Globals.resources[`factory${Math.floor(i % 3) + 1}`].texture
      )
      const factorySprite = new PIXI.Sprite(factoryTexture)
      factorySprite.pivot.set(factorySprite.width / 2, factorySprite.height)
      this.container.addChild(factorySprite)

      factorySprite.x = this.container.width + Math.floor(Math.random() * 30)
      factorySprite.y = gameStageDimention.height
    }
  }

  _getCityName(currentCityIndex) {
    switch (currentCityIndex) {
      case 0:
        return 'Taoyuan'
      case 1:
        return 'Hsinchu'
      case 2:
        return 'Miaoli'
      case 3:
        return 'Yunlin'
      case 4:
        return 'Kaohsiung'
      case 5:
        return 'Yilan'
    }
  }
}
