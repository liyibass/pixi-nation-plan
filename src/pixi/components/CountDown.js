import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class CountDown {
  constructor(countNumber) {
    this.container = new PIXI.Container()
    this.countNumber = countNumber
    this.init()
  }
  init() {
    const mask = new PIXI.Graphics()
    mask.beginFill(0x000000)
    mask.drawRect(0, 0, Globals.width, Globals.height)
    mask.endFill()
    mask.alpha = 0.6

    this.count = new PIXI.Text(this.countNumber, {
      align: 'center', // 對齊
      fontSize: 100,
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: this.width - 20,
      fill: ['0xffffff'],
    })

    this.container.addChild(mask, this.count)

    this.count.x = (this.container.width - this.count.width) / 2
    this.count.y = (this.container.height - this.count.height) / 2
  }

  start() {
    return new Promise((resolve) => {
      const _countDown = setInterval(() => {
        if (this.countNumber > 1) {
          this.countNumber--

          this.count.text = this.countNumber
        } else {
          // this.container.removeChild(countContainer)
          clearInterval(_countDown)
          resolve(true)
        }
      }, 800)
    })
  }
}
