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
      case 'menu':
        return 0
      case 'snake':
        return 1
      case 'balance':
        return 2
      case 'candy':
        return 3
      case 'run':
        return 4

      default:
        return 0
    }
  }
  createTitle() {
    const liftUpDistance = this.gameName === 'menu' ? 65 : 15
    const title0Texture = new PIXI.Texture(
      Globals.resources[`game${this.getTextureNumber()}_0`]?.texture
    )
    const title1Texture = new PIXI.Texture(
      Globals.resources[`game${this.getTextureNumber()}_1`]?.texture
    )

    this.title0Sprite = new PIXI.Sprite(title0Texture)
    this.title1Sprite = new PIXI.Sprite(title1Texture)

    const MAX_TITLE_WIDTH = Globals.width - 30 > 320 ? 320 : Globals.width - 30

    const scale = MAX_TITLE_WIDTH / this.title1Sprite.width

    this.title0Sprite.width *= scale
    this.title0Sprite.height *= scale
    this.title1Sprite.width *= scale
    this.title1Sprite.height *= scale
    this.title0Sprite.alpha = 0
    this.title1Sprite.alpha = 0

    this.title0Sprite.x = (this.bg.width - this.title0Sprite.width) / 2
    this.title1Sprite.x = (this.bg.width - this.title1Sprite.width) / 2
    this.title0InitY =
      Globals.height / 2 - this.title0Sprite.height - liftUpDistance
    this.title1InitY = Globals.height / 2 - liftUpDistance

    const offset = this.title1Sprite.height * 2
    this.title0Sprite.y = this.title0InitY - offset
    this.title1Sprite.y = this.title1InitY + offset

    if (this.gameName === 'menu') {
      const title2Texture = new PIXI.Texture(
        Globals.resources[`game${this.getTextureNumber()}_2`]?.texture
      )
      const readrTexture = new PIXI.Texture(
        Globals.resources[`game${this.getTextureNumber()}_3`]?.texture
      )

      this.title2Sprite = new PIXI.Sprite(title2Texture)
      this.readrSprite = new PIXI.Sprite(readrTexture)

      this.title2Sprite.width *= scale
      this.title2Sprite.height *= scale
      this.readrSprite.width *= scale
      this.readrSprite.height *= scale
      this.title2Sprite.alpha = 0
      this.readrSprite.alpha = 0

      this.title2Sprite.x = (this.bg.width - this.title2Sprite.width) / 2
      this.readrSprite.x = (this.bg.width - this.readrSprite.width) / 2
      this.title2InitY =
        Globals.height / 2 - this.title1Sprite.height / 2 + 20 - liftUpDistance
      this.readrInitY =
        Globals.height / 2 + this.title1Sprite.height + 100 - liftUpDistance

      const offset2 = 0
      this.title2Sprite.y = this.title2InitY - offset2
      this.readrSprite.y = this.readrInitY + offset2

      this.container.addChild(this.title2Sprite, this.readrSprite)
    }
    this.container.addChild(this.title0Sprite, this.title1Sprite)
  }

  async revealTitle() {
    await this.revealBg()
    await this.showTitle()
    await this.showRestTitle()
    await this.showReadr()
    await this._wait(1000)
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
          this.title0Sprite.y += 3
          this.title0Sprite.alpha += 0.01
        } else {
          this.title0Sprite.y = this.title0InitY
          this.title0Sprite.alpha = 1
        }

        if (this.title1Sprite.y > this.title1InitY) {
          this.title1Sprite.y -= 3
          this.title1Sprite.alpha += 0.01
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

  showRestTitle() {
    if (this.gameName !== 'menu') return

    this.titleTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.titleTicker.add(() => {
        if (this.title2Sprite.alpha < 1) {
          this.title2Sprite.alpha += 0.02
        } else {
          this.title2Sprite.alpha = 1
          this.titleTicker.stop()
          resolve()
        }
      })

      this.titleTicker.start()
    })
  }

  showReadr() {
    if (this.gameName !== 'menu') return

    this.titleTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.titleTicker.add(() => {
        if (this.readrSprite.alpha < 1) {
          this.readrSprite.alpha += 0.02
        } else {
          this.readrSprite.alpha = 1
          this.titleTicker.stop()
          resolve()
        }
      })

      this.titleTicker.start()
    })
  }

  goToDark() {
    this.darkTicker = new PIXI.Ticker()

    let constant = 1
    if (this.gameName === 'menu') {
      constant = -1
    }

    if (constant > 0) {
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
    } else {
      return new Promise((resolve) => {
        this.darkTicker.add(() => {
          if (this.bg.alpha > 0) {
            this.bg.alpha -= 0.005
            this.title0Sprite.alpha -= 0.02
            this.title1Sprite.alpha -= 0.02

            this.title2Sprite.alpha -= 0.02
            this.readrSprite.alpha -= 0.02
          } else {
            this.darkTicker.stop()
            resolve()
          }
        })

        this.darkTicker.start()
      })
    }
  }

  _wait(delayTime) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, delayTime)
    })
  }
}
