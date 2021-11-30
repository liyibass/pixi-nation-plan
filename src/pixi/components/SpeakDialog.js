import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

const DIALOG_WIDTH = window.innerWidth
const DIALOG_HEIGHT = (window.innerHeight * 2) / 5 - 50

export class SpeakDialog {
  constructor(text) {
    this.container = new PIXI.Container()
    this.text = text
    this.init()

    this.speakDialogGroup.y = Globals.height - this.whiteBackground.height
  }

  init() {
    this.createBackground()
    this.createDialog()
  }

  createBackground() {
    const bg = new PIXI.Graphics()
    bg.beginFill(0x000000)
    bg.drawRect(0, 0, Globals.width, Globals.height)
    bg.endFill()
    bg.alpha = 0.7

    this.container.addChild(bg)
  }

  createDialog() {
    this.speakDialogGroup = new PIXI.Container()

    // create white bg
    this.whiteBackground = new PIXI.Graphics()
    this.whiteBackground.beginFill(0xffffff)
    this.whiteBackground.drawRect(0, 0, DIALOG_WIDTH, DIALOG_HEIGHT)
    this.whiteBackground.endFill()

    // this.whiteBackground.alpha = 0.8

    this.container.addChild(this.speakDialogGroup)

    // create doctor
    const doctorTexture = Globals.resources['doctorBig']?.texture
    this.doctor = new PIXI.Sprite(doctorTexture)
    // this.doctor.anchor.set(0.5, 0.5)

    const ratio = this.doctor.height / this.doctor.width
    this.doctor.width = Globals.maxContentWidth / 2
    this.doctor.height = this.doctor.width * ratio

    this.doctorOriginX = (Globals.width - Globals.maxContentWidth) / 2

    this.doctor.x = this.doctorOriginX - 50
    this.doctor.y = -this.doctor.height / 2
    this.doctor.alpha = 0

    this.speakDialogGroup.addChild(this.doctor)
    this.speakDialogGroup.addChild(this.whiteBackground)

    // create text
    const text = new PIXI.Text(this.text, {
      align: 'center', // 對齊
      fontSize: 20,
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: (Globals.maxContentWidth * 2) / 3 - 5,
    })
    text.x = (Globals.width - text.width) / 2
    text.y = (this.whiteBackground.height - text.height) / 2
    this.speakDialogGroup.addChild(text)

    // slide-fade-in animation
    const talkTicker = new PIXI.Ticker()
    talkTicker.add(() => {
      if (this.doctor.x < this.doctorOriginX) {
        this.doctor.x = this.doctor.x + 3
      }

      if (this.doctor.alpha < 1) {
        this.doctor.alpha = this.doctor.alpha + 0.05
      }

      if (this.doctor.x >= this.doctorOriginX && this.doctor.alpha >= 1) {
        talkTicker.destroy()
      }
    })
    talkTicker.start()
  }
}
