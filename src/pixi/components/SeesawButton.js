import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class SeesawButton {
  constructor() {
    this.container = new PIXI.Container()
    this.isWarning = false
    this.createLight()
    this.createButton()
  }

  createButton() {
    const buttonTexture = new PIXI.Texture(
      Globals.resources[`seesawButton`].texture
    )
    this.buttonSprite = new PIXI.Sprite(buttonTexture)
    this.buttonSprite.pivot.set(
      this.buttonSprite.width / 2,
      this.buttonSprite.height / 2
    )

    this.container.addChild(this.buttonSprite)
  }

  createLight() {
    // Inner radius of the circle
    const radius = 40

    // The blur amount
    const blurSize = 20
    this.light = new PIXI.Graphics()
      .beginFill(0xff0000, 0.5)
      .drawCircle(0, 0, radius)
      .endFill()
    this.light.filters = [new PIXI.filters.BlurFilter(blurSize)]

    this.container.addChild(this.light)

    this.light.alpha = 0
  }

  warning() {
    if (this.isWarning) return

    this.isWarning = true

    this.warningInterval = setInterval(() => {
      if (this.light.alpha === 0) {
        this.light.alpha = 1
      } else {
        this.light.alpha = 0
      }
    }, 200)
  }

  unWarning() {
    this.isWarning = false
    this.light.alpha = 0

    clearInterval(this.warningInterval)
  }
}
