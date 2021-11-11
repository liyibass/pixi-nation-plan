import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { GroundGroup } from '../components/GroundGroup'

export class SnakeScene {
  constructor() {
    this.container = new PIXI.Container()
    this.createBackground()
    this.createGameStage()
    this.createSnakeScene()
  }

  createBackground() {
    const bg = new PIXI.Graphics()
    bg.lineStyle(4, 0x00000, 1)
    bg.beginFill(0x92b79c)
    bg.drawRect(0, 0, Globals.width, Globals.height)
    bg.endFill()

    this.container.addChild(bg)
  }

  createGameStage() {
    // get gameStage dimention
    const gameStageDimention = Globals.getGameStageDimention()

    this.gameStage = new PIXI.Container()

    // create a color region
    const gameStageFrame = new PIXI.Graphics()
    gameStageFrame.lineStyle(4, 0xdddddd, 1)
    gameStageFrame.beginFill(0x92b79c)
    gameStageFrame.drawRect(
      gameStageDimention.x,
      gameStageDimention.y,
      gameStageDimention.width,
      gameStageDimention.height
    )
    gameStageFrame.endFill()

    // add to container
    this.gameStage.addChild(gameStageFrame)
    this.container.addChild(this.gameStage)
  }

  createSnakeScene() {
    const groundGroupDimention = Globals.getGroundDimention()

    this.groundGroup = new GroundGroup(groundGroupDimention)
    this.container.addChild(this.groundGroup.container)

    // todo introduce

    this.startGame()
  }

  startGame() {
    console.log('game started')

    Globals.app.ticker.add(() => {})
  }
}
