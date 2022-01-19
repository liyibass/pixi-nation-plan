import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
const {
  BUTTON_CONTAINER_WIDTH,
  BUTTON_CONTAINER_HEIGHT,
  BUTTON_WIDTH,
  BUTTON_HEIGHT,
} = Globals

export class TwoIcons {
  constructor(chosenHandler, icon1Name = 'facebook', icon2Name = 'line') {
    this.container = new PIXI.Container()
    this.chosenHandler = chosenHandler
    this.icon1Name = icon1Name
    this.icon2Name = icon2Name

    this.createOuterFrame()
    this.createTwoIcons()
  }

  createOuterFrame() {
    const outerFrame = new PIXI.Graphics()
    outerFrame.lineStyle(1, 0x000000, 0)
    outerFrame.drawRect(
      0,
      0,
      this.icon2Name ? BUTTON_CONTAINER_WIDTH : BUTTON_WIDTH,
      BUTTON_CONTAINER_HEIGHT
    )
    this.container.addChild(outerFrame)
  }

  createTwoIcons() {
    this.icon1 = this.getButtonContainer(this.icon1Name)

    this.icon1.x = 0
    this.icon1.y = 0

    this.icon1.on('pointerdown', async () => {
      await this.chosenHandler(this.icon1Name)
      this.icon1.removeListener()
      this.container.destroy()
    })

    this.container.addChild(this.icon1)

    if (this.icon2Name) {
      this.icon2 = this.getButtonContainer(this.icon2Name)

      this.icon1.x = 0
      this.icon1.y = 0
      this.icon2.x = this.container.width - this.icon2.width
      this.icon2.y = 0

      this.icon2.on('pointerdown', async () => {
        await this.chosenHandler(this.icon2Name)
        this.icon2.removeListener()
        this.container.destroy()
      })

      this.container.addChild(this.icon1, this.icon2)
    }
  }

  destoryTwoIcons() {
    this.icon1.removeAllListeners()
    this.icon2.removeAllListeners()
  }

  getButtonContainer(text) {
    const buttonContainer = new PIXI.Container()

    const buttonBackground = new PIXI.Graphics()
    buttonBackground.beginFill(0xffffff)
    buttonBackground.drawRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 5)
    buttonBackground.endFill()

    const buttonText = new PIXI.Text(text, { fontSize: 14, fill: ['0x000000'] })

    buttonText.anchor.set(0.5, 0.5)
    buttonText.x = buttonBackground.width / 2
    buttonText.y = buttonBackground.height / 2

    buttonContainer.addChild(buttonBackground, buttonText)
    buttonContainer.buttonMode = true
    buttonContainer.interactive = true

    return buttonContainer
  }
}
