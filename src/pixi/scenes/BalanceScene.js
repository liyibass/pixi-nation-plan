import * as PIXI from 'pixi.js'
window.PIXI = PIXI
// import _ from 'lodash'
import { Globals } from '../script/Globals'
import { GroundGroup } from '../components/GroundGroup'

import { DoctorSay } from '../components/DoctorSay'
import { CountDown } from '../components/CountDown'
import { TwoButtons } from '../components/TwoButtons'
import { PauseGame } from '../components/PauseGame'
import { GameFail } from '../components/GameFail'
import { GameSuccess } from '../components/GameSuccess'
import { SeesawGroup } from '../components/SeesawGroup'
import { Conveyor } from '../components/Conveyor'

// import { SnakeBody } from '../components/SnakeBody'

const BLOCK_WIDTH = 16
const TIMER_WIDTH = 69

export class BalanceScene {
  constructor() {
    this.container = new PIXI.Container()
    this.createBalanceScene()

    this.totalI = Math.floor(this.gameStageWidth / BLOCK_WIDTH)
    this.totalJ = Math.floor(this.gameStageHeight / BLOCK_WIDTH)
    Globals.snakeTotalI = this.totalI
    Globals.snakeTotalJ = this.totalJ

    this.leftSideFirstCard = null
    this.leftSideLastCard = null
    this.rightSideFirstCard = null
    this.rightSideLastCard = null

    this.gameLevel = 0
    this.startGameFlow()
    // this.startGameTest()
  }
  // ===== init game =====
  createBalanceScene() {
    this.createBackground()
    this.createItems()
    this.createGameStage()

    this.createDoctorSay()

    // this.createChessBoard()

    // todo introduce
  }

  createBackground() {
    const bg = new PIXI.Graphics()
    // bg.lineStyle(4, 0x00000, 1)
    bg.beginFill(0xaaaaaa)

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
    const gameStageDimention = Globals.getSeesawGameStageDimention()

    this.gameStageX = gameStageDimention.x
    this.gameStageY = gameStageDimention.y
    this.gameStageWidth = gameStageDimention.width
    this.gameStageHeight = gameStageDimention.height
    this.totalI = Math.floor(this.gameStageWidth / BLOCK_WIDTH)
    this.totalJ = Math.floor(this.gameStageHeight / BLOCK_WIDTH)

    this.gameStage = new PIXI.Container()

    // create a color region
    const gameStageFrame = new PIXI.Graphics()
    const frameLineWeight = 1
    gameStageFrame.lineStyle(frameLineWeight, 0xdddddd, 0)
    // gameStageFrame.beginFill(0xaaaaaa)
    gameStageFrame.beginFill(0x92b79c)

    /*
     * NOTE: We use gameStageFrame(which is a Graphics) to bump up outer container
     * the drawing process down below MUST start at 0,0
     * (Graphics and drawRect is NOT in same level)
     */
    gameStageFrame.drawRect(0, 0, this.gameStageWidth, this.gameStageHeight)
    gameStageFrame.endFill()

    // add to container
    this.gameStage.addChild(gameStageFrame)
    this.container.addChild(this.gameStage)

    // set up gameStage's position
    this.gameStage.x = this.gameStageX
    this.gameStage.y = this.gameStageY
  }

  createDoctorSay() {
    this.doctorSay = new DoctorSay()
    this.container.addChild(this.doctorSay.container)
  }

  // ===== seesaw =====
  createSeesaw() {
    this.seesawGroup = new SeesawGroup()
    // console.log(this.gameStage.width)
    // console.log(seesawGroup.container.width)

    this.seesawGroup.container.x = this.gameStage.width / 2
    this.seesawGroup.container.y = this.gameStage.height
    this.gameStage.addChild(this.seesawGroup.container)
  }

  async startGameFlow() {
    console.log('startGameFlow')

    await wait(500)

    switch (this.gameLevel) {
      case 0:
        this.gameLevel0()
        break

      case 1:
        this.gameLevel1()
        break

      case 2:
        this.gameLevel2()
        break

      default:
        break
    }
  }

  createConveyor() {
    this.conveyor = new Conveyor(this.getChoosedWeightCard.bind(this))
    this.gameStage.addChild(this.conveyor.container)
  }

