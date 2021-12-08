// import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
// import { TwoButtons } from './TwoButtons'
import { Stop } from './Stop'

export class PauseGame extends Stop {
  constructor(chooseHandler, button1Setting, button2Setting) {
    super(chooseHandler, button1Setting, button2Setting)
    this.init()
  }

  init() {
    this.createMask()
    this.createTwoButtons()
    this.container.name = 'PauseGame'
  }
}
