import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
const {
  BUTTON_CONTAINER_WIDTH,
  BUTTON_CONTAINER_HEIGHT,
  BUTTON_WIDTH,
  BUTTON_HEIGHT,
} = Globals

export class TwoButtons {
  constructor(chosenHandler, button1, button2) {
    this.container = new PIXI.Container()
    this.chosenHandler = chosenHandler
    this.button1 = button1
    this.button2 = button2

    this.createOuterFrame()
    this.createTwoButtons()
  }

  createOuterFrame() {
    const outerFrame = new PIXI.Graphics()
    outerFrame.lineStyle(1, 0x000000, 0)
    outerFrame.drawRect(
      0,
      0,
      this.button2 ? BUTTON_CONTAINER_WIDTH : BUTTON_WIDTH,
      BUTTON_CONTAINER_HEIGHT
    )
    this.container.addChild(outerFrame)
  }

  createTwoButtons() {
    this.playButton = this.getButtonContainer(
      this.button1.text,
      this.button1.color,
      this.button1.bgColor,
      this.button1.value
    )

    this.playButton.x = 0
    this.playButton.y = 0

    this.playButton.on('pointerdown', async () => {
      await this.chosenHandler(this.playButton.value)
      this.playButton.removeListener()
      this.container.destroy()
    })

    this.container.addChild(this.playButton)

    if (this.button2) {
      this.skipButton = this.getButtonContainer(
        this.button2.text,
        this.button2.color,
        this.button2.bgColor,
        this.button2.value
      )

      this.playButton.x = 0
      this.playButton.y = 0
      this.skipButton.x = this.container.width - this.skipButton.width
      this.skipButton.y = 0

      this.skipButton.on('pointerdown', async () => {
        await this.chosenHandler(this.skipButton.value)
        this.skipButton.removeListener()
        this.container.destroy()
      })

      this.container.addChild(this.playButton, this.skipButton)
    }
  }

  getButtonContainer(text, color, bgColor, value) {
    const buttonContainer = new PIXI.Container()

    const buttonBackground = new PIXI.Graphics()
    buttonBackground.beginFill(bgColor)
    buttonBackground.drawRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 5)
    buttonBackground.endFill()

    const buttonText = new PIXI.Text(text, { fontSize: 14, fill: [color] })

    buttonText.anchor.set(0.5, 0.5)
    buttonText.x = buttonBackground.width / 2
    buttonText.y = buttonBackground.height / 2

    buttonContainer.addChild(buttonBackground, buttonText)
    buttonContainer.buttonMode = true
    buttonContainer.interactive = true
    buttonContainer.value = value

    return buttonContainer
  }
}
