import * as PIXI from 'pixi.js'

import { TaiwanCity } from './TaiwanCity'
import { Globals } from '../script/Globals'
import { TaiwanGameIcon } from './TaiwanGameIcon'
import { Card } from './Card'
const taiwanDimention = Globals.getTaiwanDimention()

export class Taiwan {
  constructor() {
    this.container = new PIXI.Container()
    this.container.name = 'taiwan'

    this.x = taiwanDimention.x
    this.y = taiwanDimention.y
    this.createTaiwan()
    this.createCard()
  }

  createTaiwan() {
    this.taiwanContainer = new PIXI.Container()
    this.taiwanContainer.name = 'taiwanContainer'

    this.createFrame()
    this.createTaiwanCity()
    this.createGameIcon()
    this.setupPosition()
    this.container.addChild(this.taiwanContainer)
  }

  createCard() {
    this.card = new Card(0)
    this.container.addChild(this.card.container)
  }

  createFrame() {
    const frame = new PIXI.Graphics()
    frame.beginFill(0x92b79c)
    frame.drawRect(0, 0, taiwanDimention.width, taiwanDimention.height)
    frame.endFill()
    this.taiwanContainer.addChild(frame)
  }

  createTaiwanCity() {
    for (let i = 0; i < 21; i++) {
      const taiwanCity = new TaiwanCity(i, this.chooseCityHandler.bind(this))
      this.taiwanContainer.addChild(taiwanCity.container)
    }
  }

  chooseCityHandler(selectedCity) {
    this.card.showCityInfo(selectedCity)
  }

  createGameIcon() {
    for (let i = 0; i < 4; i++) {
      const gameIcon = new TaiwanGameIcon(i)
      this.taiwanContainer.addChild(gameIcon.container)
    }
  }

  setupPosition() {
    this.taiwanContainer.x = this.x
    this.taiwanContainer.y = this.y
  }
}
