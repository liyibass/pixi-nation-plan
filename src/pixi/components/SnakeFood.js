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
    this.container.x = this.currentPosition.i * BLOCK_WIDTH
    this.container.y = this.currentPosition.j * BLOCK_WIDTH

    this.getFoodType()
    this.createSprite()
    this.setupPositionInPixel(this.currentPosition.i, this.currentPosition.j)
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

    blockFrame.lineStyle(1, 0x000000, 0)
    blockFrame.drawRoundedRect(0, 0, BLOCK_WIDTH * 1, BLOCK_WIDTH * 1, 5)
    this.container.addChild(blockFrame)

    const texture = Globals.resources[this.type].texture
    const sprite = new PIXI.Sprite(texture)
    sprite.anchor.set(0.5, 0.5)

    this.container.addChild(sprite)

    sprite.x = blockFrame.width / 2
    sprite.y = blockFrame.height / 2
  }

  setupPositionInPixel(i, j) {
    this.container.x = i * BLOCK_WIDTH
    this.container.y = j * BLOCK_WIDTH
  }
}
