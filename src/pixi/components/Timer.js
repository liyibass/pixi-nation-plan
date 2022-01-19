import * as PIXI from 'pixi.js'
const TIMER_WIDTH = 69
const TOP_PADDING = 31
const TIMER_RADIUS = 22
export class Timer {
  constructor(time = 120) {
    this.container = new PIXI.Container()
    this.container.name = 'timer'

    this.time = time
    this._createBackground()
    this.createTimerText()
    this.position()
  }

  _createBackground() {
    this.timerBg = new PIXI.Graphics()
    this.timerBg.beginFill(0xffffff)
    this.timerBg.drawCircle(TIMER_RADIUS, TIMER_RADIUS, TIMER_RADIUS)
    this.timerBg.endFill()

    this.container.addChild(this.timerBg)
  }

  createTimerText() {
    this.timerText = new PIXI.Text(`${this.time}`, {
      fill: ['0x000000'],
      fontSize: 16,
    })

    this.container.addChild(this.timerText)

    this.timerText.x = (this.timerBg.width - this.timerText.width) / 2
    this.timerText.y = (this.timerBg.height - this.timerText.height) / 2
  }

  position() {
    this.container.x = (TIMER_WIDTH - this.container.width) / 2 + 4
    this.container.y = TOP_PADDING + 10
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.time--
      this.timerText.text = this.time

      this.timerText.x = (this.timerBg.width - this.timerText.width) / 2
    }, 1000)
  }

  stopTimer() {
    clearInterval(this.timerInterval)
  }
}
