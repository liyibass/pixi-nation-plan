import * as PIXI from 'pixi.js'
import { CityBackground } from './CityBackground'
// import { Globals } from '../script/Globals'

export class RunBgLayer {
  constructor() {
    this.container = new PIXI.Container()
    this.container.name = 'runBgLayer'

    this.createCityBackground()
  }

  createCityBackground() {
    const cityBackground = new CityBackground(0)

    this.container.addChild(cityBackground.container)
  }
}
