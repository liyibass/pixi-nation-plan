import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
const MOVE_SPEED = 1
const BLOCK_WIDTH = 16

export class SnakePart {
  constructor(args = { i: 3, j: 4, id: 0 }) {
    this.container = new PIXI.Container()
    this.id = args.id

    this.currentPosition = { i: args.i, j: args.j }
    this.nextPosition = { i: args.i + 1, j: args.j }
    this.direction = 'right'

    // set initial position in pixel
    this.container.x = this.currentPosition.i * BLOCK_WIDTH
    this.container.y = this.currentPosition.j * BLOCK_WIDTH

    this.createSprite()
    this.setupPositionInPixel(this.currentPosition.i, this.currentPosition.j)
  }

  createSprite() {
    const color = new PIXI.Graphics()
    color.beginFill(0xdddddd)
    color.drawRect(0, 0, BLOCK_WIDTH, BLOCK_WIDTH)
    color.endFill()

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
        if (x1 > x0) {
          this.container.x++
        } else {
          this.currentPosition = {
            i: this.nextPosition.i,
            j: this.nextPosition.j,
          }
          this.nextPosition = {
            i: this.currentPosition.i + MOVE_SPEED,
            j: this.currentPosition.j,
          }
        }
        break

      case 'left':
        if (x1 < x0) {
          this.container.x--
        } else {
          this.currentPosition = {
            i: this.nextPosition.i,
            j: this.nextPosition.j,
          }
          this.nextPosition = {
            i: this.currentPosition.i - MOVE_SPEED,
            j: this.currentPosition.j,
          }
        }
        break

      case 'down':
        if (y1 > y0) {
          this.container.y++
        } else {
          this.currentPosition = {
            i: this.nextPosition.i,
            j: this.nextPosition.j,
          }
          this.nextPosition = {
            i: this.currentPosition.i + MOVE_SPEED,
            j: this.currentPosition.j,
          }
        }
        break

      case 'up':
        if (y1 < y0) {
          this.container.y--
        } else {
          this.currentPosition = {
            i: this.nextPosition.i,
            j: this.nextPosition.j,
          }
          this.nextPosition = {
            i: this.currentPosition.i - MOVE_SPEED,
            j: this.currentPosition.j,
          }
        }
        break
    }
  }
}
