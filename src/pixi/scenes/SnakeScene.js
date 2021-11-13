import * as PIXI from 'pixi.js'
// import _ from 'lodash'
import { Globals } from '../script/Globals'
import { GroundGroup } from '../components/GroundGroup'
import { SnakePart } from '../components/SnakePart'
// import { SnakeBody } from '../components/SnakeBody'

const BLOCK_WIDTH = 16
const INIT_SNAKE_LENGTH = 10

export class SnakeScene {
  constructor() {
    this.container = new PIXI.Container()
    this.createBackground()
    this.createGameStage()

    // snake property
    this.snakeArray = []
    this.moveDirection = ['right']

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
    const cb = (event) => {
      // if (this.moveDirection.length > 2) {
      //   return
      // }

      const key = event.key

      switch (key) {
        case 'ArrowDown':
          if (
            this.moveDirection[this.moveDirection.length - 1] === 'up' ||
            this.moveDirection[this.moveDirection.length - 1] === 'down'
            // this.snakeArray[0].direction === 'up'
          ) {
            break
          }

          this.moveDirection.push('down')
          break
        case 'ArrowRight':
          if (
            this.moveDirection[this.moveDirection.length - 1] === 'left' ||
            this.moveDirection[this.moveDirection.length - 1] === 'right'
            // this.snakeArray[0].direction === 'left'
          ) {
            break
          }

          this.moveDirection.push('right')

          break
        case 'ArrowUp':
          if (
            this.moveDirection[this.moveDirection.length - 1] === 'down' ||
            this.moveDirection[this.moveDirection.length - 1] === 'up'
            // this.snakeArray[0].direction === 'down'
          ) {
            break
          }

          this.moveDirection.push('up')

          break
        case 'ArrowLeft':
          if (
            this.moveDirection[this.moveDirection.length - 1] === 'right' ||
            this.moveDirection[this.moveDirection.length - 1] === 'left'
            // this.snakeArray[0].direction === 'right'
          ) {
            break
          }

          this.moveDirection.push('left')

          break
      }
    }

    this.keyboardListener = document.addEventListener('keydown', cb)
  }

  createSnake() {
    console.log('createSnake')

    this.gameStage.sortableChildren = true
    for (let i = 0; i < INIT_SNAKE_LENGTH; i++) {
      const snakePart = new SnakePart({
        i: INIT_SNAKE_LENGTH + 2 - i,
        j: 3,
        id: i,
      })
      snakePart.container.zIndex = INIT_SNAKE_LENGTH - 1 - i
      this.snakeArray.push(snakePart)
    }

    this.snakeArray.forEach((snakePart) => {
      this.gameStage.addChild(snakePart.container)
    })
  }

  startGame() {
    console.log('game started')

    this.snakeMoveTicker = new PIXI.Ticker()
    this.snakeMoveTicker.add(() => {
      for (let i = 0; i < this.snakeArray.length; i++) {
        const snakePart = this.snakeArray[i]
        snakePart.move()

        // only when snake is moved to grid could change direction
        if (
          snakePart.container.x % BLOCK_WIDTH !== 0 ||
          snakePart.container.y % BLOCK_WIDTH !== 0
        ) {
          continue
        }

        // head
        if (i === 0) {
          const nextHeadDirection = this.moveDirection[0]

          // remove invalid move direction
          if (snakePart.direction === getOppositeDirection(nextHeadDirection)) {
            this.moveDirection.shift()
          }

          if (this.moveDirection.length > 0) {
            // has new direction
            // backup prev direction and update direction newer
            snakePart.prevDirection = snakePart.direction
            snakePart.direction = this.moveDirection.shift()
          } else {
            // no direction
            snakePart.prevDirection = snakePart.direction
          }
        }
        //  body
        else {
          const frontSnakePart = this.snakeArray[i - 1]

          snakePart.prevDirection = snakePart.direction
          snakePart.direction = frontSnakePart.prevDirection

          snakePart.currentPosition = frontSnakePart.currentPosition
          snakePart.nextPosition = frontSnakePart.nextPosition
        }
      }
    })

    this.snakeMoveTicker.start()
  }

  deadMonitor() {}
}

function getOppositeDirection(direction) {
  switch (direction) {
    case 'right':
      return 'left'
    case 'left':
      return 'right'
    case 'up':
      return 'down'
    case 'down':
      return 'up'
  }
}
