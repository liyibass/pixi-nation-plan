import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
const BUTTON_CONTAINER_WIDTH = 194
const BUTTON_CONTAINER_HEIGHT = 32
export class TwoButtons {
  constructor(chosenHandler) {
    this.container = new PIXI.Container()
    this.chosenHandler = chosenHandler

    this.createOuterFrame()
    this.createTwoButtons()
  }

  createOuterFrame() {
    const outerFrame = new PIXI.Graphics()
    outerFrame.lineStyle(1, 0x000000, 0)
    outerFrame.drawRect(0, 0, BUTTON_CONTAINER_WIDTH, BUTTON_CONTAINER_HEIGHT)
    this.container.addChild(outerFrame)
  }

  createTwoButtons() {
    this.playButton = this.getButtonContainer('玩玩看吧', '0xc4c4c4')
    this.skipButton = this.getButtonContainer('先不用', '0xFF8B29')

    this.container.addChild(this.playButton, this.skipButton)
    console.log(this.container.width)
    this.playButton.x = 0
    this.playButton.y = 0
    this.skipButton.x = this.container.width - this.skipButton.width
    this.skipButton.y = 0

    this.playButton.on('pointerdown', async () => {
      this.chosenHandler('play')
      this.playButton.removeListener()
      this.container.destroy()
    })
    this.skipButton.on('pointerdown', async () => {
      this.chosenHandler('skip')
      this.skipButton.removeListener()
      this.container.destroy()
    })
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
