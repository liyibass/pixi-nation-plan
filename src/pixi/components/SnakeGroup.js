import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
import { SnakeHead } from '../components/SnakeHead'

export class SnakeGroup {
  constructor(position = { x: 0, y: 0 }) {
    this.container = new PIXI.Container()
    this.headPosition = position

    this.createSnakeBody()
  }

  createSnakeBody() {
    this.snakeHead = new SnakeHead(this.headPosition)
    this.container.addChild(this.snakeHead.sprite)
  }
}
