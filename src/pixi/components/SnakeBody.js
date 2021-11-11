import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class SnakeBody {
  constructor(position = { x: 0, y: 0 }) {
    this.createSprite()
    this.setupPosition(position.x, position.y)

    this.direction = 'left'
    this.nextDirection = 'left'
  }

  createSprite() {
    const texture = Globals.resources['snakeBody1']?.texture

    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
    this.sprite.pivot.set(0.5, 0.5)
  }

  setupPosition(x, y) {
    this.sprite.x = x
    this.sprite.y = y
  }

  setNextDirection(nextDirection) {
    this.direction = this.nextDirection
    this.nextDirection = nextDirection
  }

  move() {
    switch (this.direction) {
      case 'right':
        this.sprite.x += 2
        this.sprite.angle = 90
        break
      case 'left':
        this.sprite.x -= 2
        this.sprite.angle = -90
        break

      case 'up':
        this.sprite.y -= 2
        this.sprite.angle = 0
        break
      case 'down':
        this.sprite.y += 2
        this.sprite.angle = 180
        break

      default:
        break
    }
  }
}
