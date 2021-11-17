import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
const BLOCK_WIDTH = 16

export class SnakeFood {
  constructor(index, i, j) {
    this.container = new PIXI.Container()
    this.id = index
    this.i = i
    this.j = j
    this.color = `0x${Math.floor(Math.random() * 999999)}`

    this.currentPosition = { i, j }

    // set initial position in pixel
    this.container.x = this.currentPosition.i * BLOCK_WIDTH
    this.container.y = this.currentPosition.j * BLOCK_WIDTH

    this.createSprite()
    this.setupPositionInPixel(this.currentPosition.i, this.currentPosition.j)
  }

  createSprite() {
    const color = new PIXI.Graphics()
    color.beginFill(this.color)
    color.drawRoundedRect(0, 0, BLOCK_WIDTH * 1, BLOCK_WIDTH * 1, 5)

    this.container.addChild(color)
  }

  setupPositionInPixel(i, j) {
    this.container.x = i * BLOCK_WIDTH
    this.container.y = j * BLOCK_WIDTH
  }
}
