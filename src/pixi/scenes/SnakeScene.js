import * as PIXI from 'pixi.js'
// import _ from 'lodash'
import { Globals } from '../script/Globals'
import { GroundGroup } from '../components/GroundGroup'
import { SnakePart } from '../components/SnakePart'
import { SnakeFood } from '../components/SnakeFood'
// import { SnakeBody } from '../components/SnakeBody'

const BLOCK_WIDTH = 16
const INIT_SNAKE_LENGTH = 5
const INIT_FOOD_COUNT = 5

export class SnakeScene {
  constructor() {
    this.container = new PIXI.Container()
    this.createSnakeScene()

    this.totalI = Math.floor(this.gameStageWidth / BLOCK_WIDTH)
    this.totalJ = Math.floor(this.gameStageHeight / BLOCK_WIDTH)

    // snake property
    this.snakeArray = []
    this.moveDirection = ['right']

    // food property
    this.snakeFoodArray = []

    this.initGame()
  }

  createBackground() {
    const bg = new PIXI.Graphics()
    // bg.lineStyle(4, 0x00000, 1)
    bg.beginFill(0x92b79c)
    bg.drawRect(0, 0, Globals.width, Globals.height)
    bg.endFill()

    this.container.addChild(bg)
  }

  createItems() {
    const groundGroupDimention = Globals.getGroundDimention()

    this.groundGroup = new GroundGroup(groundGroupDimention)
    this.container.addChild(this.groundGroup.container)
  }

