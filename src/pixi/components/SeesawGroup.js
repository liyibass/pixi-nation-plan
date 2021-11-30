import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'

import { SeesawPivot } from '../components/SeesawPivot'
import { SeesawBoard } from '../components/SeesawBoard'

export class SeesawGroup {
  constructor() {
    this.container = new PIXI.Container()
    this.createSeesaw()
  }

  createSeesaw() {
    const pivot = new SeesawPivot()
    this.container.addChild(pivot.container)
    const board = new SeesawBoard()
    this.container.addChild(board.container)

    pivot.container.x = (board.container.width - pivot.container.width) / 2
  }
}
