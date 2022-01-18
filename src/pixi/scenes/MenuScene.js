// import * as PIXI from 'pixi.js'

// window.PIXI = PIXI

import { Globals } from '../script/Globals'
import { GroundGroup } from '../components/GroundGroup'
import { Taiwan } from '../components/Taiwan'
import { Scene } from './Scene'
import { Status } from '../script/Status'
import { Tip } from '../components/Tip'
import {
  unlockCandy,
  unlockRun,
  unlockBalance,
  unlockWater,
  unlockGarbage,
} from '../script/Utils'

export class MenuScene extends Scene {
  constructor(selectStage = () => {}) {
    super()
    this.selectStage = selectStage
    unlockWater()
    unlockGarbage()
    unlockBalance()
    unlockCandy()
    unlockRun()

    this.inWindowObstacles = []
    this.container.name = 'MenuScene'

    this.isNeedTutorial = Status.isNeedTutorial

    // unlockWater()
    // unlockCandy()

    this.createScene()

    this.startGameFlow()
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0x92b79c)

    this._createItems()
    this.createTaiwan()
    // this._addMaskToGameStage()

    this._createDoctorSay()
  }

  _createItems() {
    const groundGroupDimention = Globals.getGroundDimention()

    this.groundGroup = new GroundGroup(groundGroupDimention)

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
    if (this.isNeedTutorial) {
      this.startTutorial()
    } else {
      this.openAllListener()
    }

    await this.checkCityAnimation()
    // check if there's unlocked city
  }

  async checkCityAnimation() {}

  async startTutorial() {
    if (!this.isNeedTutorial) return

    this.groundGroup.deactiveListener()
    this.tip = new Tip()

    await this.doctorSay.newSay('這裡是偉哉鬼島，我是新任的村長馬先生。')
    await this.doctorSay.newSay(
      '先說一聲恭喜，這麼愛玩遊戲的你，雀屏中選，成為我治理新村莊的好幫手啦！'
    )
    await this.doctorSay.newSay('想要回到原本的世界很簡單')
    await this.doctorSay.newSay(
      '看看地圖上的一塊塊拼圖，每一個都是獨立的村莊，但他們都遇上了一些麻煩，所以顏色看起來都沒什麼活力…'
    )
    await this.doctorSay.newSay(
      '你的任務就是搜集每個城市遺失的卡片，只要全部都找齊，村民開心，你也能回家啦！'
    )
    await this.doctorSay.newSay(
      '每張卡片都和城市的特色息息相關。你可以點選有興趣的城市!'
    )
    await this.doctorSay.hint('你可以從卡片上的資訊深入認識每一個城市～', 3000)

    // hint kaoshiung
    this.tip.createPointerTip(this.taiwan.kaoshiung)
    this.container.addChild(this.tip.pointerTipContainer)

    const callBack = async () => {
      this.removePointerHint()
      this.doctorSay.removeHint()
      this.taiwan.deactiveKaoshiungListener()

      await this.doctorSay.newSay(
        '裡面有城市的基本資料，以及未來的規劃。你可以從卡片上的資訊深入認識每一個城市～'
      )

      const demoTab =
        this.taiwan.card.cardFolder.tabArray[
          this.taiwan.card.cardFolder.tabArray.length - 2
        ]

      // hint second card tab
      this.tip.createPointerTip(demoTab.tabWording)
      this.container.addChild(this.tip.pointerTipContainer)
      console.log(demoTab)
      demoTab.tab.buttonMode = true
      demoTab.tab.interactive = true
      demoTab.tab.addListener('pointerdown', async () => {
        demoTab.updateTabOrder()
        this.removePointerHint()

        await this._wait(1000)
        await this.doctorSay.newSay(
          '接著就是重頭戲啦！有看到每個城市都有數張貼上封條的卡片嗎？那些就是你的任務了！'
        )
        await this.doctorSay.newSay(
          '另外，也能看到卡片藏身的關卡位置。只要挑戰關卡成功，你就能找回不見的卡片！是不是很簡單！'
        )

        this.taiwan.card.hideCardInfo()

        await this.doctorSay.newSay(
          '最後就是，如果你好奇我為什麼想推動村莊大改造'
        )
        await this.doctorSay.newSay(
          '你還可以點選我的企劃書，這可是機密資料，我只分享給你看哦！助手的殺必斯啦！'
        )

        // hint infoCard
        const infoCard =
          this.groundGroup.iconArray[this.groundGroup.iconArray.length - 1]
        this.tip.createPointerTip(infoCard)
        this.container.addChild(this.tip.pointerTipContainer)

        const infoCardEnderCallback = async () => {
          console.log('enter infoCard')
          this.removePointerHint()
        }
        const infoCardExitCallback = async () => {
          console.log('eixt infoCard')
          await this.doctorSay.newSay(
            '讓我帶著你實作一次吧！你看畫面上有座城市正在微微發亮，點擊它之後，可以先看看他的基本資料'
          )

          // hint kaoshiung
          this.tip.createPointerTip(this.taiwan.kaoshiung)
          this.container.addChild(this.tip.pointerTipContainer)
          this.taiwan.kaoshiung.hintCity()

          const kaoshiungCallback = async () => {
            this.removePointerHint()
            this.taiwan.kaoshiung.stopHintCity()

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
              waterTab.unlockButton.activeListener()

              await this._wait(1000)
              await this.doctorSay.newSay(
                '是不是有看到一個關卡？點進去試試看，試著達成任務目標，找回卡片！'
              )

              Status.isNeedTutorial = false
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

  startGame(choosedGame) {
    this.taiwan.destroyTaiwan()

    this.selectStage(choosedGame.gameName || choosedGame)
  }

  removePointerHint() {
    this.tip?.pointerTipTicker?.stop?.()
    this.tip?.pointerTipContainer?.destroy?.()
  }
}
