import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { DialogBox } from './DialogBox'
import { TwoIcons } from './TwoIcons'

export class DoctorShareBox {
  constructor(props) {
    this.props = props
    this.container = new PIXI.Container()

    this._createBackground()
    this.createDoctorShareBox()
  }

  clickHandler(chosen) {
    this.shareBox.twoIcons.destoryTwoIcons()
    this.props.chosenHandler(chosen)
  }

  _createBackground() {
    const bg = new PIXI.Graphics()
    bg.beginFill(0x000000)
    bg.drawRect(0, 0, Globals.width, Globals.height)
    bg.endFill()
    bg.alpha = 0.7

    bg.buttonMode = true
    bg.interactive = true

    bg.addListener('pointerdown', () => {
      this.shareBox.twoIcons.destoryTwoIcons()
      this.props.chosenHandler('cancel')
    })

    this.container.addChild(bg)
  }

  createDoctorShareBox() {
    this.shareBox = new ShareBox({
      ...this.props,
      clickHandler: this.clickHandler.bind(this),
    })
    this.container.addChild(this.shareBox.container)
  }
}

class ShareBox extends DialogBox {
  constructor(...args) {
    super(...args)
    this.chosenHandler = args[0].clickHandler

    this.init()
  }

  init() {
    this.twoIcons = new TwoIcons(this.chosenHandler, 'facebook', 'line')
    this.container.addChild(this.twoIcons.container)
    this.container.interactive = true
    this.container.buttonMode = false

    const PADDING = 15
    this.pixiText.y = this.pixiText.height / 2 + PADDING
    this.twoIcons.container.x =
      (this.roundRect.width - this.twoIcons.container.width) / 2
    this.twoIcons.container.y =
      this.roundRect.height - this.twoIcons.container.height - 12
  }
}
