import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class SeesawPivot {
  constructor(level = 1) {
    this.container = new PIXI.Container()
    this.level = level
    this.createPivot()
    this.setPosition()
  }

  createPivot() {
    this.levelText = new PIXI.Text(`Level ${this.level + 1}`, {
      fontSize: 14,
      fill: ['0xffffff'],
    })
    const baseTexture = Globals.resources['pivotBase']?.texture
    const pinTexture = Globals.resources['pivotPin']?.texture
    const baseSprite = new PIXI.Sprite(baseTexture)
    const pinSprite = new PIXI.Sprite(pinTexture)

    // define pin position
    pinSprite.x = (baseSprite.width - pinSprite.width) / 2
    pinSprite.y = 0
    baseSprite.y = pinSprite.height

    // add text into base
    baseSprite.addChild(this.levelText)
    this.container.addChild(baseSprite, pinSprite)
    this.levelText.x = (baseSprite.width - this.levelText.width) / 2
    this.levelText.y = (baseSprite.height - this.levelText.height) / 2
  }

  setPosition() {
    this.container.pivot.x = this.container.width / 2
  }
}
