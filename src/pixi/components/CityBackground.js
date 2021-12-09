import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
const gameStageDimention = Globals.getSeesawGameStageDimention()

export class CityBackground {
  constructor(cityName) {
    this.cityName = cityName
    this.container = new PIXI.Container()
    this.container.name = `cityBackground-${this.cityName}`

    this.createCityBackground()
  }

  createCityBackground() {
    for (let i = 0; i < 9; i++) {
      const factoryTexture = new PIXI.Texture(
        Globals.resources[`factory${Math.floor(i % 3) + 1}`].texture
      )
      const factorySprite = new PIXI.Sprite(factoryTexture)
      factorySprite.pivot.set(factorySprite.width / 2, factorySprite.height)

      factorySprite.x =
        factorySprite.width / 2 + this.container.width + Math.random() * 40
      factorySprite.y = gameStageDimention.height

      this.container.addChild(factorySprite)
    }
  }
}
