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
import { GameFail } from '../components/GameFail'
import { GameSuccess } from '../components/GameSuccess'
import { FoodScore } from '../components/FoodScore'
import { Status } from '../script/Status'
import { unlockWater, unlockGarbage } from '../script/Utils'
import { Header } from '../components/Header'
import { sound } from '@pixi/sound'

// import { SnakeBody } from '../components/SnakeBody'

const BLOCK_WIDTH = 16
const INIT_SNAKE_LENGTH = 7
const INIT_FOOD_COUNT = 3
const INIT_POISON_COUNT = 3
const POISON_SPAWN_BOUNDARY = 4
const POISON_RESPAWN_INTERVAL = 10000
let easterEggString = ''

export class SnakeScene {
  constructor(selectStage = () => { }) {
    this.container = new PIXI.Container()
    this.selectStage = selectStage
    this.initMusic()

    // snake property
    this.snakeArray = []
    this.moveDirection = ['right']
    this.newBodyQueue = []

    this.isEatFirstPoison = true

    this.createSnakeScene()

    this.totalI = Math.floor(this.gameStageWidth / BLOCK_WIDTH)
    this.totalJ = Math.floor(this.gameStageHeight / BLOCK_WIDTH)
    Globals.snakeTotalI = this.totalI
    Globals.snakeTotalJ = this.totalJ

    // food property
    this.snakeFoodArray = []
    this.snakePoisonArray = []
    this.createFoodQuery = []
    this.createPoisonQuery = []
    this.snakePoisonGroup = new PIXI.Container()
    this.gameStage.addChild(this.snakePoisonGroup)

    this.gameLevel = Status.snake.gameLevel

    // this.initGame()

    this.startGameFlow()
    // this.startGameTest()
  }

  initMusic() {
    sound.add('snake', Globals.resources['music_snake'])
  }

  playMusic() {
    sound.play('snake', {
      loop: true,
    })
  }

  stopMusic() {
    sound.stop('snake')
  }

  playSuccessMusic() {
    sound.play('success')
  }
  stopSuccessMusic() {
    sound.stop('success')
  }
  playFailMusic() {
    sound.play('fail')
  }
  stopFailMusic() {
    sound.stop('fail')
  }
  // ===== init game =====
  createSnakeScene() {
    this._createBackground()
    this._createItems()
    this._createGameStage()
    this.createSnakeController()
    this._createDoctorSay()
    this._createHeader()

    // this.createChessBoard()

    // todo introduce
  }

  _createHeader() {
    this.header = new Header()
    this.container.addChild(this.header.container)
  }

  _createBackground() {
    const bg = new PIXI.Graphics()
    // bg.lineStyle(4, 0x00000, 1)
    bg.beginFill(0x92b79c)
    bg.drawRect(0, 0, Globals.width, Globals.height)
    bg.endFill()

    this.container.addChild(bg)
  }

  _createItems() {
    const groundGroupDimention = Globals.getGroundDimention()
    this.groundGroup = new GroundGroup(groundGroupDimention)
    this.groundGroup.container.x = groundGroupDimention.x
    this.groundGroup.container.y = groundGroupDimention.y

    this.container.addChild(this.groundGroup.container)
    // this.groundGroup.activeListener(
    //   this.infoCardEnterCallback.bind(this),
    //   this.infoCardLeaveCallback.bind(this)
    // )
  }

  infoCardEnterCallback() {
    this._pauseAllGameActivity()
    this.container.removeChild(this.menuButtons.container)
  }
  infoCardLeaveCallback() {
    this.resumeGame()
  }

  _createGameStage() {
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
    gameStageFrame.lineStyle(frameLineWeight, 0xdddddd, 0)
    gameStageFrame.beginFill(0xa5d8b3)

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
    this.controller = new SnakeController(this.moveDirection)
    this.container.addChild(this.controller.container)
  }

