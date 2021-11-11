import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { GroundGroup } from '../components/GroundGroup'
import { SnakePart } from '../components/SnakePart'
// import { SnakeBody } from '../components/SnakeBody'

export class SnakeScene {
  constructor() {
    this.container = new PIXI.Container()
    this.createBackground()
    this.createGameStage()

    // snake property
    this.headDirection = 'right'

    this.totalI = Math.floor(this.gameStageWidth / 10)
    this.totalJ = Math.floor(this.gameStageHeight / 10)

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

    this.snakeHead = new SnakePart({ i: 3, j: 4, id: 0 })
    const snakePart1 = new SnakePart({ i: 2, j: 4, id: 1 })

    this.snakeArray = [this.snakeHead, snakePart1]

    this.snakeArray.forEach((snakePart) => {
      this.gameStage.addChild(snakePart.sprite)
    })

    //  add keyboard listener
    this.keyboardListener = document.addEventListener('keydown', (event) => {
      const key = event.key

      switch (key) {
        case 'ArrowDown':
          this.headDirection = 'down'
          break
        case 'ArrowRight':
          this.headDirection = 'right'
          break
        case 'ArrowUp':
          this.headDirection = 'up'
          break
        case 'ArrowLeft':
          this.headDirection = 'left'
          break
      }
    })

    this.snakeMoveTicker = new PIXI.Ticker()
    this.snakeMoveTicker.add(() => {
      // body
      for (let i = this.snakeArray.length - 1; i > 0; i--) {
        const backSnakePart = this.snakeArray[i]
        const frontSnakePart = this.snakeArray[i - 1]

        backSnakePart.move()
        backSnakePart.setNextDirection(frontSnakePart.direction)
      }
      // head

      this.snakeHead.move()
      this.snakeHead.setNextDirection(this.headDirection)
      this.deadMonitor()
    })

    this.snakeMoveTicker.start()
  }

  deadMonitor() {
    // console.log('deadMonitor')

    const { i, j } = this.snakeHead.getCoordinate()

    // check if need to change direction
    if (i >= this.totalI || i <= 0 || j >= this.totalJ || j <= 0) {
      this.snakeMoveTicker.stop()
    }
  }
}
