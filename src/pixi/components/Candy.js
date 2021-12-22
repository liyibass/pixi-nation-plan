import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
const gameStageDimention = Globals.getCandyGameStageDimention()
const CANDY_WIDTH = gameStageDimention.candyWidth

export class Candy {
  constructor(i = 0, j = 0, collisionMonitor = () => {}) {
    this.index = j * 10 + i
    this.i = i
    this.j = j
    this.collisionMonitor = collisionMonitor

    this.container = new PIXI.Container()
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
}
