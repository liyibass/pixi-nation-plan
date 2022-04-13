import * as PIXI from 'pixi.js'

// window.PIXI = PIXI

import { Globals } from '../script/Globals'
import { GroundGroup } from '../components/GroundGroup'
import { Taiwan } from '../components/Taiwan'
import { Scene } from './Scene'
import { Status } from '../script/Status'
import { Tip } from '../components/Tip'
import { sound } from '@pixi/sound'

import {
  unlockCandy,
  unlockRun,
  unlockBalance,
  unlockWater,
  unlockGarbage,
  clearUnlockCardCityArray,
  saveGameStatus,
} from '../script/Utils'
import { GameTitle } from '../components/GameTitle'
import { unlockAll } from '../script/Utils'

export class MenuScene extends Scene {
  constructor(selectStage = () => {}) {
    super()
    this.selectStage = selectStage

    // clearUnlockCardCityArray()

    this.inWindowObstacles = []
    this.container.name = 'MenuScene'

    this.isNeedTutorial = Status.isNeedTutorial
    this.initMusic()

    this.createScene()
    // this.doctorSay.say('啊')
    this.groundGroup.updateStageStatus()
    this.startGameFlow()
    // this.createTestButton()
  }

  initMusic() {
    sound.add('menu', Globals.resources['music_menu'])
    sound.add('success', Globals.resources['fx_success'])
    sound.add('fail', Globals.resources['fx_fail'])
  }

  playMusic() {
    sound.play('menu', {
      loop: true,
    })
  }

  stopMusic() {
    sound.stop('menu')
  }

  createTestButton() {
    this.createUnlockButton('water', 0)
    this.createUnlockButton('garbage', 1)
    this.createUnlockButton('balance', 2)
    this.createUnlockButton('run', 3)
    this.createUnlockButton('candy', 4)
  }

  createUnlockButton(unlockTarget, position) {
    this.stageButton = new PIXI.Text(`unlock ${unlockTarget}`, {
      fill: '0xeeeeee',
      fontSize: '24px',
    })
    this.stageButton.position.x = 0
    this.stageButton.position.y = position * 30

    this.stageButton.interactive = true
    this.stageButton.buttonMode = true
    this.container.addChild(this.stageButton)

    this.stageButton.on('pointerdown', () => {
      clearUnlockCardCityArray()

      switch (unlockTarget) {
        case 'water':
          unlockWater()
          break
        case 'garbage':
          unlockGarbage()
          break
        case 'run':
          unlockRun()
          break
        case 'balance':
          unlockBalance()
          break
        case 'candy':
          unlockCandy()
          break
      }

      this.taiwan.destroyTaiwan()
      this.taiwan.container.destroy()
      this.createTaiwan()
      this.taiwan.activeCityListener()
      this.taiwan.activeGameListener()
      this.taiwan.card.activeListener()
    })
  }

  unlockHandler(unlockFunction) {
    unlockFunction()
    this.taiwan.destroyTaiwan()
    this.taiwan.container.destroy()
    this.createTaiwan()
    this.taiwan.activeCityListener()
    this.taiwan.activeGameListener()
    this.taiwan.card.activeListener()
  }

  // ===== init system =====
  createScene() {
    this._createBackground(0x92b79c)

    this._createItems()
    this.createTaiwan()
    // this._addMaskToGameStage()

    this._createDoctorSay()
    this._createHeader()
  }

  _createItems() {
    const groundGroupDimention = Globals.getGroundDimention()

    this.groundGroup = new GroundGroup(groundGroupDimention, this.container)

    this.groundGroup.container.x = groundGroupDimention.x
    this.groundGroup.container.y = groundGroupDimention.y
    this.container.addChild(this.groundGroup.container)
    // this.groundGroup.activeListener()
  }

  createTaiwan() {
    this.taiwan = new Taiwan(this.startGame.bind(this))
    // this.taiwan.container.interactiveChildren = false
    this.taiwan.container.alpha = 1
    this.container.addChild(this.taiwan.container)
  }

  async startGameFlow() {
    this.playMusic()
    console.log(Status)

    if (Status.enteredGame) {
      // still in game, and back to menu
      this.openAllListener()
    } else if (Status.isNeedTutorial) {
      // play game first time
      await this.showGameTitle()

      this.startTutorial()
    } else {
      // play game second time
      await this.showGameTitle()

      const chosen = await this.doctorSay.chooseSay(
        '是否要觀看遊戲介紹？',
        {
          text: '好哇',
          color: '0x000000',
          bgColor: '0xFF8B29',
          value: 'yes',
        },
        {
          text: '不用',
          color: '0x000000',
          bgColor: '0xc4c4c4',
          value: 'no',
        }
      )

      if (chosen === 'yes') {
        Status.isNeedTutorial = true
        this.startTutorial()
      } else {
        this.openAllListener()
      }
    }

    Status.enteredGame = true
    saveGameStatus()

    await this.checkCityAnimation()
    // check if there's unlocked city
  }

