import * as PIXI from 'pixi.js'
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
  }

  init() {
    this.createTwoButtons()

    this.createText()
    this.createDialogBox()
    this.addText()

    this.getPosition()

    this.positionContent()
    this.createSpin()
  }

  createText() {
    // calculate content width
    const CONTENT_WIDTH =
      this.text.length * FONT_SIZE > MAX_CONTENT_WIDTH
        ? MAX_CONTENT_WIDTH
        : this.text.length * FONT_SIZE > this.twoButtons.container.width
        ? this.text.length * FONT_SIZE
        : this.twoButtons.container.width

    const BOX_WIDTH = CONTENT_WIDTH + 2 * PADDING
    this.boxWidth = BOX_WIDTH
    this.contentWidth = CONTENT_WIDTH

    // add text
    this.pixiText = new PIXI.Text(this.text, {
      align: 'center', // 對齊
      fontSize: FONT_SIZE,
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: this.contentWidth,
    })

    // calculate content height
    const CONTENT_HEIGHT =
      this.pixiText.height + this.twoButtons.container.height + PADDING
    const BOX_HEIGHT = CONTENT_HEIGHT + 2 * PADDING

    this.boxHeight = BOX_HEIGHT
    this.contentHeight = CONTENT_HEIGHT

    // calculate dialog position
    this.dialogBoxPosition = 'center'
  }

  positionContent() {
    this.container.addChild(this.twoButtons.container)

    this.pixiText.position.x = (this.boxWidth - this.pixiText.width) / 2
    this.pixiText.position.y = PADDING

    this.twoButtons.container.x =
      (this.boxWidth - this.twoButtons.container.width) / 2
    this.twoButtons.container.y =
      this.boxHeight - this.twoButtons.container.height - PADDING
  }
}
