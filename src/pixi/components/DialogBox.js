import * as PIXI from 'pixi.js'

export class DialogBox {
  constructor({
    x = 0,
    y = 0,
    talkerX = 30,
    talkerY = 30,
    width = 100,
    height = 40,
    text = '',
  }) {
    this.container = new PIXI.Container()
    this.x = x
    this.y = y
    this.talkerX = talkerX
    this.talkerY = talkerY
    this.width = width
    this.height = height
    this.text = text

    this.createDialogBox()
    this.createText()
    this.createSpin()
    this.setPosition()
  }

  createDialogBox() {
    const roundRect = new PIXI.Graphics()

    roundRect.beginFill(0xeeeeee)
    roundRect.drawRoundedRect(0, 0, this.width, this.height, 15)
    roundRect.endFill()

    this.container.addChild(roundRect)
  }

  createText() {
    const text = new PIXI.Text(this.text, {
      align: 'center', // 對齊
    })
    this.container.addChild(text)

    text.position.x = this.container.width / 2
    text.position.y = this.container.height / 2
    text.anchor.set(0.5, 0.5)
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
      this.width / 2 - -3,
      this.height,
      this.talkerX > this.x ? spinX - TALKER_WIDTH : spinX + TALKER_WIDTH,
      spinY - TALKER_HEIGHT,
      this.width / 2 - +3,
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
