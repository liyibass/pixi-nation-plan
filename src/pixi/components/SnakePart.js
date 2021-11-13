import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
const MOVE_SPEED = 2
const BLOCK_WIDTH = 16

export class SnakePart {
  constructor(args = { i: 3, j: 4, id: 0 }) {
    this.container = new PIXI.Container()
    this.id = args.id

    this.currentPosition = { i: args.i, j: args.j }
    this.nextPosition = { i: args.i + 1, j: args.j }
    this.direction = 'right'
    this.prevDirection = 'right'

    // set initial position in pixel
    this.container.x = this.currentPosition.i * BLOCK_WIDTH
    this.container.y = this.currentPosition.j * BLOCK_WIDTH

    this.createSprite()
    this.setupPositionInPixel(this.currentPosition.i, this.currentPosition.j)
  }

  createSprite() {
    const color = new PIXI.Graphics()
    if (this.id === 0) {
      color.beginFill(0x888888)
    } else {
      color.beginFill(this.id % 2 === 0 ? 0xbbbbbb : 0xdddddd)
    }
    // color.drawRect(0, 0, BLOCK_WIDTH, BLOCK_WIDTH)
    color.drawRoundedRect(0, 0, BLOCK_WIDTH * 1.1, BLOCK_WIDTH * 1.1, 5)
    color.endFill()
    color.pivot.set(0.5, 0.5)

    this.container.addChild(color)
    // const texture = Globals.resources[`snakePart${this.id}`]?.texture

    // this.sprite = new PIXI.Sprite(texture)
    // this.sprite.anchor.set(0.5, 0.5)
    // this.sprite.pivot.set(0.5, 0.5)
    // this.sprite.angle = 90
  }

  setupPositionInPixel(i, j) {
    this.container.x = i * BLOCK_WIDTH
    this.container.y = j * BLOCK_WIDTH
  }

  getPositionInPixel({ i, j }) {
    return {
      x: BLOCK_WIDTH / 2 + i * BLOCK_WIDTH,
      y: BLOCK_WIDTH / 2 + j * BLOCK_WIDTH,
    }
  }

  move() {
    const { x: x0, y: y0 } = this.container
    const { x: x1, y: y1 } = this.getPositionInPixel(this.nextPosition)

    switch (this.direction) {
      case 'right':
        this.container.x += MOVE_SPEED
        // this.container.angle = 0

        if (x1 <= x0) {
          this.currentPosition = {
            i: this.nextPosition.i,
            j: this.nextPosition.j,
          }
          this.nextPosition = {
            i: this.currentPosition.i + 1,
            j: this.currentPosition.j,
          }
        }
        break

      case 'left':
        this.container.x -= MOVE_SPEED
        // this.container.angle = 0

        if (x1 >= x0) {
          this.currentPosition = {
            i: this.nextPosition.i,
            j: this.nextPosition.j,
          }
          this.nextPosition = {
            i: this.currentPosition.i - 1,
            j: this.currentPosition.j,
          }
        }
        break

      case 'down':
        this.container.y += MOVE_SPEED
        // this.container.angle = 90

        if (y1 <= y0) {
          this.currentPosition = {
            i: this.nextPosition.i,
            j: this.nextPosition.j,
          }
          this.nextPosition = {
            i: this.currentPosition.i,
            j: this.currentPosition.j + 1,
          }
        }
        break

      case 'up':
        this.container.y -= MOVE_SPEED
        // this.container.angle = 90

        if (y1 >= y0) {
          this.currentPosition = {
            i: this.nextPosition.i,
            j: this.nextPosition.j,
          }
          this.nextPosition = {
            i: this.currentPosition.i,
            j: this.currentPosition.j - 1,
          }
        }
        break
    }
  }
}
