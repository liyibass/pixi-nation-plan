import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class SeesawBoard {
  constructor() {
    this.container = new PIXI.Container()
    this.createBoard()
  }

  createBoard() {
    const { width } = Globals.getSeesawGameStageDimention()

    const colorBarLength = Math.floor(width / 9)

    for (let i = 0; i < 9; i++) {
      const colorBar = new PIXI.Graphics()
      const filledColot = i === 4 ? 0x9e523e : i % 2 === 0 ? 0x3b6bd5 : 0x0e427f
      colorBar.beginFill(filledColot)

      colorBar.drawRect(0, 0, colorBarLength, 7)
      colorBar.endFill()

      colorBar.x = i * colorBarLength
      this.container.addChild(colorBar)
    }
  }
}
