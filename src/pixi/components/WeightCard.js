import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const CARD_PADDING = 10
const MIN_SPRITE_WIDTH = 30

export class WeightCard {
  constructor(weight = 100, name = 'weightAdult') {
    this.container = new PIXI.Container()
    this.weight = weight
    this.name = name

    this.weightWidth = this.getWeightWidth()
    this.weightHeight = 70

    this.createWeightCard()
    this.container.interactive = true
    this.container.buttonMode = true
  }

  getWeightWidth() {
    switch (this.name) {
      case 'weightBus':
        return 90 + CARD_PADDING * 2

      case 'weightShop':
        return 60 + CARD_PADDING * 2

      default:
        return MIN_SPRITE_WIDTH + CARD_PADDING * 2
    }
  }

  createWeightCard() {
    this.createFrame()

    const weightSprite = this.createWeightIcon()
    const weightText = this.createWeightText()

    weightText.y = this.weightHeight - weightText.height
    weightSprite.y =
      this.weightHeight - weightText.height - 5 - weightSprite.height

    this.container.addChild(weightSprite, weightText)
  }

  createFrame() {
    const frame = new PIXI.Graphics()
    frame.drawRect(0, 0, this.weightWidth, this.weightHeight)
    this.container.addChild(frame)
  }

  createWeightIcon() {
    const weightTexture = Globals.resources[this.name]?.texture
    const weightSprite = new PIXI.Sprite(weightTexture)

    weightSprite.anchor.set(0.5, 0)
    weightSprite.x = this.weightWidth / 2
    return weightSprite
  }

  createWeightText() {
    this.weightText = new PIXI.Text(`${this.weight}`, {
      fill: [0xffffff],
      fontSize: 14,
    })
    this.weightText.anchor.set(0.5, 0)
    this.weightText.x = this.weightWidth / 2

    return this.weightText
  }
}
