import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { DialogBoxNew } from './DialogBoxNew'
import { TwoIcons } from './TwoIcons'

const PADDING = 20
const MARGING = 20
const MAX_BOX_WIDTH = 350
const MAX_CONTENT_WIDTH =
  Globals.width < MAX_BOX_WIDTH
    ? Globals.width - 2 * MARGING
    : MAX_BOX_WIDTH - 2 * MARGING
const FONT_SIZE = Globals.width < 500 ? 14 : 16

export class DoctorIconDialogBox extends DialogBoxNew {
  constructor(...args) {
    super(...args)
    this.chosenHandler = args[0].clickHandler
    this.icon1Name = args[0].icon1Name
    this.icon2Name = args[0].icon2Name
  }

  createTwoIcons() {
    this.twoIcons = new TwoIcons(
      this.chosenHandler,
      this.icon1Name,
      this.icon2Name
    )
    // this.container.addChild(this.twoIcons.container)
    // this.container.interactive = true
    // this.container.buttonMode = false
  }

  init() {
    this.createTwoIcons()

    this.createText()
    this.createDialogBox()

    this.addText()

    this.getPosition()

    this.positionContent()
    this.createSpin()
  }

  createText() {
    // calculate content width
    const widerContentwidth =
      this.text.length * FONT_SIZE > this.twoIcons.container.width
        ? this.text.length * FONT_SIZE
        : this.twoIcons.container.width

    const CONTENT_WIDTH =
      widerContentwidth < MAX_CONTENT_WIDTH
        ? widerContentwidth
        : MAX_CONTENT_WIDTH
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
      this.pixiText.height + this.twoIcons.container.height + PADDING
    const BOX_HEIGHT = CONTENT_HEIGHT + 2 * PADDING

    this.boxHeight = BOX_HEIGHT
    this.contentHeight = CONTENT_HEIGHT

    // calculate dialog position
    this.dialogBoxPosition = 'center'
  }

  positionContent() {
    this.container.addChild(this.twoIcons.container)

    this.pixiText.position.x = (this.boxWidth - this.pixiText.width) / 2
    this.pixiText.position.y = PADDING

    this.twoIcons.container.x =
      (this.boxWidth - this.twoIcons.container.width) / 2
    this.twoIcons.container.y = 0
    this.twoIcons.container.y =
      PADDING +
      this.pixiText.height +
      PADDING +
      this.twoIcons.container.height / 2
  }
}