  async showGameTitle() {
    this.gameTitle = new GameTitle('menu')
    this.container.addChild(this.gameTitle.container)
    await this.gameTitle.revealTitle()
    this.container.removeChild(this.gameTitle.container)
  }

  async checkCityAnimation() {}

  async startTutorial() {
    Status.isNeedTutorial = false
    saveGameStatus()

    this.groundGroup?.deactiveListener?.()
    this.tip = new Tip()

    await this.doctorSay.newSay('歡迎光臨模擬村莊計畫')

    const chosen = await this.doctorSay.chooseSay(
      '想要回去很簡單，只要協助我破解任務，我就放你回去唷，你準備好了嗎？',
      {
        text: '準備好了',
        color: '0x000000',
        bgColor: '0xFF8B29',
        value: 'yes',
      },
      {
        text: '我不想玩',
        color: '0x000000',
        bgColor: '0xc4c4c4',
        value: 'no',
      }
    )

    if (chosen === 'yes') {
      this.tutorialFlow()
    } else {
      await this.doctorSay.newSay('什麼！你也太快放棄了吧！真的不試試看嗎？')
      const chosen2 = await this.doctorSay.chooseSay(
        '想要回去很簡單，只要協助我破解任務，我就放你回去唷，你準備好了嗎？',
        {
          text: '好啦',
          color: '0x000000',
          bgColor: '0xFF8B29',
          value: 'yes',
        },
        {
          text: '不要',
          color: '0x000000',
          bgColor: '0xc4c4c4',
          value: 'no',
        }
      )

      if (chosen2 === 'yes') {
        this.tutorialFlow()
      } else {
        await this.doctorSay.newSay(
          '好吧…那只好請你幫我分享，讓我找下一個小幫手～'
        )
        const isShared = await this.doctorSay.share(
          '別擔心，我也會送一些小禮物，讓你不會空手而歸'
        )

        console.log(isShared)
        if (isShared) {
          Status.isShared = true
          // await this.doctorSay.mod('恭喜你解鎖了新人物！', false)
          this.unlockHandler(unlockAll)
          this.groundGroup.updateStageStatus()
        }
        this.openAllListener()
      }
    }
  }

