// import * as PIXI from 'pixi.js'

// window.PIXI = PIXI

// import { Globals } from '../script/Globals'
import { Taiwan } from '../components/Taiwan'
import { Scene } from './Scene'
import { Status } from '../script/Status'
import { Tip } from '../components/Tip'

export class MenuScene extends Scene {
  constructor(selectStage = () => {}) {
    super()
    this.selectStage = selectStage

    this.inWindowObstacles = []
    this.container.name = 'MenuScene'

    this.currentCityIndex = 0

    this.isNeedTutorial = Status.isNeedTutorial

    this.createScene()

    this.startTutorial()
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0x92b79c)

    this._createItems()
    this.createTaiwan()
    // this._addMaskToGameStage()

    this._createDoctorSay()
  }

  createTaiwan() {
    this.taiwan = new Taiwan(this.startGame.bind(this))
    // this.taiwan.container.interactiveChildren = false
    this.taiwan.container.alpha = 1
    this.container.addChild(this.taiwan.container)
  }

  async startTutorial() {
    if (!this.isNeedTutorial) return

    this.groundGroup.deactiveListener()
    this.tip = new Tip()

    // await this.doctorSay.newSay('這裡是偉哉鬼島，我是新任的村長馬先生。')
    // await this.doctorSay.newSay(
    //   '先說一聲恭喜，這麼愛玩遊戲的你，雀屏中選，成為我治理新村莊的好幫手啦！'
    // )
    // await this.doctorSay.newSay('想要回到原本的世界很簡單')
    // await this.doctorSay.newSay(
    //   '看看地圖上的一塊塊拼圖，每一個都是獨立的村莊，但他們都遇上了一些麻煩，所以顏色看起來都沒什麼活力…'
    // )
    // await this.doctorSay.newSay(
    //   '你的任務就是搜集每個城市遺失的卡片，只要全部都找齊，村民開心，你也能回家啦！'
    // )
    await this.doctorSay.newSay(
      '每張卡片都和城市的特色息息相關。你可以點選有興趣的城市，裡面有城市的基本資料，以及未來的規劃。'
    )
    await this.doctorSay.hint('你可以從卡片上的資訊深入認識每一個城市～', 3000)

    // hint kaoshiung
    this.tip.createPointerTip(this.taiwan.kaoshiung)
    this.container.addChild(this.tip.pointerTipContainer)

    const callBack = async () => {
      this.tip?.pointerTipContainer?.destroy()

      await this.doctorSay.newSay(
        '接著就是重頭戲啦！有看到每個城市都有數張貼上封條的卡片嗎？那些就是你的任務了！'
      )

      const demoTab =
        this.taiwan.card.cardFolder.tabArray[
          this.taiwan.card.cardFolder.tabArray.length - 2
        ]

      // hint second card tab
      this.tip.createPointerTip(demoTab.tabWording)
      this.container.addChild(this.tip.pointerTipContainer)

      console.log(demoTab)
      demoTab.tab.addListener('pointerdown', async () => {
        demoTab.updateTabOrder()
        this.tip?.pointerTipContainer?.destroy()

        await this._wait(1000)
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
      })
    }

    this.taiwan.activeKaoshiungListener(callBack)
  }

  startGame(choosedGame) {
    this.selectStage(choosedGame.gameName)
  }
}
