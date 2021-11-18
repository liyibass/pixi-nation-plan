import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'
const BLOCK_WIDTH = 16

export class SnakeFood {
  constructor(index, i, j) {
    this.container = new PIXI.Container()
    this.id = index
    this.i = i
    this.j = j

    this.type = 'water'
    this.color = `0x000000`

    this.currentPosition = { i, j }

    // set initial position in pixel
    // this.container.x = this.currentPosition.i * BLOCK_WIDTH
    // this.container.y = this.currentPosition.j * BLOCK_WIDTH

    this.getFoodType()
    this.createSprite()

    this.setupPositionInPixel()
  }

  getFoodType() {
    const random = Math.floor(Math.random() * 12)

    switch (random) {
      case 0:
        this.type = 'fauset'
        this.color = 0x000000
        break

      case 1:
        this.type = 'incinerator'
        this.color = 0x000000
        break

      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      default:
        this.type = 'garbage'
        this.color = 0x9f523e
        break

      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
        this.type = 'water'
        this.color = 0x464f7c
        break
    }
  }

  createSprite() {
    const blockFrame = new PIXI.Graphics()

    if (this.type === 'incinerator') {
      blockFrame.lineStyle(1, 0x000000, 1)
      blockFrame.drawRoundedRect(0, 0, BLOCK_WIDTH * 3, BLOCK_WIDTH * 3, 5)
    } else if (this.type === 'fauset') {
      blockFrame.lineStyle(1, 0x000000, 1)
      blockFrame.drawRoundedRect(0, 0, BLOCK_WIDTH * 2, BLOCK_WIDTH * 1, 5)
    } else {
      blockFrame.lineStyle(1, 0x000000, 1)
      blockFrame.drawRoundedRect(0, 0, BLOCK_WIDTH * 1, BLOCK_WIDTH * 1, 5)
    }

    this.container.addChild(blockFrame)

    const texture = Globals.resources[this.type].texture
    const iconSprite = new PIXI.Sprite(texture)
    iconSprite.anchor.set(0.5, 0.5)

    this.container.addChild(iconSprite)

    iconSprite.x = blockFrame.width / 2
    iconSprite.y = blockFrame.height / 2
  }

  adjustNotFoodPosition() {
    if (this.type === 'incinerator' || this.type === 'fauset') {
      if (this.i < 5) {
        this.i = 5
      } else if (this.i > Globals.snakeTotalI - 5) {
        this.i = Globals.snakeTotalI - 5
      }

      if (this.j < 5) {
        this.j = 5
      } else if (this.j > Globals.snakeTotalJ - 5) {
        this.j = Globals.snakeTotalJ - 5
      }
    }
  }

  setupPositionInPixel() {
    this.adjustNotFoodPosition()

    this.container.x = this.i * BLOCK_WIDTH
    this.container.y = this.j * BLOCK_WIDTH
  }
}
