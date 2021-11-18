import * as PIXI from 'pixi.js'
// import _ from 'lodash'
import { Globals } from '../script/Globals'
import { GroundGroup } from '../components/GroundGroup'
import { SnakePart } from '../components/SnakePart'
import { SnakeFood } from '../components/SnakeFood'
import { SnakePoison } from '../components/SnakePoison'
import { SnakeController } from '../components/SnakeController'
import { DoctorSay } from '../components/DoctorSay'
import { CountDown } from '../components/CountDown'
import { TwoButtons } from '../components/TwoButtons'
import { PauseGame } from '../components/PauseGame'
// import { SnakeBody } from '../components/SnakeBody'

const BLOCK_WIDTH = 16
const INIT_SNAKE_LENGTH = 4
const INIT_FOOD_COUNT = 4
const INIT_POISON_COUNT = 3
let easterEggString = ''

export class SnakeScene {
  constructor() {
    this.container = new PIXI.Container()
    this.createSnakeScene()

    this.totalI = Math.floor(this.gameStageWidth / BLOCK_WIDTH)
    this.totalJ = Math.floor(this.gameStageHeight / BLOCK_WIDTH)
    Globals.snakeTotalI = this.totalI
    Globals.snakeTotalJ = this.totalJ

    // snake property
    this.snakeArray = []
    this.moveDirection = ['right']
    this.newBodyQueue = []

    // food property
    this.snakeFoodArray = []
    this.snakePoisionArray = []

    this.initGame()
    this.startGameFlow()
  }
  // ===== init game =====
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

  createSnakeController() {
    const controller = new SnakeController(Globals.getSnakeControllerPosition())
    this.container.addChild(controller.container)
  }

  createSnakeScene() {
    this.createBackground()
    this.createItems()
    this.createGameStage()
    this.createSnakeController()

    // this.createChessBoard()

    // todo introduce
  }

  initGame() {
    this.createKeyboardListener()
    this.createSnake()
    this.createFood()
    this.createPosition()
  }

  // ===== snake =====
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

        case 'r':
          if (easterEggString === '' || easterEggString === 'read') {
            easterEggString += 'r'
          }
          break

        case 'e':
          if (easterEggString === 'r') {
            easterEggString += 'e'
          }
          break

        case 'a':
          if (easterEggString === 're') {
            easterEggString += 'a'
          }
          break

