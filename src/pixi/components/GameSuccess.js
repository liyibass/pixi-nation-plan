// import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
// import { TwoButtons } from './TwoButtons'
import { Stop } from './Stop'

export class GameSuccess extends Stop {
  constructor() {
    super()
    this.init()
  }

  init() {
    this.createMask()
    this.createTwoButtons()
  }
}
