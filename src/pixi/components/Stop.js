import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { TwoButtons } from './TwoButtons'

export class Stop {
  constructor(
    chooseHandler = () => {},
    button1Setting = {
      text: '繼續',
      color: 0xffffff,
      bgColor: '0x3B6BD6',
      value: 'resume',
    },
    button2Setting
  ) {
    this.container = new PIXI.Container()
    this.button1Setting = button1Setting
    this.button2Setting = button2Setting
    this.chooseHandler = chooseHandler
  }

  createMask(alpha = 0.6) {
    const mask = new PIXI.Graphics()
    mask.beginFill(0x000000)
    mask.drawRect(0, 0, Globals.width, Globals.height)
    mask.endFill()
    mask.alpha = alpha
    this.container.addChild(mask)
    mask.interactive = true
  }

  createTwoButtons() {
    this.TwoButtons = new TwoButtons(
      this.chooseHandler,
      this.button1Setting,
      this.button2Setting
    )

    this.container.addChild(this.TwoButtons.container)

    const menuPosition = Globals.getSnakeMenuPosition(
      this.button2Setting ? 2 : 1
    )
    this.TwoButtons.container.x = menuPosition.x
    this.TwoButtons.container.y = menuPosition.y
  }

  wait(delayTime) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, delayTime)
    })
  }
}
