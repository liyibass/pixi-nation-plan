import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'

import { SeesawPivot } from '../components/SeesawPivot'
import { SeesawBoard } from '../components/SeesawBoard'

export class SeesawGroup {
  constructor() {
    this.container = new PIXI.Container()
    this.container.name = 'seesawGroup'
    this.createSeesaw()
    this.setPosition()
  }

  createSeesaw() {
    this.board = new SeesawBoard()
    this.board.container.x = this.board.width / 2

    this.pivot = new SeesawPivot()
    this.pivot.container.x = this.board.container.width / 2

    this.container.addChild(this.board.container, this.pivot.container)

    // const frame = new PIXI.Graphics()
    // // frame.beginFill(0xaaaaaa, 0.1)
    // frame.beginFill(0xffffff)
    // frame.drawRect(0, 0, this.container.width, this.container.height)
    // frame.endFill()
    // this.container.addChild(frame)
  }

  setPosition() {
    this.container.pivot.x = this.container.width / 2
    // this.container.pivot.y = 0
    this.container.pivot.y = this.pivot.container.height
  }
}
