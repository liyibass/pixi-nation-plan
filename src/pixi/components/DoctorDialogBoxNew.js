// import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { DialogBoxNew } from './DialogBoxNew'
import { TwoButtons } from './TwoButtons'

const PADDING = 20
const MARGING = 20
const MAX_BOX_WIDTH = 350
const MAX_CONTENT_WIDTH =
  Globals.width < MAX_BOX_WIDTH
    ? Globals.width - 2 * MARGING
    : MAX_BOX_WIDTH - 2 * MARGING
const FONT_SIZE = Globals.width < 500 ? 14 : 16

export class DoctorDialogBoxNew extends DialogBoxNew {
  constructor(...args) {
    super(...args)
    this.chosenHandler = args[0].chosenHandler
    this.button1 = args[0].button1
    this.button2 = args[0].button2
  }

  createTwoButtons() {
    this.twoButtons = new TwoButtons(
      this.chosenHandler,
      this.button1,
      this.button2
    )

    // this.container.addChild(twoButtons.container)

    // this.pixiText.y = 50
    // twoButtons.container.x =
    //   (this.roundRect.width - twoButtons.container.width) / 2
    // twoButtons.container.y =
    //   this.roundRect.height - twoButtons.container.height - 12
  }

  init() {
    this.createTwoButtons()
    this.getSize()
    this.createDialogBox()
    this.getPosition()

    this.createText()
    this.positionContent()

    this.createSpin()
  }

  getSize() {
    const CONTENT_WIDTH = MAX_CONTENT_WIDTH
    this.text.length * FONT_SIZE < MAX_CONTENT_WIDTH

    const BOX_WIDTH = CONTENT_WIDTH + 2 * PADDING

    const CONTENT_HEIGHT =
      Math.ceil((this.text.length * FONT_SIZE) / CONTENT_WIDTH) * FONT_SIZE +
      this.twoButtons.container.height +
      PADDING
    const BOX_HEIGHT = CONTENT_HEIGHT + 2 * PADDING

    this.boxWidth = BOX_WIDTH
    this.boxHeight = BOX_HEIGHT
    this.contentWidth = CONTENT_WIDTH
    this.contentHeight = CONTENT_HEIGHT

    this.dialogBoxPosition = 'center'
  }

  positionContent() {
    this.container.addChild(this.twoButtons.container)

    this.pixiText.position.x = (this.boxWidth - this.pixiText.width) / 2
    this.pixiText.position.y = PADDING

    this.twoButtons.container.x =
      (this.boxWidth - this.twoButtons.container.width) / 2
    this.twoButtons.container.y = PADDING + this.pixiText.height + PADDING
  }
}
