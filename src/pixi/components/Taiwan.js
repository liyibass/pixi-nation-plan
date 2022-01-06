import * as PIXI from 'pixi.js'

import { TaiwanCity } from './TaiwanCity'
import { Globals } from '../script/Globals'
const taiwanDimention = Globals.getTaiwanDimention()

export class Taiwan {
  constructor() {
    this.container = new PIXI.Container()
    this.createTaiwan()
    this.x = taiwanDimention.x
    this.y = taiwanDimention.y
    this.setupPosition()
  }

  createTaiwan() {
    this.createFrame()
    this.createTaiwanCity()
  }

  createFrame() {
    const frame = new PIXI.Graphics()
    frame.beginFill(0x92b79c)
    frame.drawRect(0, 0, taiwanDimention.width, taiwanDimention.height)
    frame.endFill()
    this.container.addChild(frame)
  }

  createTaiwanCity() {
    this.taiwanContainer = new PIXI.Container()
    this.taiwanContainer.name = 'taiwanContainer'

    for (let i = 0; i < 21; i++) {
      const taiwanCity = new TaiwanCity(i)
      this.container.addChild(taiwanCity.container)
    }
  }

  setupPosition() {
    this.container.x = this.x
    this.container.y = this.y
  }
}
