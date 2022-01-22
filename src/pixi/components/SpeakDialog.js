import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class SpeakDialog {
  constructor(text) {
    this.container = new PIXI.Container()
    this.text = text
    this.init()

    this.speakDialogGroup.y = Globals.height - this.whiteBackground.height
  }

  init() {
    this._createBackground()
    this.createDialog()
  }

  _createBackground() {
    const bg = new PIXI.Graphics()
    bg.beginFill(0x000000)
    bg.drawRect(0, 0, Globals.outerWidth, Globals.outerHeight)
    bg.endFill()
    bg.alpha = 0.7

    this.container.addChild(bg)
  }

  createDialog() {
    this.speakDialogGroup = new PIXI.Container()

    // create white bg
    this.whiteBackground = new PIXI.Graphics()
    this.whiteBackground.beginFill(0xffffff)
    this.whiteBackground.drawRect(
      0,
      0,
      Globals.dialogWidth,
      Globals.dialogHeight
    )
    this.whiteBackground.endFill()

    // this.whiteBackground.alpha = 0.8

    this.container.addChild(this.speakDialogGroup)

    // create doctor
    const sayId = Math.floor(Math.random() * 4)
    const doctorTexture = Globals.resources[`doctorSay_${sayId}`]?.texture
    this.doctor = new PIXI.Sprite(doctorTexture)
    this.doctor.anchor.set(0.5, 1)

    // const ratio = this.doctor.height / this.doctor.width
    // this.doctor.width = Globals.maxContentWidth / 2
    // this.doctor.height = this.doctor.width * ratio

    this.doctorOriginX = (Globals.width - Globals.maxContentWidth) / 2 + 30

    this.doctor.x = (Globals.width - Globals.maxContentWidth) / 2 - 40
    this.doctor.y = 0 + 2
    // this.doctor.y = -this.doctor.height / 2
    this.doctor.alpha = 0

    this.speakDialogGroup.addChild(this.doctor)
    this.speakDialogGroup.addChild(this.whiteBackground)

    // create text
    const fontSize = Globals.dialogFontSize
    // const textWidth = this.text.length*fontSize
    const contentWidth =
      Globals.width - 2 * 16 > Globals.maxContentWidth
        ? Globals.maxContentWidth
        : Globals.width - 2 * 16
    const text = new PIXI.Text(this.text, {
      align: 'center', // 對齊
      fontSize,
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: contentWidth,
    })
    text.x = (Globals.width - text.width) / 2
    text.y = (this.whiteBackground.height - text.height) / 2
    this.speakDialogGroup.addChild(text)

    // continueHint
    const arrowTexture = new PIXI.Texture(
      Globals.resources['arrowBlack']?.texture
    )
    this.arrowSprite = new PIXI.Sprite(arrowTexture)
    this.arrowSprite.angle = 270
    const initY = (this.whiteBackground.height * 3) / 4
    this.arrowSprite.x = (Globals.width + contentWidth) / 2
    this.arrowSprite.y = initY

    this.speakDialogGroup.addChild(this.arrowSprite)

    // arrow animation
    this.arrowTicker = new PIXI.Ticker()
    let direction = 'up'
    this.arrowTicker.add(() => {
      if (direction === 'up') {
        if (this.arrowSprite.y >= initY - this.arrowSprite.height / 2) {
          this.arrowSprite.y -= 0.2

          if (this.arrowSprite.y < initY - this.arrowSprite.height / 2) {
            direction = 'down'
          }
        }
      } else {
        if (this.arrowSprite.y <= initY) {
          this.arrowSprite.y += 0.2

          if (this.arrowSprite.y > initY) {
            direction = 'up'
          }
        }
      }
    })
    this.arrowTicker.start()

    // slide-fade-in animation
    this.talkTicker = new PIXI.Ticker()
    this.talkTicker.add(() => {
      if (this.doctor.x < this.doctorOriginX) {
        this.doctor.x = this.doctor.x + 3
      }

      if (this.doctor.alpha < 1) {
        this.doctor.alpha = this.doctor.alpha + 0.05
      }

      if (this.doctor.x >= this.doctorOriginX && this.doctor.alpha >= 1) {
        // this.talkTicker.stop()
        this.destorySpeakDialog()
      }
    })
    this.talkTicker.start()
  }

  destorySpeakDialog() {
    this.talkTicker?.stop?.()
    this.arrowTicker?.stop?.()
  }
}
