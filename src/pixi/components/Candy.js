import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
const gameStageDimention = Globals.getCandyGameStageDimention()
const CANDY_WIDTH = gameStageDimention.candyWidth

export class Candy {
  constructor(i = 0, j = 0, swapHandler = () => {}) {
    this.index = j * 10 + i
    this.i = i
    this.j = j
    this.swapHandler = swapHandler

    this.container = new PIXI.Container()
    this.container.name = 'candy'

    this.oldPosition = null
    this.newPosition = null
    // this.container.buttonMode = true
    // this.container.interactive = true

    this.createCandy()
    this.candyInitPosition()
    // this.startCandyTicker()
  }

  createCandy() {
    // console.log(this.index)
    const candyTexture = new PIXI.Texture(
      Globals.resources[`b${Math.floor(Math.random() * 5)}`]?.texture
    )
    const candySprite = new PIXI.Sprite(candyTexture)

    candySprite.width = CANDY_WIDTH
    candySprite.height = CANDY_WIDTH

    this.container.addChild(candySprite)
  }

  candyInitPosition() {
    // console.log(`${this.i * CANDY_WIDTH}, ${this.j * CANDY_WIDTH}`)
    this.container.x = this.i * CANDY_WIDTH
    this.container.y = -CANDY_WIDTH
  }

  startCandyTicker() {
    this.candyDropTicker = new PIXI.Ticker()
    const v0 = 0
    const g = 0.5
    let time = 0
    let dropDistance = 0
    this.container.alpha = 0

    this.candyDropTicker.add((delta) => {
      if (this.container.alpha < 1) {
        this.container.alpha += 0.1
      } else {
        this.container.alpha = 1
      }

      if (this.container.y < this.j * CANDY_WIDTH) {
        dropDistance = -CANDY_WIDTH + v0 * time + 0.5 * g * Math.pow(time, 2)

        // prevent over droping
        if (dropDistance > this.j * CANDY_WIDTH) {
          this.container.y = this.j * CANDY_WIDTH
        } else {
          this.container.y = dropDistance
        }
        time += delta
      } else {
        // const v = Math.floor(Math.sqrt(v0 + 2 * g * dropDistance))
        // console.log(v)
        this.candyDropTicker.stop()
        this.container.y = this.j * CANDY_WIDTH
      }
    })

    this.candyDropTicker.start()
  }

  startDragMonitor() {
    this.container.interactive = true
    this.container.buttonMode = true

    // let startPoint = null
    // let currentPoint = null

    this.container
      .on('mousedown', this.onDragStart.bind(this))
      .on('touchstart', this.onDragStart.bind(this))
      // events for drag end
      .on('mouseup', this.onDragEnd.bind(this))
      .on('mouseupoutside', this.onDragEnd.bind(this))
      .on('touchend', this.onDragEnd.bind(this))
      .on('touchendoutside', this.onDragEnd.bind(this))
      // events for drag move
      .on('mousemove', this.onDragMove.bind(this))
      .on('touchmove', this.onDragMove.bind(this))
  }

  onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data
    this.container.alpha = 0.5
    this.dragging = true
    this.oldPosition = this.data.getLocalPosition(this.container.parent)
  }

  onDragEnd() {
    this.container.alpha = 1
    this.dragging = false

    if (this.oldPosition && this.newPosition) {
      const direction = this.getDragDirection()

      this.swapHandler(this, direction)
    }

    // set the interaction data to null
    this.data = null
    this.oldPosition = null
    this.newPosition = null
  }

  onDragMove() {
    if (this.dragging) {
      this.newPosition = this.data.getLocalPosition(this.container.parent)
    }
  }

  getDragDirection() {
    const deltaX = this.newPosition.x - this.oldPosition.x
    const deltaY = this.newPosition.y - this.oldPosition.y

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // left or right drag
      return deltaX > 0 ? 'right' : 'left'
    } else {
      // up or down drag
      return deltaY > 0 ? 'down' : 'up'
    }
  }
}
