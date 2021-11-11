import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
import { SnakeHead } from '../components/SnakeHead'

export class SnakeGroup {
  constructor(
    position = { x: 0, y: 0 },
    gameStageDimention = {
      gameStageWidth: 200,
      gameStageHeight: 200,
    }
  ) {
    this.container = new PIXI.Container()
    this.headPosition = position
    this.gameStageWidth = gameStageDimention.gameStageWidth
    this.gameStageHeight = gameStageDimention.gameStageHeight

    this.createSnakeBody()
  }

  createSnakeBody() {
    this.snakeHead = new SnakeHead(this.headPosition)
    // this.snakeHead.sprite.toLocal(0.0)
    this.container.addChild(this.snakeHead.sprite)
  }
}
