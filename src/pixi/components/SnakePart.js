import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
const MOVE_SPEED = 1.6
const BLOCK_WIDTH = 16

export class SnakePart {
  constructor(i, j, direction, id, color) {
    this.container = new PIXI.Container()
    this.id = id
    this.i = i
    this.j = j
    this.direction = direction
    this.prevDirection = direction
    this.color = color ? color : `0xaaaaaa`

    // this.nextPosition = _getDefaultPosition(index)

    // set initial position in pixel
    this.setupPositionInPixel(this.i, this.j)

    this.createSprite()
    // this.setupPositionInPixel(this.i, this.j)
  }

  createSprite() {
    const color = new PIXI.Graphics()
    if (this.id === 0) {
      color.beginFill(0xdddddd)
      color.drawRoundedRect(0, 0, BLOCK_WIDTH * 1.1, BLOCK_WIDTH * 1.1, 5)
    } else if (this.id === 1) {
      color.beginFill(0xdddddd)
      color.drawRoundedRect(0, 0, BLOCK_WIDTH * 1.1, BLOCK_WIDTH * 1.1, 1)
    } else if (this.id < 5) {
      color.beginFill(this.id % 2 === 0 ? 0x6e90ba : 0xcc8053)
      color.drawRoundedRect(0, 0, BLOCK_WIDTH * 1.1, BLOCK_WIDTH * 1.1, 1)
    } else {
      color.beginFill(this.color)
      color.drawRoundedRect(0, 0, BLOCK_WIDTH * 1.1, BLOCK_WIDTH * 1.1, 5)
    }
    // color.drawRect(0, 0, BLOCK_WIDTH, BLOCK_WIDTH)
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

  getPosition() {
    return {
      i: this.i,
      j: this.j,
    }
  }
  getNextPosition() {
    switch (this.direction) {
      case 'right':
        return {
          i: this.i + 1,
          j: this.j,
        }
      case 'left':
        return {
          i: this.i - 1,
          j: this.j,
        }
      case 'up':
        return {
          i: this.i,
          j: this.j - 1,
        }
      case 'down':
        return {
          i: this.i,
          j: this.j + 1,
        }

      default:
        break
    }
  }

  move() {
    const { x: originX, y: originY } = this.container
    const x = Math.round(originX)
    const y = Math.round(originY)
    const { i, j } = this

    switch (this.direction) {
      case 'right':
        this.container.x += MOVE_SPEED
        // this.container.angle = 0
        if (x > i * BLOCK_WIDTH) {
          this.i = Math.floor(x / BLOCK_WIDTH + 1)
          this.j = Math.floor(y / BLOCK_WIDTH)
        }
        break

      case 'left':
        this.container.x -= MOVE_SPEED
        // this.container.angle = 0

        if (x < i * BLOCK_WIDTH) {
          this.i = Math.floor(x / BLOCK_WIDTH)
          this.j = Math.floor(y / BLOCK_WIDTH)
        }
        break

      case 'down':
        this.container.y += MOVE_SPEED
        // this.container.angle = 90

        if (y > j * BLOCK_WIDTH) {
          this.i = Math.floor(x / BLOCK_WIDTH)
          this.j = Math.floor(y / BLOCK_WIDTH + 1)
        }
        break

      case 'up':
        this.container.y -= MOVE_SPEED
        // this.container.angle = 90

        if (y < j * BLOCK_WIDTH) {
          this.i = Math.floor(x / BLOCK_WIDTH)
          this.j = Math.floor(y / BLOCK_WIDTH)
        }
        break
    }
  }

  getNewPositionForNewBody() {
    switch (this.direction) {
      case 'right':
        return {
          i: this.currentPosition.i - 1,
          j: this.currentPosition.j,
        }
      case 'left':
        return {
          i: this.currentPosition.i + 1,
          j: this.currentPosition.j,
        }
      case 'up':
        return {
          i: this.currentPosition.i,
          j: this.currentPosition.j + 1,
        }
      case 'down':
        return {
          i: this.currentPosition.i,
          j: this.currentPosition.j - 1,
        }

      default:
        break
    }
  }
}

// function _getDefaultDirection(index) {
//   if (index <= I) return 'right'
//   else return 'up'
// }
// function _getDefaultPrevDirection(index) {
//   if (index < I) return 'right'
//   else return 'up'
// }

// function _getDefaultPosition(index) {
//   if (index < I) {
//     return {
//       i: I - index,
//       j: J,
//     }
//   } else {
//     return {
//       i: 0,
//       j: J + index - I,
//     }
//   }
// }
