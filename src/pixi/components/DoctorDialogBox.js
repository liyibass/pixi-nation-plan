// import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
import { DialogBox } from './DialogBox'
import { TwoButtons } from './TwoButtons'

export class DoctorDialogBox extends DialogBox {
  constructor(...args) {
    super(...args)
    this.chosenHandler = args[0].chosenHandler

    this.init()
  }
  init() {
    const twoButtons = new TwoButtons(this.chosenHandler)
    this.container.addChild(twoButtons.container)

    this.pixiText.y = 50
    twoButtons.container.x =
      (this.roundRect.width - twoButtons.container.width) / 2
    twoButtons.container.y =
      this.roundRect.height - twoButtons.container.height - 12
  }
}
