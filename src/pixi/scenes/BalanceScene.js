import * as PIXI from 'pixi.js'
window.PIXI = PIXI

import { Globals } from '../script/Globals'
import { Status } from '../script/Status'
import { Scene } from './Scene'
import { Conveyor } from '../components/Conveyor'
import { SeesawGroup } from '../components/SeesawGroup'
import { Timer } from '../components/Timer'
import { WeightCard } from '../components/WeightCard'
import { unlockBalance } from '../script/Utils'
import { sound } from '@pixi/sound'

const BLOCK_WIDTH = 16

export class BalanceScene extends Scene {
  constructor(...args) {
    super(...args)
    this.gameLevel = Status.balance.gameLevel
    this.initMusic()

    this.createScene()
    this.startGameFlow()
  }

  initMusic() {
    sound.add('balance', Globals.resources['music_balance'])
  }

  playMusic() {
    sound.play('balance', {
      loop: true,
    })
  }

  stopMusic() {
    sound.stop('balance')
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0xaaaaaa)
    this._createGameStage()
    this._createItems()

    this._createDoctorSay()
    this._createHeader()
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
      this.seesawGroup.getChoosedWeightCard.bind(this.seesawGroup),
      this.gameLevel
    )

    this.gameStage.addChild(this.conveyor.container)

    // let seesawGroup can ovserve conveyor status
    this.seesawGroup.conveyor = this.conveyor
  }

  createTimer() {
    let time = 0

    switch (this.gameLevel) {
      case 0:
        time = 30
        break
      case 1:
        time = 90
        break
      default:
      case 2:
        time = 120
        break
    }
    this.timer = new Timer(time)
    this.gameStage.addChild(this.timer.container)
  }

  createInitLoad() {
    let leftList = []

    switch (this.gameLevel) {
      default:
      case 0:
        // leftList = [0, 1, 0, 1, 4, 5, 2, 3, 2]
        break

      case 1:
        leftList = [0, 1, 0, 1, 4, 5, 2, 3]
        break
      case 2:
        leftList = [0, 1, 0, 1, 7, 3, 4, 5]
        break
    }

    leftList.forEach((id) => {
      const { name, weight, load } = this.getRandomWeight(id)
      const weightCard = new WeightCard(
        weight,
        name,
        load,
        this.seesawGroup.getChoosedWeightCard.bind(this.seesawGroup)
      )

      this.seesawGroup.addNewWeightCardToBoard(weightCard, 'left')
    })
  }

  // ===== game flow =====
  async startGameFlow() {
    console.log('startGameFlow')
    this.playMusic()

    await this._wait(500)

    switch (this.gameLevel) {
      case 0:
        this.gameLevel0_0()
        break

      case 1:
        this.gameLevel1()
        break

      case 2:
        this.gameLevel2()
        break

      case 3:
        this.gameLevel--
        this.gameLevel2()
        break

      default:
        this.gameLevel = 2
        this.gameLevel2()
    }
  }

  async gameLevel0_0() {
    this.initGame()

    await this.doctorSay.newSay(
      '村莊最重要的就是村民，怎麼讓他們過得舒適，均衡發展就很重要啦！'
    )

    const chosen = await this.doctorSay.chooseSay(
      '現在有些人想要搬來你的村莊了，你的工作是好好分配他們居住的地方，準備好了嗎？',
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
        value: 'menu',
      }
    )
    console.log(chosen)
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
      '有沒有看到翹翹板？你可以把畫面上方的人放在翹翹板的兩邊'
    )
    await this.doctorSay.newSay(
      '只要在時間限制內讓兩側保持平衡，就能順利過關～'
    )
    await this.doctorSay.newSay('注意！每個人重量都不一樣哦！')
    this.createInitLoad()
    this.startGame()
  }

  async gameLevel1() {
    this.initGame()
    await this.doctorSay.newSay(
      '隨著城市發展，有人搬進來，有人搬出去，原本的居民則有無法避免的生老病死，這時候該怎麼好好分配來來去去的人流呢？'
    )
    this.createInitLoad()
    this.startGame()
  }

  async gameLevel2() {
    this.initGame()
    await this.doctorSay.newSay(
      '哎呀！都市裡突然開了一間新的商店，好多人都搬到那附近了，翹翹板傾斜得好嚴重，你該怎麼辦呢？'
    )

    this.createInitLoad()
    this.startGame()
  }

  // ===== start game =====
  async startGame() {
    await super.startGame()
    this.conveyor.cardCount = 0
    this.conveyor.startConveyor(this.gameLevel)
    this.timer.startTimer()
    this._startsceneTicker()

    this.container.interactive = true

    // this.container.on('pointerdown', () => {
    //   console.log('onTouchStart')
    // })
    // this.container.on('pointermove', () => {
    //   console.log('onTouchMove')
    // })
    // this.container.on('pointerup', () => {
    //   console.log(this)
    //   this.gameLevel = 0
    // })
  }

  _startsceneTicker() {
    this.sceneTicker = new PIXI.Ticker()
    this.sceneTicker.add(async () => {
      this._gameStateMonitor()
    })

    this.sceneTicker.start()
  }

  _gameStateMonitor() {
    if (this.timer.time <= 0) {
      this.gameOver()
      return
    }

    if (
      this.seesawGroup.isDead ||
      (this.timer.time <= 0 &&
        (this.seesawGroup.leftTotalWeight === 0 ||
          this.seesawGroup.leftTotalWeight !==
            this.seesawGroup.rightTotalWeight))
    ) {
      this.gameOver()
    }

    // checkpoint
    if (this.seesawGroup.isClear) {
      this.gamePassed()
    }
  }

  // ===== game pause =====
  _pauseAllGameActivity() {
    this.sceneTicker.stop()
    this.conveyor.stopConveyor()
    this.timer.stopTimer()
    this.seesawGroup.stopSeesawGroup()
    this.seesawGroup.clearDeathCountDown()
    this.seesawGroup.clearClearCountDown()
  }

  _resumeAllGameActivity() {
    this.sceneTicker.start()
    this.conveyor.startConveyor()
    this.timer.startTimer()
    this.seesawGroup.startSeesawGroup()
  }

  // ===== game over =====
  async failGameHint() {
    this.playFailMusic()

    super.failGameHint()

    // switch (this.gameLevel) {
    //   case 0:
    //     await this.doctorSay.newSay(
    //       '雖然缺水的問題處理得不順利，但整體表現還算不錯！'
    //     )
    //     await this.doctorSay.newSay(
    //       '恭喜你獲得臺東縣的限定卡，可以看到這裡的垃圾問題多麽嚴重，以及縣政府打算如何處理。'
    //     )
    //     await this.doctorSay.newSay(
    //       '你同時也解開了其他擁有垃圾問題的縣市，可以點選有此困擾的縣市，看各地政府如何因應。'
    //     )
    //     break
    // }
  }

  async failGameChooseHandler(chosen) {
    this.stopFailMusic()

    switch (chosen) {
      case 'restart':
        this.container.removeChild(this.gameFail.container)
        this.playMusic()
        this.resetGameSetting()
        this.initGame()
        this.createInitLoad()
        this.startGame()
        break

      case 'menu':
        this.container.removeChild(this.gameFail.container)
        await this.shareGame()
        this.backToMenu(true)
        break
    }
  }

  // ===== game pass =====
  async successGameHint() {
    this.playSuccessMusic()

    super.successGameHint()
    this.gameLevel++
    Status.balance.gameLevel++

    if (this.gameLevel === 3) {
      await this.doctorSay.newSay(
        '謝謝你讓村莊變得更好了！不只是來住的人增加，居民生活的品質也越來越高。'
      )
      await this.doctorSay.newSay(
        '要解決村莊的老年化、人口外流和發展失衡問題，是不是不容易呢？你已經踏出成功的第一步！'
      )

      unlockBalance()
    }
  }

  async successGameChooseHandler(chosen) {
    this.stopSuccessMusic()

    console.log('successGameChooseHandler in Balance')
    switch (chosen) {
      case 'nextLevel':
        this.container.removeChild(this.gameSuccess.container)

        this.resetGameSetting()
        // this.initGame()
        this.startGameFlow()
        break

      default:
      case 'menu':
        this.container.removeChild(this.gameSuccess.container)
        this.backToMenu(true)
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
