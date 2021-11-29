import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'
const BLOCK_WIDTH = 16

export class SnakePoison {
  constructor(id, i, j, poisonType = 'all') {
    this.container = new PIXI.Container()
    this.id = id
    this.i = i
    this.j = j

    this.type = poisonType
    this.color = `0x000000`

    this.currentPosition = { i, j }

    this.getPoisonType()
    this.createSprite()

    this.setupPositionInPixel()
  }

  getPoisonType() {
    let typeNumber
    switch (this.type) {
      case 'fauset':
        typeNumber = 0
        break

      case 'incinerator':
        typeNumber = 1
        break

      default:
      case 'any':
        typeNumber = Math.floor(Math.random() * 2)
        break
    }

    switch (typeNumber) {
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

    // blockFrame.lineStyle(1, 0x000000, 1)

    if (this.type === 'incinerator') {
      blockFrame.drawRoundedRect(0, 0, BLOCK_WIDTH * 3, BLOCK_WIDTH * 3, 5)
    } else {
      blockFrame.drawRoundedRect(0, 0, BLOCK_WIDTH * 2, BLOCK_WIDTH * 1, 5)
    }
    this.container.addChild(blockFrame)

    const texture = Globals.resources[this.type].texture
    const iconSprite = new PIXI.Sprite(texture)
    iconSprite.anchor.set(0.5, 0.5)

    this.container.addChild(iconSprite)

    iconSprite.x = blockFrame.width / 2
    iconSprite.y = blockFrame.height / 2

    this.container.pivot.set(blockFrame.width / 2, blockFrame.height / 2)
  }

  setupPositionInPixel() {
    switch (this.type) {
      case 'fauset':
        this.container.x = (this.i + 1) * BLOCK_WIDTH
        this.container.y = this.j * BLOCK_WIDTH + BLOCK_WIDTH / 2

        break
      case 'incinerator':
        this.container.x = this.i * BLOCK_WIDTH + BLOCK_WIDTH / 2
        this.container.y = this.j * BLOCK_WIDTH + BLOCK_WIDTH / 2
        break
    }
  }

  eaten() {
    const eatenTicker = new PIXI.Ticker()
    const rotateConstant = Math.floor(Math.random() * 2 - 1)

    eatenTicker.add(() => {
      if (this.container.alpha > 0) {
        this.container.angle += rotateConstant * 2
        // this.container.width -= 0.01
        this.container.alpha -= 0.002
      } else {
        eatenTicker.destroy()
      }
    })

    eatenTicker.start()
  }

  startHighlight() {
    this.highlightTicker = new PIXI.Ticker()
    let direction = 'dark'
    this.highlightTicker.add(() => {
      if (direction === 'dark') {
        this.container.alpha -= 0.02

        if (this.container.alpha <= 0.5) {
          direction = 'light'
        }
      } else if (direction === 'light') {
        this.container.alpha += 0.02

        if (this.container.alpha >= 1) {
          direction = 'dark'
        }
      }
    })

    this.highlightTicker.start()
  }

  stopHighlight() {
    this.highlightTicker.stop()
    this.container.alpha = 1
  }
}
