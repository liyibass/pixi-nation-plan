import * as PIXI from 'pixi.js'

import { TaiwanCity } from './TaiwanCity'
import { Globals } from '../script/Globals'
import { TaiwanGameIcon } from './TaiwanGameIcon'
const taiwanDimention = Globals.getTaiwanDimention()

export class Taiwan {
  constructor() {
    this.container = new PIXI.Container()
    this.container.name = 'container'
    this.createTaiwan()
    this.x = taiwanDimention.x
    this.y = taiwanDimention.y
    this.setupPosition()
  }

  createTaiwan() {
    this.createFrame()
    this.createTaiwanCity()
    this.createGameIcon()
  }

  createFrame() {
    const frame = new PIXI.Graphics()
    frame.beginFill(0x92b79c)
    frame.drawRect(0, 0, taiwanDimention.width, taiwanDimention.height)
    frame.endFill()
    this.container.addChild(frame)
  }

  createTaiwanCity() {
    for (let i = 0; i < 21; i++) {
      const taiwanCity = new TaiwanCity(i)
      this.container.addChild(taiwanCity.container)
    }
  }

  createGameIcon() {
    for (let i = 0; i < 4; i++) {
      const gameIcon = new TaiwanGameIcon(i)
      this.container.addChild(gameIcon.container)
    }
  }

  setupPosition() {
    this.container.x = this.x
    this.container.y = this.y
  }
}
