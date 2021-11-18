import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'
const BLOCK_WIDTH = 16

export class SnakePoison {
  constructor(id, i, j) {
    this.container = new PIXI.Container()
    this.id = id
    this.i = i
    this.j = j

    this.type = 'fauset'
    this.color = `0x000000`

    this.currentPosition = { i, j }

    this.getFoodType()
    this.createSprite()

    this.setupPositionInPixel()
  }

  getFoodType() {
    const random = Math.floor(Math.random() * 2)

    switch (random) {
      case 0:
        this.type = 'fauset'
        this.color = 0x000000
        this.width = 2
        this.height = 1
        break

      case 1:
        this.type = 'incinerator'
        this.color = 0x000000
        this.width = 3
        this.height = 3
        break
    }
  }

  createSprite() {
    const blockFrame = new PIXI.Graphics()

    if (this.type === 'incinerator') {
      blockFrame.lineStyle(1, 0x000000, 1)
      blockFrame.drawRoundedRect(0, 0, BLOCK_WIDTH * 3, BLOCK_WIDTH * 3, 5)
    } else {
      blockFrame.lineStyle(1, 0x000000, 1)
      blockFrame.drawRoundedRect(0, 0, BLOCK_WIDTH * 2, BLOCK_WIDTH * 1, 5)
    }
    this.container.addChild(blockFrame)

    const texture = Globals.resources[this.type].texture
    const iconSprite = new PIXI.Sprite(texture)
    iconSprite.anchor.set(0.5, 0.5)

    this.container.addChild(iconSprite)

    iconSprite.x = blockFrame.width / 2
    iconSprite.y = blockFrame.height / 2
  }

  setupPositionInPixel() {
    this.container.x = this.i * BLOCK_WIDTH
    this.container.y = this.j * BLOCK_WIDTH
  }
}
