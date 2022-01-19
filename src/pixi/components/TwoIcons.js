import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
const { BUTTON_CONTAINER_WIDTH, BUTTON_CONTAINER_HEIGHT } = Globals

let ICON_WIDTH = 40

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
      this.icon2Name ? BUTTON_CONTAINER_WIDTH : ICON_WIDTH,
      BUTTON_CONTAINER_HEIGHT
    )
    // this.container.addChild(outerFrame)
  }

  createTwoIcons() {
    this.icon1 = this.getIconContainer(this.icon1Name)

    this.icon1.x = 0
    this.icon1.y = 0

    this.icon1.on('pointerdown', async () => {
      await this.chosenHandler(this.icon1Name)
      this.icon1.removeListener()
      this.container.destroy()
    })

    this.container.addChild(this.icon1)

    if (this.icon2Name) {
      this.icon2 = this.getIconContainer(this.icon2Name)

      this.icon1.x = 0
      this.icon1.y = 0
      this.icon2.x = this.icon2.width + 21
      // this.icon2.x = this.container.width - this.icon2.width
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

  getIconContainer(text) {
    const buttonContainer = new PIXI.Container()

    if (text === 'tigerHead') {
      ICON_WIDTH = 60
    } else if (text === 'bearHead') {
      ICON_WIDTH = 70
    }

    const texture = new PIXI.Texture(Globals.resources[`${text}`]?.texture)
    const sprite = new PIXI.Sprite(texture)
    sprite.anchor.set(0, 0.5)

    const ratio = ICON_WIDTH / sprite.width
    sprite.width *= ratio
    sprite.height *= ratio
    buttonContainer.addChild(sprite)
    // buttonContainer.pivot.set(sprite.width / 2, sprite.height / 2)

    buttonContainer.buttonMode = true
    buttonContainer.interactive = true

    return buttonContainer
  }
}