  async tutorialFlow() {
    await this.doctorSay.newSay('這裡是「模擬村莊007」，我是新任的村長馬先生。')
    await this.doctorSay.newSay(
      '先說一聲恭喜，這麼愛玩遊戲的你，雀屏中選，成為我治理新村莊的好幫手啦！'
    )
    await this.doctorSay.newSay('想要回到原本的世界很簡單')
    await this.doctorSay.newSay(
      '看看地圖上的一塊塊拼圖，每一個都是獨立的村莊，但他們都遇上了一些麻煩，所以顏色看起來沒什麼活力…'
    )
    await this.doctorSay.newSay(
      '你的任務就是搜集每個村莊遺失的卡片，只要全部都找齊，村民開心，你也能回家啦！'
    )
    await this.doctorSay.newSay(
      '每張卡片都和村莊的特色息息相關。你可以點選有興趣的村莊～'
    )
    await this.doctorSay.hint('你可以從卡片上的資訊深入認識每一個村莊', 3000)

    // hint kaoshiung
    this.tip.createPointerTip(this.taiwan.kaoshiung)
    this.container.addChild(this.tip.pointerTipContainer)

    const callBack = async () => {
      this.removePointerHint()
      this.doctorSay.removeHint()
      this.taiwan.deactiveKaoshiungListener()

      await this.doctorSay.newSay(
        '裡面有村莊的基本資料，以及未來的規劃。你可以從卡片上的資訊深入認識每一個村莊～'
      )

      const demoTab =
        this.taiwan.card.cardFolder.tabArray[
          this.taiwan.card.cardFolder.tabArray.length - 2
        ]

      // hint second card tab
      this.taiwan.card.cardFolder.deactiveListener()
      this.taiwan.card.backgroundLayer.removeAllListeners()

      this.tip.createPointerTip(demoTab.tabWording)
      this.container.addChild(this.tip.pointerTipContainer)
      // console.log(demoTab)
      demoTab.tab.buttonMode = true
      demoTab.tab.interactive = true
      demoTab.tab.addListener('pointerdown', async () => {
        demoTab.updateTabOrder()
        this.removePointerHint()
        demoTab.deactiveListener()

        await this._wait(1000)
        await this.doctorSay.newSay(
          '接著就是重頭戲啦！有看到每個村莊都有好幾張被鎖住的卡片嗎？那些就是你的任務了！'
        )
        await this.doctorSay.newSay(
          '另外，也能看到卡片藏身的關卡位置。只要挑戰關卡成功，你就能找回不見的卡片！是不是很簡單！'
        )

        this.taiwan.card.hideCardInfo()

        await this.doctorSay.newSay(
          '最後就是，如果你好奇我為什麼想推動村莊大改造'
        )
        await this.doctorSay.newSay(
          '你還可以點選我的企劃書，這可是機密資料，我只分享給你看哦！'
        )

        // hint infoCard
        const infoCard =
          this.groundGroup.iconArray[this.groundGroup.iconArray.length - 1]
        this.tip.createPointerTip(infoCard)
        this.container.addChild(this.tip.pointerTipContainer)

        const infoCardEnderCallback = async () => {
          // if (!Status.isNeedTutorial) return
          console.log('enter infoCard')
          this.removePointerHint()
        }
        const infoCardExitCallback = async () => {
          // console.log(Status.isNeedTutorial)
          // if (!Status.isNeedTutorial) return
          console.log('eixt infoCard')

          await this.doctorSay.newSay(
            '讓我帶著你實作一次吧！你看畫面上有座城市正在發亮，點擊它，看看它的基本資料。'
          )

          // hint kaoshiung
          this.tip.createPointerTip(this.taiwan.kaoshiung)
          this.container.addChild(this.tip.pointerTipContainer)
          this.taiwan.kaoshiung.hintCity()

          const kaoshiungCallback = async () => {
            this.removePointerHint()
            this.taiwan.kaoshiung.stopHintCity()
            this.taiwan.card.backgroundLayer.removeAllListeners()

            await this.doctorSay.newSay('接下來點選旁邊被封印的卡片區')

            // deactive all tab except waterTab
            this.taiwan.card.cardFolder.tabArray.forEach((cardTab) => {
              cardTab.deactiveListener()
            })

            const waterTab =
              this.taiwan.card.cardFolder.tabArray[
                this.taiwan.card.cardFolder.tabArray.length - 2
              ]

            waterTab.activeTabListener()

            // hint second card tab
            this.tip.createPointerTip(waterTab.tabWording)
            this.container.addChild(this.tip.pointerTipContainer)

            waterTab.tab.addListener('pointerdown', async () => {
              waterTab.updateTabOrder()
              this.removePointerHint()
              waterTab.deactiveListener()
              waterTab?.unlockButton?.activeListener?.()

              await this._wait(1000)

              if (waterTab?.unlockButton) {
                await this.doctorSay.newSay(
                  '是不是有看到一個關卡？點進去試試看，試著達成任務目標，找回卡片！'
                )
              } else {
                await this.doctorSay.newSay(
                  '因為你先前已經玩過遊戲並解鎖卡片了，所以你可以看到這個隱藏卡片的所有內容'
                )
                await this.doctorSay.newSay('可以找找看有沒有其他被封印的卡片')
                await this.doctorSay.newSay(
                  '如果卡片中間有「玩遊戲解鎖」，那就點進去玩玩遊戲、解鎖卡片吧！'
                )

                this.taiwan.card.hideCardInfo()
                this.groundGroup.deactiveListener()
                this.openAllListener()

                waterTab.tab.removeAllListeners()
                demoTab.tab.removeAllListeners()
              }

              console.log('set to false')
            })
          }

          this.taiwan.activeKaoshiungListener(kaoshiungCallback)
        }
        this.groundGroup.activeListener(
          infoCardEnderCallback,
          infoCardExitCallback
        )
      })
    }

    this.taiwan.activeKaoshiungListener(callBack)
  }

  openAllListener() {
    this.taiwan.activeCityListener()
    this.taiwan.activeGameListener()
    this.taiwan.card.activeListener()
    this.groundGroup.activeListener()
  }

  async startGame(choosedGame, needToPlayTitleAnimation = true) {
    if (needToPlayTitleAnimation) {
      this.gameTitle = new GameTitle(choosedGame)
      this.container.addChild(this.gameTitle.container)
      await this.gameTitle.revealTitle()
      this.container.removeChild(this.gameTitle.container)
    }

    this.taiwan.destroyTaiwan()

    this.stopMusic()
    this.selectStage(choosedGame.gameName || choosedGame, this)
  }

  removePointerHint() {
    this.tip?.pointerTipTicker?.stop?.()
    this.tip?.pointerTipContainer?.destroy?.()
  }
}
