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
import { Timer } from '../components/Timer'

// import { SnakeBody } from '../components/SnakeBody'

const BLOCK_WIDTH = 16

export class BalanceScene {
  constructor() {
    this.container = new PIXI.Container()
    this.createBalanceScene()

    this.totalI = Math.floor(this.gameStageWidth / BLOCK_WIDTH)
    this.totalJ = Math.floor(this.gameStageHeight / BLOCK_WIDTH)
    Globals.snakeTotalI = this.totalI
    Globals.snakeTotalJ = this.totalJ

    this.gameLevel = 0
    this.startGameFlow()
    // this.startGameTest()
  }
  // ===== init system =====
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
    gameStageFrame.beginFill(0xaaaaaa)
    // gameStageFrame.beginFill(0x92b79c)

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

  // ===== init game =====
  initGame() {
    this.createSeesaw()
    this.createConveyor()
    this.createTimer()
  }
  createSeesaw() {
    this.seesawGroup = new SeesawGroup()

    this.seesawGroup.container.x = this.seesawGroup.container.width / 2
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
    this.conveyor = new Conveyor(
      this.seesawGroup.getChoosedWeightCard.bind(this.seesawGroup)
    )
    this.gameStage.addChild(this.conveyor.container)
  }

  createTimer() {
    this.timer = new Timer()
    this.gameStage.addChild(this.timer.container)
    console.log(this.timer)
  }

  async gameLevel0() {
    this.initGame()

    await this.doctorSay.newSay('現在有些人想要搬來你的村莊了')
    await this.doctorSay.newSay('有沒有看到那個翹翹板？')

    await this.doctorSay.newSay(
      '左邊、右邊各有 4 個格子，每格最多可以放 4 個人'
    )
    await this.doctorSay.newSay('你可以先試著放看看，就是這麼簡單')

    this.startGame()
  }

  async gameLevel1() {
    this.initGame()
    await this.doctorSay.newSay('level 2!')
    this.startGame()
  }

  async gameLevel2() {
    this.initGame()

    await this.doctorSay.newSay('final level!')
    this.startGame()
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
    this.conveyor.startConveyor()
    this.timer.startTimer()

    this.startBalanceTicker()
  }

  startBalanceTicker() {
    this.balanceTicker = new PIXI.Ticker()
    this.balanceTicker.add(async () => {
      this.gameStateMonitor()
    })

    this.balanceTicker.start()
  }

  gameStateMonitor() {
    if (
      this.seesawGroup.isDead ||
      (this.timer.time === 0 &&
        this.seesawGroup.leftTotalWeight !== this.seesawGroup.rightTotalWeight)
    ) {
      this.gameOver()
    }

    if (this.seesawGroup.isClear) {
      this.gamePassed()
    }
  }

  createMenuButtons() {
    const menuPosition = Globals.getSnakeMenuPosition(2)

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

  // ===== game pause =====
  pauseGame() {
    // this.snakeMoveTicker.stop()
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

        default:
          break
      }
    }
  }

  async resumeGame() {
    console.log('resume game')
    await this.countDown(3)

    this._resumeAllGameActivity()
  }

  _pauseAllGameActivity() {
    this.conveyor.stopConveyor()
    this.timer.stopTimer()
    this.seesawGroup.stopSeesawGroup()
    this.seesawGroup.clearDeathCountDown()
  }

  _resumeAllGameActivity() {
    this.conveyor.startConveyor()
    this.timer.startTimer()
    this.seesawGroup.startSeesawGroup()
  }

  // ===== game over =====
  async gameOver() {
    this.balanceTicker.stop()
    this.container.removeChild(this.menuButtons.container)

    this._pauseAllGameActivity()
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

          this.resetGameSetting()
          this.initGame()
          this.startGame()
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

  // ===== game pass =====
  async gamePassed() {
    this.balanceTicker.stop()
    this.container.removeChild(this.menuButtons.container)

    this._pauseAllGameActivity()

    this.successGameHint()
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
    await this.doctorSay.newSay('成功！！')

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

          this.resetGameSetting()
          // this.initGame()
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

  resetGameSetting() {
    this.balanceTicker.destroy()
    this.balanceTicker = null

    this.container.removeChild(this.menuButtons.container)

    this.gameStage.removeChild(
      this.seesawGroup.container,
      this.timer.container,
      this.conveyor.container
    )
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