  _createDoctorSay() {
    this.doctorSay = new DoctorSay()
    this.container.addChild(this.doctorSay.container)
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
    // console.log('createSnake')
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
  createInitFoods(foodType) {
    this.snakeFoodGroup = new PIXI.Container()

    for (let id = 0; id < INIT_FOOD_COUNT; id++) {
      this.createFood(id, foodType)
    }

    this.gameStage.addChild(this.snakeFoodGroup)
  }

  createFood(id, foodType) {
    const { i, j } = getRandomFoodPosition.bind(this)(this.totalI, this.totalJ)
    // console.log('--' + i + ',' + j)
    const snakeFood = new SnakeFood(id, i, j, foodType)
    // const snakeFood = new SnakeFood(id, 3, 3, foodType)

    this.snakeFoodArray.push(snakeFood)
    this.snakeFoodGroup.addChild(snakeFood.container)
  }

  createFoodTimeout(id, foodType) {
    this.createFoodQuery.push(id)

    const foodNextSpawnTime =
      this.snakeArray.length > 15
        ? Math.floor(Math.random() * 9000)
        : Math.floor(Math.random() * 5000)

    const createNewFoodTimeout = () => {
      setTimeout(() => {
        if (!this.snakeMoveTicker) {
          return
        }

        if (!this.snakeMoveTicker.started) {
          createNewFoodTimeout()
          return
        }

        if (
          this.createFoodQuery.length > 0 &&
          this.snakeFoodArray.length < INIT_FOOD_COUNT
        ) {
          const foodId = this.createFoodQuery.shift()
          this.createFood(foodId, foodType)
        }
      }, foodNextSpawnTime)
    }

    createNewFoodTimeout()
  }

  createPoisonInterval(poisonType) {
    this.createPoisonQuery.push(1)
    const poisonTimestamp = this.timestamp

    const createPoisonTimeout = () => {
      setTimeout(() => {
        console.log('createPoisonTimeout start')
        console.log(this.timestamp)
        console.log(poisonTimestamp)

        if (!this.snakeMoveTicker) {
          return
        }

        if (!this.snakeMoveTicker.started) {
          createPoisonTimeout()
          return
        }

        if (poisonTimestamp !== this.timestamp) {
          return
        }

        if (
          this.createPoisonQuery.length > 0 &&
          this.snakePoisonArray.length < INIT_POISON_COUNT
        ) {
          const poisonId = this.createPoisonQuery.shift()
          this.createPoison(poisonId, poisonType)

          this.createPoisonQuery.push(poisonId + 1)
        }
        // recall timeout(as an interval)
        createPoisonTimeout()
      }, POISON_RESPAWN_INTERVAL)
    }

    createPoisonTimeout()
  }

  createPoison(id, poisonType) {
    const { i, j } = getRandomFoodPosition.bind(this)(this.totalI, this.totalJ)
    const snakePoison = new SnakePoison(id, i, j, poisonType)
    this.snakePoisonArray.push(snakePoison)
    this.snakePoisonGroup.addChild(snakePoison.container)

    return snakePoison
  }

  async eatingFoodHandler() {
    const { i: headI, j: headJ } = this.snakeArray[0].getPosition()
    // console.log('==========================')
    // console.log(headI + ',' + headJ)
    // find out whether a food is been eaten
    let eatenFoodIndex = -1
    for (let x = 0; x < this.snakeFoodArray.length; x++) {
      const { i: foodI, j: foodJ } = this.snakeFoodArray[x]
      // console.log(foodI + ',' + foodJ)

      if (foodI === headI && foodJ === headJ) {
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
    this.createFoodTimeout(removedFood.id, removedFood.type)
  }

  async createNewBodyWithFood(removedFood) {
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

  createFoodScore(poisonType) {
    this.foodScore = new FoodScore(poisonType)
    this.container.addChild(this.foodScore.container)
  }

  async startGameFlow() {
    console.log('startGameFlow')
    this.createSnake()

    this.playMusic()

    await wait(500)

    switch (this.gameLevel) {
      case 0:
        this.createFoodScore('fauset')
        this.gameLevel0_0()
        break

      case 1:
        this.createFoodScore('incinerator')
        this.gameLevel1()
        break

      case 2:
        // this.createFoodScore('all')
        // this.gameLevel2()
        this.gameLevel--
        this.createFoodScore('incinerator')
        this.gameLevel1()
        break
    }
  }

  async gameLevel0_0() {
    await this.doctorSay.newSay(
      '家住久了總是會出現一些耗損，像是水管壞掉、垃圾沒地方丟，你的任務就是要幫我解決問題。'
    )

    const chosen = await this.doctorSay.chooseSay(
      '高雄市的麻煩之一就是水不夠用，準備好幫我找水源嗎？',
      {
        text: '準備好了',
        color: '0x000000',
        bgColor: '0xFF8B29',
        value: 'play',
      },
      {
        text: '我不想玩',
        color: '0x000000',
        bgColor: '0xc4c4c4',
        value: 'skip',
      }
    )

    if (chosen === 'play') {
      // this.createPoisonInterval('fauset')
      this.gameLevel0_1()
    } else {
      await this.shareGame()
      this.backToMenuFromBegining()
    }
  }

  async gameLevel0_1() {
    await this.doctorSay.newSay(
      '村民快沒水可以用了，你幫我去找水，方法很簡單，只要操控蛇蛇把水滴吃掉就好'
    )

    // init game
    this.createInitFoods('water')
    // this.createInitFoods('garbage')

    await this.doctorSay.newSay(
      '水滴會隨機出現，你可不要漏掉囉。也要小心不要撞到牆，可能會沒命的！'
    )

    this.startGame()
    await wait(3000)
    // doctorSay.hint('加油！', 3000)
    await wait(10000)

    // if snake is dead, then just leave this function
    if (!this.snakeMoveTicker?.started) return

    // first poison show up
    const createdPoison = this.createPoison(0, 'fauset')
    this.snakeMoveTicker.stop()
    this.container.removeChild(this.menuButtons.container)
    createdPoison.startHighlight()

    await this.doctorSay.newSay(
      '啊，村裡的輸水管線用太久，一直在漏水，你可以幫我把壞掉的水龍頭給處理掉嗎？'
    )
    await this.doctorSay.newSay(
      '方法也很簡單，只要用身體把它們圍起來，水龍頭就會自動爆炸了，你先圍一個試試看。'
    )

    createdPoison.stopHighlight()
    await this._countDown(3)
    this.snakeMoveTicker.start()
  }

  async gameLevel1() {
    const doctorSay = new DoctorSay()
    this.container.addChild(doctorSay.container)

    await this.doctorSay.newSay(
      '村裡住的人越來越多，垃圾量就增加得很快，可是村民又不想蓋焚化爐，你幫我把垃圾變不見！'
    )
    this.createInitFoods('garbage')
    await this.doctorSay.newSay(
      '跟搜集水源的方式一樣，只要操控蛇蛇把垃圾吃掉就好'
    )

    this.startGame()
    await wait(3000)
    // doctorSay.hint('加油！', 3000)
    await wait(10000)

    // if snake is dead, then just leave this function
    if (!this.snakeMoveTicker?.started) return

    // first poison show up
    const createdPoison = this.createPoison(0, 'incinerator')
    this.snakeMoveTicker.stop()
    this.container.removeChild(this.menuButtons.container)
    createdPoison.startHighlight()

    await this.doctorSay.newSay(
      '欸！村莊裡怎麼出現了焚化爐！村民看到會生氣的，快去把它們銷毀！'
    )
    await this.doctorSay.newSay(
      '太好了！同樣要注意，一個不小心撞到焚化爐，可能會釀嚴重災情！'
    )

    createdPoison.stopHighlight()
    await this._countDown(3)
    this.snakeMoveTicker.start()

    this.timestamp = Date.now()
    console.log('reset timestamp  ' + this.timestamp)
    this.createPoisonInterval('incinerator')
  }

  async gameLevel2() {
    // init game
    this.createSnake()
    this.createInitFoods('water')

    const doctorSay = new DoctorSay()
    // doctorSay.hint('YOYO', 3000)
    this.container.addChild(doctorSay.container)

    await this.doctorSay.newSay(
      '你的表現超乎我的預期！看來缺水的問題對你來說也是游刃有餘。'
    )
    await this.doctorSay.newSay('你可以幫忙搜集水源嗎？村民快沒水可以用了。')

    this.startGame()
    await wait(3000)
    // doctorSay.hint('加油！', 3000)
    await wait(10000)
    // first poison show up
    const createdPoison = this.createPoison(0, 'fauset')
    this.snakeMoveTicker.stop()
    this.container.removeChild(this.menuButtons.container)
    createdPoison.startHighlight()

    await this.doctorSay.newSay(
      '啊，村裡的輸水管線用太久，一直在漏水，你可以幫我把壞掉的水管給處理掉嗎？'
    )
    await this.doctorSay.newSay(
      '同樣要注意，一個不小心撞到壞掉的水管，可能會釀嚴重災情！'
    )

    createdPoison.stopHighlight()
    await this._countDown(3)
    this.snakeMoveTicker.start()

    this.createPoisonInterval('fauset')
  }

  initGame() {
    this.createSnake()
    this.timestamp = Date.now()
    console.log('reset timestamp  ' + this.timestamp)

    switch (this.gameLevel) {
      case 0:
        this.createInitFoods('water')
        this.createPoisonInterval('fauset')
        this.createFoodScore('fauset')

        break

      default:
      case 1:
        this.createInitFoods('garbage')
        this.createPoisonInterval('incinerator')
        this.createFoodScore('incinerator')
        break

      case 2:
        this.createInitFoods('all')
        this.createPoisonInterval('all')
        this.createFoodScore('all')
        break
    }
  }

  // ===== start game =====
  async _countDown(countNumber) {
    const countContainer = new CountDown(countNumber)
    this.container.addChild(countContainer.container)

    const isDone = await countContainer.start()

    if (isDone) {
      this.container.removeChild(countContainer.container)
      this._createMenuButtons()
    }
  }

  async startGame() {
    // console.log('game started')
    await this._countDown(3)

    this.createKeyboardListener()
    this.startSnakeMoveTicker()
    this.controller.updateMoveDirectionObject(this.moveDirection)
    this.controller.activeListener()
  }

  startSnakeMoveTicker() {
    this.snakeMoveTicker = new PIXI.Ticker()
    let debounce = 0
    this.snakeMoveTicker.add(async () => {
      for (let i = 0; i < this.snakeArray.length; i++) {
        const snakePart = this.snakeArray[i]
        const frontSnakePart = this.snakeArray[i - 1]
        await snakePart.move()

        const positionX = Math.round(snakePart.container.x * 10) / 10
        const positionY = Math.round(snakePart.container.y * 10) / 10

        // if (i === 0) {
        //   console.log(positionX % BLOCK_WIDTH)
        // }

        // only when snake is moved to grid could change direction
        if (positionX % BLOCK_WIDTH !== 0 || positionY % BLOCK_WIDTH !== 0) {
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

        // if (i === 0) {
        //   console.log(snakePart.i + ',' + snakePart.j)
        // }
      }

      // handle eating food
      await this.eatingFoodHandler()

      this.circleMonitor()

      // handle if dead
      this.deadMonitor()

      if (debounce > 30) {
        debounce = 0
        this.errorRenderingPoisonHander()
      }
      debounce++
    })

    this.snakeMoveTicker.start()
  }

  errorRenderingPoisonHander() {
    this.snakePoisonGroup.children.forEach((renderedPoison) => {
      const valid = this.snakePoisonArray.find(
        (validPoison) => renderedPoison === validPoison.container
      )
      if (!valid) {
        console.log('has invalid poison')
        this.snakePoisonGroup.removeChild(renderedPoison)
      }
    })
  }

  async circleMonitor() {
    if (!this.snakePoisonArray?.length) {
      // no poison on the stage,
      // remove snakePoisonGroup just in case

      if (this.snakePoisonGroup?.length) {
        this.snakePoisonGroup.removeChildren()
      }
      return
    }

    const snakeHead = this.snakeArray[0]
    let isCircle = false
    let circleEndIndex = 0

    // check if there is a circle made by snake
    for (let i = 1; i < this.snakeArray.length; i++) {
      const snakePart = this.snakeArray[i]

      if (snakeHead.i === snakePart.i && snakeHead.j === snakePart.j) {
        isCircle = true
        circleEndIndex = i
        break
      } else {
        isCircle = false
        circleEndIndex = 0
      }
    }

    // get circle's boundray
    if (isCircle) {
      // console.log('=========has circle=========')

      let leftBoundary = snakeHead.i
      let rightBoundary = snakeHead.i
      let topBoundary = snakeHead.j
      let bottomBoundary = snakeHead.j

      for (let i = 1; i < circleEndIndex; i++) {
        const snakePart = this.snakeArray[i]

        if (snakePart.i < leftBoundary) leftBoundary = snakePart.i
        if (snakePart.i > rightBoundary) rightBoundary = snakePart.i
        if (snakePart.j < topBoundary) topBoundary = snakePart.j
        if (snakePart.j > bottomBoundary) bottomBoundary = snakePart.j
      }

      // check if the poison's position is within circle boundary
      for (let inext = 0; inext < this.snakePoisonArray.length; inext++) {
        const targetPoison = this.snakePoisonArray[inext]
        const { i, j, width, height, type } = targetPoison

        let isWithinBoundary = false
        switch (type) {
          case 'incinerator':
            if (
              i - 1 > leftBoundary &&
              i + 1 < rightBoundary &&
              j - 1 > topBoundary &&
              j + 1 < bottomBoundary
            ) {
              isWithinBoundary = true
            }
            break

          case 'fauset':
            if (
              i > leftBoundary &&
              i + width - 1 < rightBoundary &&
              j > topBoundary &&
              j + height - 1 < bottomBoundary
            ) {
              isWithinBoundary = true
            }
            break
        }

        if (isWithinBoundary) {
          console.log('CATCHA')

          targetPoison.eaten()

          this.eatPoison(targetPoison)

          break
        }
      }
      isCircle = false
      circleEndIndex = 0
    } else {
      // console.log('no cicle')
    }
  }

  async eatPoison(poison) {
    console.log(poison)

    this.snakePoisonGroup.removeChild(poison.container)
    this.snakePoisonArray.forEach((poison, x, arr) => {
      if (poison.id === poison.id) {
        arr.splice(x, 1)
      }
    })



    if (this.isEatFirstPoison && this.gameLevel === 0) {
      this.isEatFirstPoison = false

      // first poison show up

      this.snakeMoveTicker.stop()
      this.container.removeChild(this.menuButtons.container)

      await this.doctorSay.newSay(
        '是不是很easy？不過你也要注意，如果一頭撞上水龍頭的話，後果不堪設想！'
      )

      await this._countDown(3)
      this.snakeMoveTicker.start()

      this.timestamp = Date.now()
      console.log('reset timestamp  ' + this.timestamp)

      if (this.gameLevel === 0) {
        this.createPoisonInterval('fauset')
      } else if (this.gameLevel === 1) {
        this.createPoisonInterval('incinerator')
      }
    }

    // add score
    const isGamePassed = this.foodScore.eatPoisonAndVerifyIfPassedGame(
      poison.type
    )

    if (isGamePassed) {
      this.gamePassed()
    }
  }

  deadMonitor() {
    const position = this.snakeArray[0]?.getPosition()

    if (!position) return

    const { i, j } = position

    if (this.snakePoisonArray.length) {
      for (let index = 0; index < this.snakePoisonArray.length; index++) {
        const poison = this.snakePoisonArray[index]
        const { i: I, j: J, width, height, type } = poison

        let leftBoundray
        let rightBoundary
        let topBoundary = J - Math.floor(height / 2)
        let bottomBoundary = J + Math.floor(height / 2)

        switch (type) {
          case 'incinerator':
            leftBoundray = I - Math.floor(width / 2)
            rightBoundary = I + Math.floor(width / 2)

            break
          case 'fauset':
            leftBoundray = I

            rightBoundary = I + width - 1
            break
        }

        if (
          i >= leftBoundray &&
          i <= rightBoundary &&
          j >= topBoundary &&
          j <= bottomBoundary
        ) {
          this.gameOver()

          break
        }
      }
    }

    if (i < 0 || j < 0 || i > this.totalI - 1 || j > this.totalJ - 1) {
      if (easterEggString !== 'readr') {
        this.gameOver()
      } else {
        this.easterEggMode()
      }
    }
  }

  _createMenuButtons() {
    const menuPosition = Globals.getSnakeMenuPosition(2)

    this.menuButtons = new TwoButtons(
      menuChosenHandler.bind(this),
      { text: '暫停', color: 0xffffff, bgColor: '0xAD4B64', value: 'pause' },
      { text: '回主畫面', color: 0x000000, bgColor: '0xC4C4C4', value: 'menu' }
    )
    this.container.addChild(this.menuButtons.container)

    this.menuButtons.container.x = menuPosition.x
    this.menuButtons.container.y = menuPosition.y + this.menuButtons.container.height * 0.8

    function menuChosenHandler(chosen) {
      switch (chosen) {
        case 'pause':
          this.pauseGame()
          break

        case 'menu':
          this.backToMenu(false)
          break

        default:
          break
      }
    }
  }

  _pauseAllGameActivity() {
    this.controller.deactiveListener()
    this.snakeMoveTicker.stop()
  }

  _resumeAllGameActivity() {
    this.snakeMoveTicker.start()
    this.controller.updateMoveDirectionObject(this.moveDirection)
    this.controller.activeListener()
  }

  pauseGame() {
    this._pauseAllGameActivity()
    this.container.removeChild(this.menuButtons.container)

    const pauseGame = new PauseGame(
      pauseGameChooseHandler.bind(this),
      { text: '繼續', color: 0xffffff, bgColor: '0x3B6BD6', value: 'resume' },
      { text: '回主畫面', color: 0x000000, bgColor: '0xC4C4C4', value: 'menu' }
    )

    this.container.addChild(pauseGame.container)

    function pauseGameChooseHandler(chosen) {
      switch (chosen) {
        case 'resume':
          this.container.removeChild(pauseGame.container)
          this.resumeGame()
          break

        case 'menu':
          this.container.removeChild(pauseGame.container)
          this.backToMenu(false)
          break

        default:
          break
      }
    }
  }

  async resumeGame() {
    console.log('resume game')
    await this._countDown(3)
    this._resumeAllGameActivity()
  }

  async gamePassed() {
    this.stopMusic()

    this.snakeMoveTicker.stop()
    this.controller.deactiveListener()
    this.container.removeChild(this.menuButtons.container)
    // window.removeEventListener('keydown', this.keyboardListener)

    this.resetGameSetting()

    this.successGameHint()
  }

  async gameOver() {
    this.stopMusic()

    this.doctorSay.hint('啊')
    this.snakeMoveTicker.stop()
    this.controller.deactiveListener()
    this.container.removeChild(this.menuButtons.container)
    // window.removeEventListener('keydown', this.keyboardListener)

    await this.crashAnimation()
    await wait(500)
    await this.deadAnimation()

    this.resetGameSetting()

    this.failGameHint()
  }

  async failGameHint() {
    this.playFailMusic()

    this.container.removeChild(this.menuButtons.container)
    const gameFail = new GameFail(
      failGameChooseHandler.bind(this),
      {
        text: '再玩一次',
        color: 0xffffff,
        bgColor: '0x3B6BD6',
        value: 'restart',
      },
      {
        text: '我想回家',
        color: 0x000000,
        bgColor: '0xC4C4C4',
        value: 'menu',
      }
    )

    this.container.addChild(gameFail.container)
    // reset doctorSay
    this.doctorSay.container.destroy()
    this._createDoctorSay()

    switch (this.gameLevel) {
      case 1:
        await this.doctorSay.newSay(
          '雖然垃圾的問題處理得不順利，但整體表現還算不錯！'
        )
        await this.doctorSay.newSay(
          '恭喜你獲得高雄市的限定卡，可以看到這裡的缺水問題多麽嚴重，以及市政府打算如何處理。'
        )
        await this.doctorSay.newSay(
          '你同時也解開了其他擁有缺水問題的縣市，可以點選有此困擾的縣市，看各地政府如何因應。'
        )
        break
    }

    async function failGameChooseHandler(chosen) {
      this.stopFailMusic()
      switch (chosen) {
        case 'restart':
          this.playMusic()
          this.container.removeChild(gameFail.container)
          this.restartGame()
          break

        case 'menu':
          await this.shareGame()
          this.container.removeChild(gameFail.container)
          this.backToMenu(true)
          break
      }
    }
  }

  async successGameHint() {
    this.playSuccessMusic()

    this.gameLevel++
    Status.snake.gameLevel++

    this.container.removeChild(this.menuButtons.container)
    let gameSuccess

    if (this.gameLevel === 2) {
      gameSuccess = new GameSuccess(successGameChooseHandler.bind(this), {
        text: '回到選單',
        color: 0x000000,
        bgColor: '0xC4C4C4',
        value: 'exit',
      })

      this.container.addChild(gameSuccess.container)
    } else {
      gameSuccess = new GameSuccess(
        successGameChooseHandler.bind(this),
        {
          text: '繼續挑戰',
          color: 0xffffff,
          bgColor: '0x3B6BD6',
          value: 'nextLevel',
        },
        {
          text: '我不想玩',
          color: 0x000000,
          bgColor: '0xC4C4C4',
          value: 'exit',
        }
      )

      this.container.addChild(gameSuccess.container)
    }

    // reset doctorSay
    this.doctorSay.container.destroy()
    this._createDoctorSay()

    if (this.gameLevel === 1) {
      await this.doctorSay.newSay('沒想到你這麼優秀，我真是找對人了！')
      await this.doctorSay.newSay(
        '恭喜你獲得高雄市的限定卡，可以看到這裡的缺水問題多麽嚴重，以及市政府打算如何處理。'
      )

      await this.doctorSay.newSay(
        '你同時也解開了其他擁有缺水問題的縣市，可以點選有此困擾的縣市，看各地政府如何因應。'
      )

      unlockWater()
    }

    if (this.gameLevel === 2) {
      await this.doctorSay.newSay('沒想到你這麼優秀，我真是找對人了！')

      await this.doctorSay.newSay(
        '你同時也解開了其他擁有垃圾問題的縣市，可以點選有此困擾的縣市，看各地政府如何因應。'
      )
      await this.doctorSay.newSay(
        '因為你也順利解決了缺水的問題，可以點選有此困擾的縣市，看各地政府如何因應。'
      )

      unlockGarbage()
    }

    async function successGameChooseHandler(chosen) {
      this.stopSuccessMusic()

      switch (chosen) {
        case 'nextLevel':
          this.container.removeChild(gameSuccess.container)

          this.startGameFlow()
          break

        case 'exit':
          if (this.gameLevel === 1) {
            await this.doctorSay.newSay(
              '恭喜你獲得高雄市的限定卡，可以看到這裡的缺水問題多麽嚴重，以及市政府打算如何處理。'
            )
            await this.doctorSay.newSay(
              '你同時也解開了其他擁有缺水問題的縣市，可以點選有此困擾的縣市，看各地政府如何因應。'
            )
          }
          this.container.removeChild(gameSuccess.container)
          this.backToMenu(true)
          break

        default:
          break
      }
    }
  }

  restartGame() {
    // this.playMusic()
    this.snakeGroup.destroy()
    this.initGame()
    this.startGame()
  }

  resetGameSetting() {
    this.snakeMoveTicker.destroy()
    this.snakeMoveTicker = null

    this.container.removeChild(this.menuButtons.container)

    if (this.keyboardListenerCallBack) {
      document.removeEventListener('keydown', this.keyboardListenerCallBack)
    }

    // clear food and poison
    this.snakeFoodArray = []
    this.snakePoisonArray = []
    this.createFoodQuery = []
    this.createPoisonQuery = []
    this.score = {
      fauset: 0,
      incinerator: 0,
    }
    this.foodScore.container.destroy()

    this.snakeFoodGroup.removeChildren()
    this.snakePoisonGroup.removeChildren()

    this.snakeArray = []
    this.snakeGroup.destroy()
    this.moveDirection = ['right']

    // init doctorSay
    this.container.removeChild(this.doctorSay.container)
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
    const totalDeadTime = 2000
    const snakeBodyFadeInterval =
      this.snakeArray.length > 7
        ? Math.floor(totalDeadTime / this.snakeArray.length)
        : 200
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
            }, snakeBodyFadeInterval * i)
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

  async backToMenu(isGameOver) {
    console.log('go to menu')
    this.snakeMoveTicker?.stop?.()

    if (this.gameLevel === 2) {
      this.selectStage('menu', this)

      this.stopMusic()
      return
    }

    const chosen = await this.doctorSay.chooseSay(
      '離開遊戲將會中斷遊戲進程，確定要離開？',
      {
        text: '繼續玩好了',
        color: '0x000000',
        bgColor: '0xc4c4c4',
        value: 'cancel',
      },
      {
        text: '確定離開',
        color: '0x000000',
        bgColor: '0xFF8B29',
        value: 'return',
      }
    )

    switch (chosen) {
      case 'return':
        this.selectStage('menu', this)

        this.stopMusic()
        break

      default:
      case 'cancel':
        if (isGameOver) {
          this.restartGame()
        } else if (this.gameLevel === 0) {
          this.gameLevel0_1()
        } else {
          this.resumeGame()
        }
        break
    }
  }

  async backToMenuFromBegining() {
    console.log('go to menu')
    this.selectStage('menu', this)
    this.stopMusic()
  }

  async shareGame() {
    if (Status.isShared) return
    await this.doctorSay.newSay(
      '什麼！這麼快就要放棄啦？看在我們有緣，只要把遊戲分享出去，就可以解鎖獨家角色哦！'
    )

    const isShared = await this.doctorSay.share(
      '好吧…那只好請你幫我分享，讓我找下一個小幫手～別擔心，我也會送一些小禮物，讓你不會空手而歸，先別急著關掉視窗！',
      this.gameName
    )

    if (isShared) {
      Status.isShared = true
      await this.doctorSay.mod('恭喜你解鎖了新人物！', false)
    }
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

function getRandomFoodPosition(totalI, totalJ) {
  const blackListArray = []

  this.snakeArray.forEach((snake) => {
    blackListArray.push({ i: snake.i, j: snake.j })
  })
  this.snakeFoodArray.forEach((food) => {
    blackListArray.push({ i: food.i, j: food.j })
  })
  this.snakePoisonArray.forEach((poison) => {
    blackListArray.push({ i: poison.i, j: poison.j })
  })

  // let randomI = generateRandom(this.totalI)
  // let randomJ = generateRandom(this.totalJ)

  const { randomI, randomJ } = generateRandom(blackListArray)
  return {
    i: randomI,
    j: randomJ,
  }

  // if (isPoison) {
  //   // try not too close to head
  //   const { i: headI, j: headJ } = this.snakeArray[0]

  //   if (
  //     headI + POISON_SPAWN_BOUNDARY > randomI &&
  //     headI - POISON_SPAWN_BOUNDARY < randomI &&
  //     headJ + POISON_SPAWN_BOUNDARY > randomJ &&
  //     headJ - POISON_SPAWN_BOUNDARY < randomJ
  //   ) {
  //     // regenerate random position
  //     const newPosition = getRandomFoodPosition.bind(this)(isPoison)
  //     randomI = newPosition.i
  //     randomJ = newPosition.j
  //   }

  //   // try not too close to boundray
  //   if (randomI < POISON_SPAWN_BOUNDARY) {
  //     randomI = POISON_SPAWN_BOUNDARY
  //   } else if (randomI > this.totalI - POISON_SPAWN_BOUNDARY) {
  //     randomI = this.totalI - POISON_SPAWN_BOUNDARY
  //   }

  //   if (randomJ < POISON_SPAWN_BOUNDARY) {
  //     randomJ = POISON_SPAWN_BOUNDARY
  //   } else if (randomJ > this.totalJ - POISON_SPAWN_BOUNDARY) {
  //     randomJ = this.totalJ - POISON_SPAWN_BOUNDARY
  //   }
  // }

  // return {
  //   i: randomI,
  //   j: randomJ,
  // }

  function generateRandom(blackListArray) {
    // return Math.floor(Math.random() * (total - 5)) + 2

    let { randomI, randomJ } = randomPosition()

    let isTooClose = true
    let retryCount = 0

    while (isTooClose && retryCount < 5) {
      for (let i = 0; i < blackListArray.length; i++) {
        const blackList = blackListArray[i]
        if (
          randomI + POISON_SPAWN_BOUNDARY > blackList.i &&
          randomI - POISON_SPAWN_BOUNDARY < blackList.i &&
          randomJ + POISON_SPAWN_BOUNDARY > blackList.j &&
          randomJ - POISON_SPAWN_BOUNDARY < blackList.j
        ) {
          isTooClose = false
        } else {
          retryCount++
        }
      }
    }

    return {
      randomI,
      randomJ,
    }
  }

  function randomPosition() {
    return {
      randomI:
        Math.floor(Math.random() * (totalI - 1 - POISON_SPAWN_BOUNDARY)) +
        Math.floor(POISON_SPAWN_BOUNDARY / 2),
      randomJ:
        Math.floor(Math.random() * (totalJ - 1 - POISON_SPAWN_BOUNDARY)) +
        Math.floor(POISON_SPAWN_BOUNDARY / 2),
    }
  }
}

// function roundDecimal(val, precision) {
//   return (
//     Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) /
//     Math.pow(10, precision || 0)
//   )
// }
