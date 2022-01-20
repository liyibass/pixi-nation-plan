import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { DoctorIconDialogBox } from './DoctorIconDialogBox'

export class DoctorModBoxGroup {
  constructor(props) {
    this.props = props
    this.container = new PIXI.Container()

    this._createBackground()
    this.createDoctorModBoxGroup()
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

  createDoctorModBoxGroup() {
    this.shareBox = new DoctorIconDialogBox({
      ...this.props,
      clickHandler: this.clickHandler.bind(this),
      icon1Name: 'bearHead',
      icon2Name: 'tigerHead',
    })
    this.shareBox.init()
    this.container.addChild(this.shareBox.container)
  }
}

// class ShareBox extends DialogBoxNew {
//   constructor(...args) {
//     super(...args)
//     this.chosenHandler = args[0].clickHandler

//     this.init()
//   }

//   init() {
//     this.twoIcons = new TwoIcons(this.chosenHandler, 'bearHead', 'tigerHead')
//     this.container.addChild(this.twoIcons.container)
//     this.container.interactive = true
//     this.container.buttonMode = false

//     const PADDING = 15
//     this.pixiText.y = this.pixiText.height / 2 + PADDING * 2
//     this.twoIcons.container.x =
//       (this.roundRect.width - this.twoIcons.container.width) / 2
//     this.twoIcons.container.y = this.roundRect.height / 2 + PADDING * 2
//   }
// }
