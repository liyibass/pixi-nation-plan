import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { DoctorShareBox } from './DoctorShareBox'

export class DoctorShareBoxGroup {
  constructor(props) {
    this.props = props
    this.container = new PIXI.Container()

    this._createBackground()
    this.createDoctorShareBoxGroup()
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
    bg.alpha = 0

    bg.buttonMode = true
    bg.interactive = true

    bg.addListener('pointerdown', () => {
      this.shareBox.twoIcons.destoryTwoIcons()
      this.props.chosenHandler('cancel')
    })

    this.container.addChild(bg)
  }

  createDoctorShareBoxGroup() {
    this.shareBox = new DoctorShareBox({
      ...this.props,
      clickHandler: this.clickHandler.bind(this),
    })
    this.shareBox.init()
    this.container.addChild(this.shareBox.container)
  }
}
