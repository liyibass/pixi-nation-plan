import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class GameTitle {
  constructor(choosedGame) {
    this.container = new PIXI.Container()
    this.container.interactive = true
    this.container.buttonMode = true
    this.gameName = choosedGame?.gameName || choosedGame
    this.init()
  }

  init() {
    this._createBackground()
    this.createTitle()
  }

  _createBackground() {
    this.bg = new PIXI.Graphics()
    this.bg.beginFill(0x000000)
    this.bg.drawRect(0, 0, Globals.width, Globals.height)
    this.bg.endFill()
    this.bg.alpha = 0

    this.container.addChild(this.bg)
  }
  getTextureNumber() {
    switch (this.gameName) {
      case 'snake':
        return 1
      case 'balance':
        return 2
      case 'candy':
        return 3
      case 'run':
        return 4

      default:
        break
    }
  }
  createTitle() {
    const title0Texture = new PIXI.Texture(
      Globals.resources[`game${this.getTextureNumber()}_0`]?.texture
    )
    const title1Texture = new PIXI.Texture(
      Globals.resources[`game${this.getTextureNumber()}_1`]?.texture
    )

    this.title0Sprite = new PIXI.Sprite(title0Texture)
    this.title1Sprite = new PIXI.Sprite(title1Texture)

    const scale0 = 151 / this.title0Sprite.width
    const scale1 = 320 / this.title1Sprite.width

    this.title0Sprite.width *= scale0
    this.title0Sprite.height *= scale0
    this.title1Sprite.width *= scale1
    this.title1Sprite.height *= scale1
    this.title0Sprite.alpha = 0
    this.title1Sprite.alpha = 0

    this.title0Sprite.x = (this.bg.width - this.title0Sprite.width) / 2
    this.title1Sprite.x = (this.bg.width - this.title1Sprite.width) / 2
    this.title0InitY = Globals.height / 2 - this.title0Sprite.height - 15
    this.title1InitY = Globals.height / 2 - 15
    this.title0Sprite.y = this.title0InitY - this.title0Sprite.height * 2
    this.title1Sprite.y = this.title1InitY + this.title1Sprite.height * 2

    this.container.addChild(this.title0Sprite, this.title1Sprite)
  }

  async revealTitle() {
    await this.revealBg()
    await this.showTitle()

    await this._wait(3000)
    await this.goToDark()
    await this._wait(1000)
  }

  revealBg() {
    this.bgTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.bgTicker.add(() => {
        if (this.bg.alpha < 0.7) {
          this.bg.alpha += 0.02
        } else {
          this.bgTicker.stop()
          this.bg.alpha = 0.7
          resolve()
        }
      })

      this.bgTicker.start()
    })
  }

  showTitle() {
    this.titleTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.titleTicker.add(() => {
        if (this.title0Sprite.y < this.title0InitY) {
          this.title0Sprite.y += 2
          this.title0Sprite.alpha += 0.005
        } else {
          this.titleTicker.stop()
          this.title0Sprite.y = this.title0InitY
          this.title0Sprite.alpha = 1

          resolve()
        }
        if (this.title1Sprite.y > this.title1InitY) {
          this.title1Sprite.y -= 2
          this.title1Sprite.alpha += 0.005
        } else {
          this.titleTicker.stop()
          this.title1Sprite.y = this.title1InitY
          this.title1Sprite.alpha = 1

          resolve()
        }
      })

      this.titleTicker.start()
    })
  }

  goToDark() {
    this.darkTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.darkTicker.add(() => {
        if (this.bg.alpha < 1) {
          this.bg.alpha += 0.005
          this.title0Sprite.alpha -= 0.02
          this.title1Sprite.alpha -= 0.02
        } else {
          this.darkTicker.stop()
          resolve()
        }
      })

      this.darkTicker.start()
    })
  }

  _wait(delayTime) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, delayTime)
    })
  }
}
