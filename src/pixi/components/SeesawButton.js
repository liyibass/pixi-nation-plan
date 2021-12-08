import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class SeesawButton {
  constructor() {
    this.container = new PIXI.Container()
    this.createButton()
  }

  createButton() {
    const buttonTexture = new PIXI.Texture(
      Globals.resources[`seesawButton`].texture
    )
    const buttonSprite = new PIXI.Sprite(buttonTexture)

    this.container.addChild(buttonSprite)
  }
}
