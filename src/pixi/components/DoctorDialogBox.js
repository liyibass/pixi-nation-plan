import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
import { DialogBox } from './DialogBox'

export class DoctorDialogBox extends DialogBox {
  constructor(...args) {
    super(...args)

    this.createDoctorDialogBox()
    this.createTwoButtons()
  }

  createDoctorDialogBox() {
    console.log('createDoctorDialogBox')
  }

  createTwoButtons() {
    this.playButton = this.getButtonContainer('玩玩看吧', '0xc4c4c4')
    this.skipButton = this.getButtonContainer('先不用', '0xFF8B29')

    this.container.addChild(this.playButton, this.skipButton)

    this.pixiText.y = 60
    this.playButton.x = this.roundRect.width / 2 - this.playButton.width - 6
    this.playButton.y = this.roundRect.height - this.playButton.height - 24
    this.skipButton.x = this.roundRect.width / 2 + 6
    this.skipButton.y = this.roundRect.height - this.playButton.height - 24
  }

  getButtonContainer(text, color) {
    const BUTTON_WIDTH = 88
    const BUTTON_HEIGHT = 32
    const buttonContainer = new PIXI.Container()

    const buttonBackground = new PIXI.Graphics()
    buttonBackground.beginFill(color)
    buttonBackground.drawRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT)
    buttonBackground.endFill()

    const buttonText = new PIXI.Text(text, { fontSize: 14 })

    buttonText.anchor.set(0.5, 0.5)
    buttonText.x = buttonBackground.width / 2
    buttonText.y = buttonBackground.height / 2

    buttonContainer.addChild(buttonBackground, buttonText)
    buttonContainer.buttonMode = true
    buttonContainer.interactive = true

    return buttonContainer
  }
}