  createGameStage() {
    // get gameStage dimention
    const gameStageDimention = Globals.getGameStageDimention()

    this.gameStageX = gameStageDimention.x
    this.gameStageY = gameStageDimention.y
    this.gameStageWidth = gameStageDimention.width
    this.gameStageHeight = gameStageDimention.height
    this.totalI = Math.floor(this.gameStageWidth / BLOCK_WIDTH)
    this.totalJ = Math.floor(this.gameStageHeight / BLOCK_WIDTH)

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

  createChessBoard() {
    for (let j = 0; j < this.totalJ; j++) {
      for (let i = 0; i < this.totalI; i++) {
        const block = new PIXI.Graphics()
        block.beginFill((i + j) % 2 === 0 ? 0xf1c6aa : 0x928176)
        block.drawRect(0, 0, BLOCK_WIDTH, BLOCK_WIDTH)
        block.endFill()
        block.x = i * BLOCK_WIDTH
        block.y = j * BLOCK_WIDTH
        block.alpha = 0.4
        this.gameStage.addChild(block)
      }
    }
  }

  createSnakeScene() {
    this.createBackground()
    this.createItems()
    this.createGameStage()
    // this.createChessBoard()

    // todo introduce
  }

  initGame() {
    this.createKeyboardListener()
    this.createSnake()
    this.createFood()
    this.startGame()
  }

  createKeyboardListener() {
    //  add keyboard listener
    this.keyboardListenerCallBack = (event) => {
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

    document.addEventListener('keydown', this.keyboardListenerCallBack)
  }

  createSnake() {
    console.log('createSnake')
    this.snakeGroup = new PIXI.Container()

    this.snakeGroup.sortableChildren = true
    for (let i = 0; i < INIT_SNAKE_LENGTH; i++) {
      const initI = 5 - i
      const initJ = 3
      const initDirection = 'right'
      const initColor = `0x${Math.floor(Math.random() * 100000)}`

      const snakePart = new SnakePart(initI, initJ, initDirection, i, initColor)
      snakePart.container.zIndex = INIT_SNAKE_LENGTH - 1 - i
      this.snakeArray.push(snakePart)
    }

    this.snakeArray.forEach((snakePart) => {
      this.snakeGroup.addChild(snakePart.container)
    })

    this.gameStage.addChild(this.snakeGroup)
  }

  createFood() {
    if (this.snakeFoodArray.length > 0) return

    this.snakeFoodGroup = new PIXI.Container()

    for (let id = 0; id < INIT_FOOD_COUNT; id++) {
      const { i, j } = this.getRandomFoodPosition.bind(this)()
      const snakeFood = new SnakeFood(id, i, j)

      this.snakeFoodArray.push(snakeFood)
    }

    for (let i = 0; i < this.snakeFoodArray.length; i++) {
      this.snakeFoodGroup.addChild(this.snakeFoodArray[i].container)
    }
    this.gameStage.addChild(this.snakeFoodGroup)
  }

  getRandomFoodPosition() {
    const randomI = Math.floor(Math.random() * (this.totalI - 1))
    const randomJ = Math.floor(Math.random() * (this.totalJ - 1))
    return {
      i: randomI,
      j: randomJ,
    }
  }

  eatingFoodHandler() {
    const { i: headI, j: headJ } = this.snakeArray[0]

    let eatenFoodIndex = -1
    for (let x = 0; x < this.snakeFoodArray.length; x++) {
      const { i: foodI, j: foodJ } = this.snakeFoodArray[x]
      // console.log(`${i},${j}`)
      if (foodI === headI && foodJ === headJ) {
        console.log('EAT')
        eatenFoodIndex = x
        break
      }
    }
    if (eatenFoodIndex >= 0) {
      // remove eaten food
      const removedFood = this.snakeFoodArray.splice(eatenFoodIndex, 1)
      this.snakeFoodGroup.removeChild(removedFood[0]?.container)
      eatenFoodIndex = -1

      // create new snakePart and add behind tail
      const snakeTail = this.snakeArray[this.snakeArray.length - 1]

      const { i, j, direction, index } = getInitSnakePartData(snakeTail)
      const newSnakePart = new SnakePart(
        i,
        j,
        direction,
        index,
        removedFood[0].color
      )

      this.snakeGroup.addChild(newSnakePart.container)
      this.snakeArray.push(newSnakePart)

      // add new food
      if (this.snakeFoodArray.length < INIT_FOOD_COUNT) {
        const { i, j } = this.getRandomFoodPosition.bind(this)()
        const newSnakeFood = new SnakeFood(eatenFoodIndex, i, j)
        this.snakeFoodArray.push(newSnakeFood)
        this.snakeFoodGroup.addChild(newSnakeFood.container)
      }
    }
  }

  startGame() {
    console.log('game started')

    this.snakeMoveTicker = new PIXI.Ticker()
    this.snakeMoveTicker.add(async () => {
      // const snakeHead = this.snakeArray[0].currentPosition
      // console.log(`${snakeHead.i},${snakeHead.j}`)

      for (let i = 0; i < this.snakeArray.length; i++) {
        const snakePart = this.snakeArray[i]
        const frontSnakePart = this.snakeArray[i - 1]
        await snakePart.move()

        // handle eating food
        this.eatingFoodHandler()

        // only when snake is moved to grid could change direction
        if (
          snakePart.container.x % BLOCK_WIDTH !== 0 ||
          snakePart.container.y % BLOCK_WIDTH !== 0
        ) {
          continue
        } else {
          // head
          if (i === 0) {
            const nextHeadDirection = this.moveDirection[0]

            // remove invalid move direction
            if (
              snakePart.direction === getOppositeDirection(nextHeadDirection)
            ) {
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
            snakePart.prevDirection = snakePart.direction
            snakePart.direction = frontSnakePart.prevDirection
          }
        }
      }

      this.deadMonitor()
    })

    this.snakeMoveTicker.start()
  }

  deadMonitor() {
    const { i, j } = this.snakeArray[0]
    // console.log(`${i},${j}`)
    // console.log(`${this.totalI},${this.totalJ}`)
    if (i < 0 || j < 0 || i > this.totalI - 1 || j > this.totalJ - 1) {
      this.gameOver()
    }
  }

  gameOver() {
    this.snakeMoveTicker.destroy()
    window.removeEventListener('keydown', this.keyboardListener)

    this.snakeArray = []
    this.moveDirection = []

    setTimeout(() => {
      this.snakeGroup.destroy()
      this.initGame()
    }, 1000)
  }
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

function getInitSnakePartData(prevSnakePart) {
  switch (prevSnakePart.direction) {
    case 'right':
      return {
        i: prevSnakePart.i - 1,
        j: prevSnakePart.j,
        direct: 'right',
        index: prevSnakePart.id + 1,
      }
    case 'left':
      return {
        i: prevSnakePart.i + 1,
        j: prevSnakePart.j,
        direct: 'left',
        index: prevSnakePart.id + 1,
      }
    case 'up':
      return {
        i: prevSnakePart.i,
        j: prevSnakePart.j + 1,
        direct: 'up',
        index: prevSnakePart.id + 1,
      }
    case 'down':
      return {
        i: prevSnakePart.i,
        j: prevSnakePart.j - 1,
        direct: 'down',
        index: prevSnakePart.id + 1,
      }

    default:
      return {
        i: prevSnakePart.i,
        j: prevSnakePart.j + 1,
        direct: 'up',
        index: prevSnakePart.id + 1,
      }
  }
}
