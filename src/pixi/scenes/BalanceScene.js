import * as PIXI from 'pixi.js'
window.PIXI = PIXI

import { Globals } from '../script/Globals'
import { Scene } from './Scene'
import { Conveyor } from '../components/Conveyor'
import { SeesawGroup } from '../components/SeesawGroup'
import { Timer } from '../components/Timer'
import { WeightCard } from '../components/WeightCard'

const BLOCK_WIDTH = 16

export class BalanceScene extends Scene {
  constructor(...args) {
    super(...args)

    this.createScene()
    this.startGameFlow()
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0xaaaaaa)
    this._createGameStage()
    this._createItems()

    this._createDoctorSay()
  }

  _createGameStage() {
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

  // ===== init game =====
  initGame() {
    this.createSeesaw()
    this.createConveyor()
    this.createTimer()
  }

  createSeesaw() {
    this.seesawGroup = new SeesawGroup(this.gameLevel)

    this.seesawGroup.container.x = this.seesawGroup.container.width / 2
    this.seesawGroup.container.y = this.gameStage.height
    this.gameStage.addChild(this.seesawGroup.container)
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
  }

  createInitLoad() {
    for (let i = 0; i < 1; i++) {
      const { name, weight, load } = this.getRandomWeight(0)
      const weightCard = new WeightCard(
        weight,
        name,
        load,
        this.seesawGroup.getChoosedWeightCard.bind(this.seesawGroup)
      )

      this.seesawGroup.addNewWeightCardToBoard(weightCard, 'left')
    }
  }

  // ===== game flow =====
  async startGameFlow() {
    console.log('startGameFlow')

    await this._wait(500)

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

  async gameLevel0() {
    this.initGame()

    await this.doctorSay.newSay('現在有些人想要搬來你的村莊了')
    // await this.doctorSay.newSay('有沒有看到那個翹翹板？')

    // await this.doctorSay.newSay(
    //   '左邊、右邊各有 4 個格子，每格最多可以放 4 個人'
    // )
    // await this.doctorSay.newSay('你可以先試著放看看，就是這麼簡單')
    // this.createInitLoad()
    this.startGame()
  }

  async gameLevel1() {
    this.initGame()
    await this.doctorSay.newSay('level 2!')
    this.createInitLoad()
    this.startGame()
  }

  async gameLevel2() {
    this.initGame()

    await this.doctorSay.newSay('final level!')
    this.createInitLoad()
    this.startGame()
  }

  // ===== start game =====
  async startGame() {
    await super.startGame()

    this.conveyor.startConveyor()
    this.timer.startTimer()
    this._startsceneTicker()
  }

  _startsceneTicker() {
    this.sceneTicker = new PIXI.Ticker()
    this.sceneTicker.add(async () => {
      this._gameStateMonitor()
    })

    this.sceneTicker.start()
  }

  _gameStateMonitor() {
    if (
      this.seesawGroup.isDead ||
      (this.timer.time <= 0 &&
        (this.seesawGroup.leftTotalWeight === 0 ||
          this.seesawGroup.leftTotalWeight !==
            this.seesawGroup.rightTotalWeight))
    ) {
      this.gameOver()
    }

    if (this.seesawGroup.isClear) {
      this.gamePassed()
    }
  }

  // ===== game pause =====
  _pauseAllGameActivity() {
    this.conveyor.stopConveyor()
    this.timer.stopTimer()
    this.seesawGroup.stopSeesawGroup()
    this.seesawGroup.clearDeathCountDown()
    this.seesawGroup.clearClearCountDown()
  }

  _resumeAllGameActivity() {
    this.conveyor.startConveyor()
    this.timer.startTimer()
    this.seesawGroup.startSeesawGroup()
  }

  // ===== game over =====
  async failGameHint() {
    super.failGameHint()

    switch (this.gameLevel) {
      case 0:
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
  }

  async failGameChooseHandler(chosen) {
    switch (chosen) {
      case 'restart':
        this.container.removeChild(this.gameFail.container)

        this.resetGameSetting()
        this.initGame()
        this.startGame()
        break

      case 'menu':
        this.container.removeChild(this.gameFail.container)
        this.backToMenu(true)
        break
    }
  }

  // ===== game pass =====
  async successGameHint() {
    super.successGameHint()

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
  }

  async successGameChooseHandler(chosen) {
    switch (chosen) {
      case 'nextLevel':
        this.container.removeChild(this.gameSuccess.container)

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
        this.container.removeChild(this.gameSuccess.container)
        this.backToMenu(true)
        break

      default:
        break
    }
  }

  resetGameSetting() {
    super.resetGameSetting()

    this.gameStage.removeChild(
      this.seesawGroup.container,
      this.timer.container,
      this.conveyor.container
    )
  }

  getRandomWeight(id) {
    const randomId = Math.floor(Math.random() * 8)
    const cardId = typeof id === 'number' ? id : randomId

    switch (cardId) {
      case 0:
        return {
          name: 'weightAdult1',
          weight: 100,
          load: 1,
        }
      case 1:
        return {
          name: 'weightAdult2',
          weight: 100,
          load: 1,
        }
      case 2:
        return {
          name: 'weightChild1',
          weight: 50,
          load: 1,
        }
      case 3:
        return {
          name: 'weightChild2',
          weight: 50,
          load: 1,
        }
      case 4:
        return {
          name: 'weightElder1',
          weight: 150,
          load: 1,
        }
      case 5:
        return {
          name: 'weightElder2',
          weight: 150,
          load: 1,
        }
      case 6:
        return {
          name: 'weightBus',
          weight: 500,
          load: 4,
        }
      case 7:
        return {
          name: 'weightShop',
          weight: 750,
          load: 4,
        }
    }
  }
}
