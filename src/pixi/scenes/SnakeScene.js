import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { GroundGroup } from '../components/GroundGroup'
import { SnakePart } from '../components/SnakePart'
// import { SnakeBody } from '../components/SnakeBody'

const BLOCK_WIDTH = 16

export class SnakeScene {
  constructor() {
    this.container = new PIXI.Container()
    this.createBackground()
    this.createGameStage()

    // snake property
    this.headDirection = 'right'

    this.totalI = Math.floor(this.gameStageWidth / BLOCK_WIDTH)
    this.totalJ = Math.floor(this.gameStageHeight / BLOCK_WIDTH)

    this.createSnakeScene()
  }

  createBackground() {
    const bg = new PIXI.Graphics()
    // bg.lineStyle(4, 0x00000, 1)
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
    const frameLineWeight = 4
    gameStageFrame.lineStyle(frameLineWeight, 0xdddddd, 0.6)
    gameStageFrame.beginFill(0x92b79c)

    /*
     * NOTE: We use gameStageFrame(which is a Graphics) to bump up outer container
     * the drawing process down below MUST start at 0,0
     * (Graphics and drawRect is NOT in same level)
     */
    gameStageFrame.drawRect(
      -frameLineWeight,
      -frameLineWeight,
      this.gameStageWidth + frameLineWeight * 2,
      this.gameStageHeight + frameLineWeight * 2
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

    this.createKeyboardListener()
    this.createSnake()
    this.startGame()
  }

  createKeyboardListener() {
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
  }

  createSnake() {
    console.log('createSnake')

    const snakePart = new SnakePart({ i: 0, j: 0, id: 0 })
    this.snakeArray = [snakePart]

    this.snakeArray.forEach((snakePart) => {
      this.gameStage.addChild(snakePart.container)
      console.log(snakePart)
    })
  }

  startGame() {
    console.log('game started')

    this.snakeMoveTicker = new PIXI.Ticker()
    this.snakeMoveTicker.add(() => {
      this.snakeArray.forEach((snakePart) => {
        // console.log(snakePart.container.x % 10)
        // console.log(snakePart.container.y % 10)
        snakePart.move()
        if (snakePart.container.x % BLOCK_WIDTH === 0) {
          console.log('CHANGE DIRECTION')
        }
      })
    })

    // this.snakeMoveTicker.start()
  }

  deadMonitor() {}
}