        case 'd':
          if (easterEggString === 'rea') {
            easterEggString += 'd'
          }
          break
      }
    }

    document.addEventListener('keydown', this.keyboardListenerCallBack)
  }

  createSnake() {
    console.log('createSnake')
    this.snakeGroup = new PIXI.Container()

    // create snake head
    const initI = 5
    const initJ = 5
    const initDirection = 'right'
    const initColor = `0xdddddd`
    const snakeHead = new SnakePart(initI, initJ, initDirection, 0, initColor)
    this.snakeArray.push(snakeHead)

    // create rest body
    this.snakeGroup.sortableChildren = true
    for (let x = 1; x < INIT_SNAKE_LENGTH; x++) {
      const initSnakePartData = getInitSnakePartData(
        this.snakeArray[this.snakeArray.length - 1]
      )
      if (!initSnakePartData) return

      const { i, j, direction, id } = initSnakePartData

      const snakePart = new SnakePart(i, j, direction, id, undefined)
      snakePart.container.zIndex = INIT_SNAKE_LENGTH - 1 - i
      this.snakeArray.push(snakePart)
    }

    this.snakeArray.forEach((snakePart) => {
      this.snakeGroup.addChild(snakePart.container)
    })

    this.gameStage.addChild(this.snakeGroup)
  }

  // ===== food =====
  createFood() {
    this.snakeFoodGroup = new PIXI.Container()

    for (let id = 0; id < INIT_FOOD_COUNT; id++) {
      const { i, j } = getRandomFoodPosition.bind(this)()
      const snakeFood = new SnakeFood(id, i, j)

      this.snakeFoodArray.push(snakeFood)
      this.snakeFoodGroup.addChild(snakeFood.container)
    }

    this.gameStage.addChild(this.snakeFoodGroup)

    // this.foodInterval = setInterval(() => {
    //   if (this.snakeFoodArray.length < INIT_FOOD_COUNT) {
    //     console.log('create')
    //   }
    // }, 5000)
  }

  createPosition() {
    this.poisonInterval = setInterval(() => {
      if (this.snakePoisionArray.length < INIT_POISON_COUNT) {
        const { i, j } = getRandomFoodPosition.bind(this)(true)
        const snakePoison = new SnakePoison(0, i, j)

        this.snakePoisionArray.push(snakePoison)
        this.snakeFoodGroup.addChild(snakePoison.container)
      }
    }, 15000)
  }

  async eatingFoodHandler() {
    const { i: headI, j: headJ } = this.snakeArray[0].getPosition()
    // console.log(`${headI},${headJ}`)
    // find out whether a food is been eaten
    let eatenFoodIndex = -1
    for (let x = 0; x < this.snakeFoodArray.length; x++) {
      const { i: foodI, j: foodJ, type: foodType } = this.snakeFoodArray[x]

      // console.log(`${i},${j}`)
      if (
        foodI === headI &&
        foodJ === headJ
        // foodType !== 'fauset' &&
        // foodType !== 'incinerator'
      ) {
        console.log('EAT')
        console.log(foodType)
        eatenFoodIndex = x
        break
      }
    }

    // if so, record it food id, and do following process
    if (eatenFoodIndex >= 0) {
      // get eatenFood data(and remove it from snakeFoodArray)
      const removedFood = this.snakeFoodArray.splice(eatenFoodIndex, 1)?.[0]
      this.eatFood(removedFood)
      eatenFoodIndex = -1
    }
  }

  async eatFood(removedFood) {
    // remove eaten food from container
    this.snakeFoodGroup.removeChild(removedFood.container)

    // add snakeBody
    await this.createNewBodyWithFood(removedFood)

    // add new food
    setTimeout(() => {
      if (this.snakeFoodArray.length < INIT_FOOD_COUNT) {
        const { i, j } = getRandomFoodPosition.bind(this)()
        const newSnakeFood = new SnakeFood(removedFood.id, i, j)
        this.snakeFoodArray.push(newSnakeFood)
        this.snakeFoodGroup.addChild(newSnakeFood.container)
      }
    }, Math.floor(Math.random() * 5000))
  }

  async createNewBodyWithFood(removedFood) {
    console.log('createNewBody start')

    // create new snakePart and add behind tail
    const snakeTail = this.snakeArray[this.snakeArray.length - 1]

    // recorrect position
    const initSnakePartData = getInitSnakePartData(snakeTail)
    if (!initSnakePartData) return

    const { i, j, direction, id, x, y } = initSnakePartData
    const newSnakePart = new SnakePart(
      i,
      j,
      direction,
      id,
      getNewBodyColor.bind(this)(removedFood)
    )

    this.snakeArray.push(newSnakePart)
    this.snakeGroup.addChild(newSnakePart.container)
    newSnakePart.container.x = x
    newSnakePart.container.y = y

    function getNewBodyColor(food) {
      switch (food?.type) {
        case 'garbage':
          return this.snakeArray.length % 2 === 0 ? '0x9f523e' : '0xcc8053'
        case 'water':
          return this.snakeArray.length % 2 === 0 ? '0x464f7c' : '0x6e90ba'

        case 'incinerator':
          return '0x000000'
        case 'fauset':
          return '0x000000'

        default:
          return `0x${Math.floor(Math.random() * 999999)}`
      }
    }
  }

  async startGameFlowOld() {
    console.log('startGameFlow')
    await wait(500)

    const doctorSay = new DoctorSay()
    this.container.addChild(doctorSay.container)

    await doctorSay.newSay('經營村莊的不二法門，就是別讓村民不開心')
    await doctorSay.newSay(
      '但村子久了總是會出現一些狀況，像是垃圾變多、公共設備損壞'
    )
    await doctorSay.newSay('你的任務就是要幫我解決問題')
    const chosen = await doctorSay.chooseSay(
      '既然你先選了臺東縣，這裡最大的困境就是垃圾太多了，準備好幫我排除障礙了嗎？',
      this.chosenHandler
    )

    if (chosen === 'play') {
      await doctorSay.newSay('遊戲目標：把場上的焚化爐全都圍起來消滅掉')
      await doctorSay.newSay(
        '村裡人越來越多，垃圾量就增加得很快，可是村民又不想蓋焚化爐，你幫我把垃圾變不見！'
      )
      await doctorSay.newSay('處理的方式很簡單，你就把垃圾吃掉就好。')
      this.startGame()
    } else {
      await doctorSay.newSay('靠')
    }
  }

  async startGameFlow() {
    this.startGame()
  }

  // ===== start game =====
  async startGame() {
    console.log('game started')
    await this.countDownHandler(3)

    this.snakeMoveTicker = new PIXI.Ticker()
    this.snakeMoveTicker.add(async () => {
      for (let i = 0; i < this.snakeArray.length; i++) {
        const snakePart = this.snakeArray[i]
        const frontSnakePart = this.snakeArray[i - 1]
        await snakePart.move()

        // only when snake is moved to grid could change direction
        if (
          snakePart.container.x % BLOCK_WIDTH !== 0 ||
          snakePart.container.y % BLOCK_WIDTH !== 0
        ) {
          continue
        } else {
          // head
          if (i === 0) {
            // remove invalid move direction
            const nextHeadDirection = this.moveDirection[0]
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

      // handle eating food
      await this.eatingFoodHandler()

      this.circleMonitor()

      // handle if dead
      this.deadMonitor()
    })

    this.snakeMoveTicker.start()
  }

  circleMonitor() {
    const snakeHead = this.snakeArray[0]

    let isCircle = false
    for (let i = 1; i < this.snakeArray.length; i++) {
      const snakePart = this.snakeArray[i]

      if (snakeHead.i === snakePart.i && snakeHead.j === snakePart.j) {
        isCircle = true
      }
    }

    if (isCircle) {
      let leftBound = snakeHead.i
      let rightBound = snakeHead.i
      let upBound = snakeHead.j
      let downBound = snakeHead.j

      for (let i = 1; i < this.snakeArray.length; i++) {
        const snakePart = this.snakeArray[i]

        if (snakePart.i < leftBound) leftBound = snakePart.i
        if (snakePart.i > rightBound) rightBound = snakePart.i
        if (snakePart.j < upBound) upBound = snakePart.j
        if (snakePart.j > downBound) downBound = snakePart.j
      }
    }
  }

  deadMonitor() {
    const { i, j } = this.snakeArray[0].getPosition()

    const notFoodArray = this.snakeFoodArray.filter((food) => {
      return food.type === 'incinerator' || food.type === 'fauset'
    })
    if (notFoodArray.length) {
      notFoodArray.forEach((notFood) => {
        const { i: I, j: J, type: foodType } = notFood
        switch (foodType) {
          case 'incinerator':
            if (i >= I && i <= I + 2 && j >= J && j <= J + 2) {
              this.gameOver()
            }
            break
          case 'fauset':
            if (i >= I && i <= I + 1 && j === J) {
              this.gameOver()
            }
            break
        }
      })
    }

    // console.log(`${i},${j}`)
    // console.log(`${this.totalI},${this.totalJ}`)
    if (i < 0 || j < 0 || i > this.totalI - 1 || j > this.totalJ - 1) {
      if (easterEggString !== 'readr') {
        this.gameOver()
      } else {
        this.easterEggMode()
      }
    }
  }

  createMenuButtons() {
    const menuPosition = Globals.getSnakeMenuPosition()

    this.menuButtons = new TwoButtons(
      menuChosenHandler.bind(this),
      { text: '暫停', color: 0xffffff, bgColor: '0xAD4B64', value: 'pause' },
      { text: '回主畫面', color: 0x000000, bgColor: '0xC4C4C4', value: 'menu' }
    )
    this.container.addChild(this.menuButtons.container)

    this.menuButtons.container.x = menuPosition.x
    this.menuButtons.container.y = menuPosition.y

    function menuChosenHandler(chosen) {
      switch (chosen) {
        case 'pause':
          this.pauseGame()
          break

        default:
          break
      }
    }
  }

  async countDownHandler(countNumber) {
    const countContainer = new CountDown(countNumber)
    this.container.addChild(countContainer.container)

    const isDone = await countContainer.start()

    if (isDone) {
      this.container.removeChild(countContainer.container)
      this.createMenuButtons()
    }
  }

  pauseGame() {
    console.log('pause game')
    this.snakeMoveTicker.stop()
    this.container.removeChild(this.menuButtons.container)

    const pauseMenuButtons = new TwoButtons(
      pauseGameChooseHandler.bind(this),
      { text: '繼續', color: 0xffffff, bgColor: '0x3B6BD6', value: 'resume' },
      { text: '回主畫面', color: 0x000000, bgColor: '0xC4C4C4', value: 'menu' }
    )

    const pauseGame = new PauseGame(pauseMenuButtons)

    this.container.addChild(pauseGame.container)

    function pauseGameChooseHandler(chosen) {
      switch (chosen) {
        case 'resume':
          this.container.removeChild(pauseGame.container)
          this.resumeGame()
          break

        default:
          break
      }
    }
  }

  async resumeGame() {
    console.log('resume game')
    await this.countDownHandler(3)

    this.snakeMoveTicker.start()
  }

  async gameOver() {
    this.snakeMoveTicker.destroy()
    this.container.removeChild(this.menuButtons.container)
    window.removeEventListener('keydown', this.keyboardListener)

    await this.crashAnimation()
    await wait(500)
    await this.deadAnimation()

    this.snakeArray = []
    this.moveDirection = ['right']

    // setTimeout(() => {
    //   this.snakeGroup.destroy()
    //   this.initGame()
    //   this.startGame()
    // }, 1000)
  }

  easterEggMode() {
    this.snakeMoveTicker.stop()
    const pushTicker = new PIXI.Ticker()

    const snakeHead = this.snakeArray[0]

    pushTicker.add(() => {
      switch (snakeHead.direction) {
        case 'right':
          this.gameStage.x = this.gameStage.x + 1
          break

        case 'left':
          this.gameStage.x = this.gameStage.x - 1
          break
        case 'up':
          this.gameStage.y = this.gameStage.y - 1
          break
        case 'down':
          this.gameStage.y = this.gameStage.y + 1
          break
      }

      if (this.moveDirection[0]) {
        console.log('RESUME')
        pushTicker.destroy()

        let key = 'i'
        let containerKey = 'x'
        let constant = 1

        if (snakeHead.i < 0) {
          key = 'i'
          containerKey = 'x'
          constant = 1
        } else if (snakeHead.i > this.totalI - 1) {
          key = 'i'
          containerKey = 'x'
          constant = -1
        } else if (snakeHead.j < 0) {
          key = 'j'
          containerKey = 'y'
          constant = 1
        } else if (snakeHead.j > this.totalJ - 1) {
          key = 'j'
          containerKey = 'y'
          constant = -1
        }

        this.snakeArray.forEach((snakePart) => {
          snakePart[key] = snakePart[key] + constant

          snakePart.container[containerKey] =
            snakePart.container[containerKey] + constant * BLOCK_WIDTH
        })

        // snakeHead.prevDirection = snakeHead.direction
        // snakeHead.direction = this.moveDirection.pop()

        this.snakeMoveTicker.start()
      }
    })

    pushTicker.start()
  }

  crashAnimation() {
    const snakeHead = this.snakeArray[0]

    // dead animation
    return new Promise((resolve) => {
      const crashAnimationTicker = new PIXI.Ticker()
      let bounceCount = 0
      let coord = 'x'
      let dirctionVariable = 1

      crashAnimationTicker.add(() => {
        switch (snakeHead.direction) {
          case 'right':
            coord = 'x'
            dirctionVariable = 1
            break
          case 'left':
            coord = 'x'
            dirctionVariable = -1
            break
          case 'up':
            coord = 'y'
            dirctionVariable = -1
            break
          case 'down':
            coord = 'y'
            dirctionVariable = 1
            break

          default:
            break
        }

        if (bounceCount < 3) {
          this.gameStage[coord] = this.gameStage[coord] + 3 * dirctionVariable
          bounceCount++
        } else if (bounceCount < 8) {
          this.gameStage[coord] = this.gameStage[coord] - 3 * dirctionVariable
          bounceCount++
        } else if (bounceCount < 11) {
          this.gameStage[coord] = this.gameStage[coord] + 3 * dirctionVariable
          bounceCount++
        } else {
          crashAnimationTicker.destroy()
          resolve()
        }
      })
      crashAnimationTicker.start()
    })
  }

  deadAnimation() {
    return new Promise((resolve) => {
      const snakeDropTicker = new PIXI.Ticker()

      snakeDropTicker.add(() => {
        console.log('ticker on')
        for (let i = 0; i < this.snakeArray.length; i++) {
          const snakePart = this.snakeArray[i]

          if (snakePart.container.alpha > 0) {
            setTimeout(() => {
              snakePart.container.y = snakePart.container.y + 2
              snakePart.container.alpha -= 0.02
            }, 200 * i)
          }
        }

        if (this.snakeArray[this.snakeArray.length - 1].container.alpha <= 0) {
          snakeDropTicker.destroy()
          resolve()
        }
      })

      snakeDropTicker.start()
    })
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
  const { i, j, direction, id, container } = prevSnakePart

  let data = {}
  switch (direction) {
    case 'right':
      data = {
        i: i - 1,
        j: j,
        direction: 'right',
        id: id + 1,
        x: container.x - BLOCK_WIDTH,
        y: container.y,
      }
      break
    case 'left':
      data = {
        i: i + 1,
        j: j,
        direction: 'left',
        id: id + 1,
        x: container.x + BLOCK_WIDTH,
        y: container.y,
      }
      break
    case 'up':
      data = {
        i: i,
        j: j + 1,
        direction: 'up',
        id: id + 1,
        x: container.x,
        y: container.y + BLOCK_WIDTH,
      }
      break
    case 'down':
      data = {
        i: i,
        j: j - 1,
        direction: 'down',
        id: id + 1,
        x: container.x,
        y: container.y - BLOCK_WIDTH,
      }
      break

    default:
      console.log(i)
      console.log(j)
      console.log(direction)
      console.log(id)
  }

  return data
}

function wait(delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delayTime)
  })
}

function getRandomFoodPosition(isPoison) {
  let randomI = Math.floor(Math.random() * (this.totalI - 1))
  let randomJ = Math.floor(Math.random() * (this.totalJ - 1))

  if (isPoison) {
    if (randomI < 5) {
      randomI = 5
    } else if (randomI > this.totalI - 5) {
      randomI = this.totalI - 5
    }

    if (randomJ < 5) {
      randomJ = 5
    } else if (randomJ > this.totalJ - 5) {
      randomJ = this.totalJ - 5
    }
  }

  return {
    i: randomI,
    j: randomJ,
  }
}
