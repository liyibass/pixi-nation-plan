import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { GroundGroup } from '../components/GroundGroup'
import { SnakeHead } from '../components/SnakeHead'

export class SnakeScene {
  constructor() {
    this.container = new PIXI.Container()
    this.createBackground()
    this.createGameStage()
    this.createSnakeScene()

    // snake property
    this.direction = 'right'
    this.headPosition = { x: 30, y: 30 }
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
    this.gameStageX = gameStageDimention.x
    this.gameStageY = gameStageDimention.y
    this.gameStageWidth = gameStageDimention.width
    this.gameStageHeight = gameStageDimention.height

    this.gameStage = new PIXI.Container()

    // create a color region
    const gameStageFrame = new PIXI.Graphics()
    gameStageFrame.lineStyle(4, 0xdddddd, 1)
    gameStageFrame.beginFill(0x92b79c)

    /*
     * NOTE: We use gameStageFrame(which is a Graphics) to bump up outer container
     * the drawing process down below MUST start at 0,0
     * (Graphics and drawRect is NOT in same level)
     */
    gameStageFrame.drawRect(
      -8,
      -8,
      this.gameStageWidth + 16,
      this.gameStageHeight + 16
    )
    gameStageFrame.endFill()

    // add to container
    this.gameStage.addChild(gameStageFrame)
    this.container.addChild(this.gameStage)

    // set up gameStage's position
    this.gameStage.x = this.gameStageX
    this.gameStage.y = this.gameStageY
  }

  createSnakeScene() {
    const groundGroupDimention = Globals.getGroundDimention()

    this.groundGroup = new GroundGroup(groundGroupDimention)
    this.container.addChild(this.groundGroup.container)

    // todo introduce

    // start game
    this.startGame()
  }

  startGame() {
    console.log('game started')

    this.snakeHead = new SnakeHead(this.headPosition)
    this.gameStage.addChild(this.snakeHead.sprite)

    const snakeMoveTicker = new PIXI.Ticker()
    snakeMoveTicker.add(() => {
      this.moveMonitor(this.direction)
      this.snakeHeadDirectionMonitor(this.direction)
      this.deadMonitor()
    })

    snakeMoveTicker.start()
  }
  moveMonitor(direction) {
    switch (direction) {
      case 'right':
        this.snakeHead.sprite.x += 2
        break
      case 'left':
        this.snakeHead.sprite.x -= 2
        break

      case 'up':
        this.snakeHead.sprite.y -= 2
        break
      case 'down':
        this.snakeHead.sprite.y += 2
        break

      default:
        break
    }
  }
  snakeHeadDirectionMonitor(direction) {
    switch (direction) {
      case 'right':
        this.snakeHead.sprite.angle = 90
        break
      case 'left':
        this.snakeHead.sprite.angle = -90
        break

      case 'up':
        this.snakeHead.sprite.angle = 0
        break
      case 'down':
        this.snakeHead.sprite.angle = 180
        break

      default:
        break
    }
  }

  deadMonitor() {
    if (this.snakeHead.sprite.x > this.gameStageWidth) {
      this.snakeHead.sprite.x = this.gameStageWidth - 1
      this.direction = 'down'
    } else if (this.snakeHead.sprite.x < 0) {
      this.snakeHead.sprite.x = 0 + 1
      this.direction = 'up'
    } else if (this.snakeHead.sprite.y > this.gameStageHeight) {
      this.snakeHead.sprite.y = this.gameStageHeight - 1
      this.direction = 'left'
    } else if (this.snakeHead.sprite.y < 0) {
      this.snakeHead.sprite.y = 0 + 1

      this.direction = 'right'
    }
  }
}
