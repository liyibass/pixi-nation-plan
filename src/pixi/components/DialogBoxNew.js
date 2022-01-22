import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const PADDING = 20
const MARGING = 20
const MAX_BOX_WIDTH = 350
const MAX_CONTENT_WIDTH =
  Globals.outerWidth < MAX_BOX_WIDTH
    ? Globals.outerWidth - 2 * MARGING
    : MAX_BOX_WIDTH - 2 * MARGING
const FONT_SIZE = Globals.outerWidth < 500 ? 14 : 16
const PING_LENGTH = 30
// const DOCTOR_HEIGHT = 66

export class DialogBoxNew {
  constructor({
    text = '',
    talkerX = Globals.outerWidth / 2,
    talkerY = Globals.outerHeight / 2,
  }) {
    this.container = new PIXI.Container()
    this.container.buttonMode = true
    this.container.name = 'DialogBoxNew'

    this.talkerX = talkerX
    this.talkerY = talkerY
    this.text = text

    // this.init()
  }

  init() {
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
      this.text.length * FONT_SIZE < MAX_CONTENT_WIDTH
        ? this.text.length * FONT_SIZE
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
    const CONTENT_HEIGHT = this.pixiText.height
    const BOX_HEIGHT = CONTENT_HEIGHT + 2 * PADDING

    this.boxHeight = BOX_HEIGHT
    this.contentHeight = CONTENT_HEIGHT

    // calculate dialog position
    if (CONTENT_WIDTH < (MAX_CONTENT_WIDTH * 2) / 3) {
      this.dialogBoxPosition = 'side'
    } else {
      this.dialogBoxPosition = 'center'
    }
  }

  getPosition() {
    if (this.dialogBoxPosition === 'side') {
      this.x = this.talkerX
    } else {
      this.x = (Globals.outerWidth - this.boxWidth) / 2
    }
    this.y = this.talkerY - PING_LENGTH - Globals.doctorHeight - this.boxHeight

    this.container.x = this.x
    this.container.y = this.y
  }

  createDialogBox() {
    this.roundRect = new PIXI.Graphics()

    this.roundRect.beginFill(0xeeeeee)
    this.roundRect.drawRoundedRect(0, 0, this.boxWidth, this.boxHeight, 15)
    this.roundRect.endFill()

    this.container.addChild(this.roundRect)
  }

  addText() {
    this.container.addChild(this.pixiText)
  }

  positionContent() {
    this.pixiText.position.x = (this.boxWidth - this.pixiText.width) / 2
    this.pixiText.position.y = (this.boxHeight - this.pixiText.height) / 2
  }

  createSpin() {
    const TALKER_WIDTH = 30
    // const TALKER_HEIGHT = 60
    const spinX = Math.abs(this.talkerX - this.x)
    const spinY = Math.abs(this.boxHeight + PING_LENGTH)

    const graphics = new PIXI.Graphics()
    graphics.lineStyle(2, 0xeeeeee, 1)
    graphics.beginFill(0xeeeeee)

    graphics.moveTo(this.boxWidth / 3 - 3, this.boxHeight)
    graphics.lineTo(
      this.talkerX > this.x + this.boxWidth / 2
        ? spinX - TALKER_WIDTH / 2
        : spinX + TALKER_WIDTH / 2,
      spinY
    )
    graphics.lineTo(this.boxWidth / 3 + 3, this.boxHeight)
    graphics.closePath()
    graphics.endFill()
    this.container.addChild(graphics)
  }
}
