import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const PADDING = 16
const MAX_BOX_WIDTH = 350
// const MAX_BOX_HEIGHT = 200

export class DialogBox {
  constructor({
    text,
    fontSize = 20,
    x = Globals.width / 2 + 20,
    y = Globals.height / 2 - 150,
    talkerX = Globals.width / 2,
    talkerY = Globals.height / 2,
    width = 100,
    height = 72,
  }) {
    this.container = new PIXI.Container()
    this.container.buttonMode = true
    this.x = x
    this.y = y
    this.talkerX = talkerX
    this.talkerY = talkerY
    this.width = width
    this.height = height
    this.text = text
    this.fontSize = fontSize

    this.getSize()
    this.createDialogBox()
    this.createText()
    this.createSpin()
    this.setPosition()
  }

  getSize() {
    const BOX_WIDTH =
      window.innerWidth - 2 * PADDING > MAX_BOX_WIDTH
        ? MAX_BOX_WIDTH
        : window.innerWidth - 2 * PADDING

    this.width = BOX_WIDTH
    this.x = (Globals.width - this.width) / 2
  }

  createDialogBox() {
    this.roundRect = new PIXI.Graphics()

    this.roundRect.beginFill(0xeeeeee)
    this.roundRect.drawRoundedRect(0, 0, this.width, this.height, 15)
    this.roundRect.endFill()

    this.container.addChild(this.roundRect)
  }

  createText() {
    this.pixiText = new PIXI.Text(this.text, {
      align: 'center', // 對齊
      fontSize: this.fontSize,
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: this.width - PADDING * 2,
    })

    this.container.addChild(this.pixiText)

    this.pixiText.position.x = this.container.width / 2
    this.pixiText.position.y = this.container.height / 2
    this.pixiText.anchor.set(0.5, 0.5)
  }

  createSpin() {
    const TALKER_WIDTH = 30
    const TALKER_HEIGHT = 60
    const spinX = this.talkerX - this.x
    const spinY = this.talkerY - this.y

    let graphics = new PIXI.Graphics()
    graphics.lineStyle(2, 0xeeeeee, 1)
    graphics.beginFill(0xeeeeee)
    graphics.drawPolygon([
      this.width / 3 - 3,
      this.height,
      this.talkerX > this.x ? spinX - TALKER_WIDTH : spinX + TALKER_WIDTH,
      spinY - TALKER_HEIGHT,
      this.width / 3 + 3,
      this.height,
    ])
    graphics.endFill()
    this.container.addChild(graphics)
  }

  setPosition() {
    this.container.x = this.x
    this.container.y = this.y
  }
}
