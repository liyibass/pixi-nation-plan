import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class SnakePart {
  constructor(args = { i: 3, j: 4, id: 0 }) {
    this.id = args.id
    this.i = args.i
    this.j = args.j
    this.direction = 'right'
    this.nextDirection = 'right'

    this.createSprite()
    this.setupPosition(args.i, args.j)
  }

  createSprite() {
    const texture = Globals.resources[`snakePart${this.id}`]?.texture

    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
    this.sprite.pivot.set(0.5, 0.5)
    this.sprite.angle = 90
  }

  setupPosition(i, j) {
    this.sprite.x = 5 + i * 10
    this.sprite.y = 5 + j * 10
  }

  setupCoordinate(x, y) {
    this.i = Math.floor(x / 10)
    this.j = Math.floor(y / 10)
  }

  setNextDirection(nextDirection) {
    this.direction = nextDirection
  }

  move() {
    const SPEED = 2
    switch (this.direction) {
      case 'right':
        this.sprite.x += SPEED
        this.sprite.angle = 90
        break

      case 'left':
        this.sprite.x -= SPEED
        this.sprite.angle = -90
        break

      case 'up':
        this.sprite.y -= SPEED
        this.sprite.angle = 0
        break

      case 'down':
        this.sprite.y += SPEED
        this.sprite.angle = 180
        break

      default:
        break
    }

    this.i = Math.floor(this.sprite.x / 10)
    this.j = Math.floor(this.sprite.y / 10)
  }

  getCoordinate() {
    return {
      i: Math.floor(this.sprite.x / 10),
      j: Math.floor(this.sprite.y / 10),
    }
  }
}