  getChoosedWeightCard(weightCard) {
    console.log('DROP')
    console.log(weightCard)

    // clean linkList
    weightCard.prevCard = null
    weightCard.nextCard = null

    if (weightCard.positionTicker && weightCard.positionTicker?.started) {
      weightCard.positionTicker.destroy()
    }
    const { width } = Globals.getSeesawGameStageDimention()

    console.log(weightCard.isOnConveyor)
    console.log(width)
    console.log(weightCard.container.x)

    if (weightCard.isOnConveyor) {
      weightCard.isOnConveyor = false
      if (weightCard.container.x + TIMER_WIDTH < width / 2) {
        addToLeft.bind(this)()
      } else {
        addToRight.bind(this)()
      }
    } else {
      if (weightCard.container.x < width / 2) {
        addToLeft.bind(this)()
      } else {
        addToRight.bind(this)()
      }
    }

    // display card
    this.seesawGroup.container.addChild(weightCard.container)

    function addToLeft() {
      // linkList
      const prevCard = this.leftSideLastCard
      if (prevCard) {
        prevCard.nextCard = weightCard
      }
      weightCard.prevCard = prevCard

      // update first/last linkList card
      if (weightCard.prevCard === null) {
        this.leftSideFirstCard = weightCard
      }
      if (weightCard.nextCard === null) {
        this.leftSideLastCard = weightCard
      }

      weightCard.container.x =
        width / 4 + Math.floor(Math.random() * 8 - 4) * 15
      weightCard.container.y = -20
    }

    function addToRight() {
      // linkList
      const prevCard = this.rightSideLastCard
      if (prevCard) {
        prevCard.nextCard = weightCard
      }
      weightCard.prevCard = prevCard
      // update first/last linkList card
      if (weightCard.prevCard === null) {
        this.rightSideLastCard = weightCard
      }
      if (weightCard.nextCard === null) {
        this.rightSideLastCard = weightCard
      }

      weightCard.container.x =
        (width * 3) / 4 + Math.floor(Math.random() * 8 - 4) * 20
      weightCard.container.y = -20
    }
  }

  async gameLevel0() {
    this.createSeesaw()
    this.createConveyor()
    await this.doctorSay.newSay('現在有些人想要搬來你的村莊了')
    await this.doctorSay.newSay('有沒有看到那個翹翹板？')

    await this.doctorSay.newSay(
      '左邊、右邊各有 4 個格子，每格最多可以放 4 個人'
    )
    await this.doctorSay.newSay('你可以先試著放看看，就是這麼簡單')
  }

  async gameLevel1() {
    const doctorSay = new DoctorSay()
    this.container.addChild(doctorSay.container)

    await this.doctorSay.newSay(
      '你的表現超乎我的預期！看來缺水的問題對你來說也是游刃有餘。'
    )
    this.createInitFoods('water')
    await this.doctorSay.newSay('你可以幫忙搜集水源嗎？村民快沒水可以用了。')

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
      '啊，村裡的輸水管線用太久，一直在漏水，你可以幫我把壞掉的水管給處理掉嗎？'
    )
    await this.doctorSay.newSay(
      '同樣要注意，一個不小心撞到壞掉的水管，可能會釀嚴重災情！'
    )

    createdPoison.stopHighlight()
    await this.countDown(3)
    this.snakeMoveTicker.start()

    this.createPoisonInterval('fauset')
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
    await this.countDown(3)
    this.snakeMoveTicker.start()

