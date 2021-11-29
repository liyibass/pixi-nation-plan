// import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
import { DialogBox } from './DialogBox'
import { TwoButtons } from './TwoButtons'

export class DoctorDialogBox extends DialogBox {
  constructor(...args) {
    super(...args)
    this.chosenHandler = args[0].chosenHandler
    this.button1 = args[0].button1
    this.button2 = args[0].button2

    this.init()
  }
  init() {
    const twoButtons = new TwoButtons(
      this.chosenHandler,
      this.button1,
      this.button2
    )
    this.container.addChild(twoButtons.container)

    this.pixiText.y = 50
    twoButtons.container.x =
      (this.roundRect.width - twoButtons.container.width) / 2
    twoButtons.container.y =
      this.roundRect.height - twoButtons.container.height - 12
  }
}
