import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'
const BLOCK_WIDTH = 16

export class SnakeFood {
  constructor(id, i, j, foodType = 'all') {
    this.container = new PIXI.Container()
    this.id = id
    this.i = i
    this.j = j

    this.type = foodType
    this.color = `0x000000`

    this.currentPosition = { i, j }

    this.getFoodType()
    this.createSprite()
    this.setupPositionInPixel()
  }

  getFoodType() {
    switch (this.type) {
      case 'water':
        this.color = 0x9f523e
        break
      case 'gargage':
        this.color = 0x464f7c
        break

      case 'all':
        switch (Math.floor(Math.random() * 2)) {
          case 0:
            this.type = 'garbage'
            this.color = 0x9f523e
            break

          case 1:
            this.type = 'water'
            this.color = 0x464f7c
            break
        }

        break
      default:
        break
    }
  }

  createSprite() {
    const blockFrame = new PIXI.Graphics()

    // blockFrame.lineStyle(1, 0x000000, 1)
    blockFrame.drawRoundedRect(0, 0, BLOCK_WIDTH * 1, BLOCK_WIDTH * 1, 5)

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