    this.createPoisonInterval('fauset')
  }

  initGame() {
    this.createSnake()

    switch (this.gameLevel) {
      case 0:
        this.createInitFoods('garbage')
        this.createPoisonInterval('incinerator')
        this.createFoodScore('incinerator')
        break

      default:
      case 1:
        this.createInitFoods('water')
        this.createPoisonInterval('fauset')
        this.createFoodScore('fauset')
        break

      case 2:
        this.createInitFoods('all')
        this.createPoisonInterval('all')
        this.createFoodScore('all')
        break
    }
  }

  // ===== start game =====
  async countDown(countNumber) {
    const countContainer = new CountDown(countNumber)
    this.container.addChild(countContainer.container)

    const isDone = await countContainer.start()

    if (isDone) {
      this.container.removeChild(countContainer.container)
      this.createMenuButtons()
    }
  }

  async startGame() {
    console.log('game started')
    await this.countDown(3)

    this.createKeyboardListener()
    this.startSnakeMoveTicker()
  }

  startSnakeMoveTicker() {
    this.snakeMoveTicker = new PIXI.Ticker()
    this.snakeMoveTicker.add(async () => {})

    this.snakeMoveTicker.start()
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

        case 'menu':
          console.log('back to menu')
          break

        default:
          break
      }
    }
  }

  pauseGame() {
    this.snakeMoveTicker.stop()
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

        default:
          break
      }
    }
  }

  async resumeGame() {
    console.log('resume game')
    await this.countDown(3)

    this.snakeMoveTicker.start()
  }

  async gamePassed() {
    this.snakeMoveTicker.stop()
    this.container.removeChild(this.menuButtons.container)
    // window.removeEventListener('keydown', this.keyboardListener)

    this.resetGameSetting()

    this.successGameHint()
  }

  async gameOver() {
    this.snakeMoveTicker.stop()
    this.container.removeChild(this.menuButtons.container)
    // window.removeEventListener('keydown', this.keyboardListener)

    await this.crashAnimation()
    await wait(500)
    await this.deadAnimation()

    this.resetGameSetting()

    this.failGameHint()
  }

  async failGameHint() {
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
    this.createDoctorSay()

    switch (this.gameLevel) {
      case 1:
        await this.doctorSay.newSay(
          '雖然缺水的問題處理得不順利，但整體表現還算不錯！'
        )
        await this.doctorSay.newSay(
          '恭喜你獲得臺東縣的限定卡，可以看到這裡的垃圾問題多麽嚴重，以及縣政府打算如何處理。'
        )
        await this.doctorSay.newSay(
          '你同時也解開了其他擁有垃圾問題的縣市，可以點選有此困擾的縣市，看各地政府如何因應。'
        )
        break
    }

    async function failGameChooseHandler(chosen) {
      switch (chosen) {
        case 'restart':
          this.container.removeChild(gameFail.container)
          this.restartGame()
          break

        case 'menu':
          await this.doctorSay.newSay(
            '什麼！這麼快就要放棄啦？那只好請你幫我找下一個替死鬼，我才能放你回家。'
          )

          this.goToMenu()
          break
      }
    }
  }

  async successGameHint() {
    this.container.removeChild(this.menuButtons.container)

    const gameSuccess = new GameSuccess(
      successGameChooseHandler.bind(this),
      {
        text: '繼續挑戰',
        color: 0xffffff,
        bgColor: '0x3B6BD6',
        value: 'nextLevel',
      },
      {
        text: '想看結果',
        color: 0x000000,
        bgColor: '0xC4C4C4',
        value: 'result',
      }
    )

    this.container.addChild(gameSuccess.container)

    // reset doctorSay
    this.doctorSay.container.destroy()
    this.createDoctorSay()

    if (this.gameLevel === 1) {
      await this.doctorSay.newSay('沒想到你這麼優秀，我真是找對人了！')
      await this.doctorSay.newSay(
        '先恭喜你獲得臺東縣的限定卡，可以看到這裡的垃圾問題多麽嚴重，以及縣政府打算怎麼處理。'
      )

      await this.doctorSay.newSay(
        '你同時也解開了其他擁有垃圾問題的縣市，可以點選有此困擾的縣市，看各地政府如何因應。'
      )
      await this.doctorSay.newSay(
        '因為你也順利解決了缺水的問題，可以點選有此困擾的縣市，看各地政府如何因應。'
      )
    }

    async function successGameChooseHandler(chosen) {
      console.log(chosen)
      switch (chosen) {
        case 'nextLevel':
          this.container.removeChild(gameSuccess.container)

          this.gameLevel++
          this.startGameFlow()
          break

        case 'result':
          await this.doctorSay.newSay(
            '表現得很不錯哦！恭喜你獲得臺東縣的限定卡，可以看到這裡的垃圾問題多麽嚴重，以及縣政府打算如何處理。'
          )
          await this.doctorSay.newSay(
            '你同時也解開了其他擁有垃圾問題的縣市，可以點選有此困擾的縣市，看各地政府如何因應。'
          )

          break

        case 'menu':
          this.goToMenu()
          break

        default:
          break
      }
    }
  }

  restartGame() {
    this.snakeGroup.destroy()
    this.initGame()
    this.startGame()
  }

  resetGameSetting() {
    this.snakeMoveTicker.destroy()
    this.snakeMoveTicker = null

    this.container.removeChild(this.menuButtons.container)

    window.removeEventListener('keydown', this.keyboardListener)

    // clear food and poison
    this.snakeFoodArray = []
    this.snakePoisionArray = []
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

  goToMenu() {
    console.log('go to menu')
  }
}

function wait(delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delayTime)
  })
}
