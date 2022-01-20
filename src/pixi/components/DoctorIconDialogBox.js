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
      this.twoIcons.container.height +
      PADDING
    const BOX_HEIGHT = CONTENT_HEIGHT + 2 * PADDING

    this.boxWidth = BOX_WIDTH
    this.boxHeight = BOX_HEIGHT
    this.contentWidth = CONTENT_WIDTH
    this.contentHeight = CONTENT_HEIGHT

    if (CONTENT_WIDTH < Globals.width / 2) {
      this.dialogBoxPosition = 'side'
    } else {
      this.dialogBoxPosition = 'center'
    }
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
