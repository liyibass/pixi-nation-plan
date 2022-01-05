import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'

export class GameUnlockButton {
  constructor() {
    this.container = new PIXI.Container()
    this.container.name = 'unlockButton'

    this.createUnlockButton()
  }

  createUnlockButton() {
    this.createLock()
  }

  createLock() {
    // const lockTexture = new PIXI.Texture(Globals.resources['lock'].texture)
  }
}
