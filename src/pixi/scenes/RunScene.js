import * as PIXI from 'pixi.js'
import { Player } from '../components/Player'
import { RunBgLayer } from '../components/RunBgLayer'
window.PIXI = PIXI

import { Globals } from '../script/Globals'
import { Scene } from './Scene'

const BLOCK_WIDTH = 16

export class RunScene extends Scene {
  constructor() {
    super()
    this.createScene()
    this.startGameFlow()
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0x0e427f)
    this._createGameStage()
    // this._createGroundBackground()
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
    this.gameStage.name = 'gameStage'

    // create a color region
    const gameStageFrame = new PIXI.Graphics()
    const frameLineWeight = 1
    gameStageFrame.lineStyle(frameLineWeight, 0xdddddd, 0)
    // gameStageFrame.beginFill(0x0e427f)
    gameStageFrame.beginFill(0x0e3461)

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

  _createGroundBackground() {
    // create a color region
    const backgroundColor = new PIXI.Graphics()
    backgroundColor.beginFill(0x92b79c)
    backgroundColor.drawRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight - this.gameStageY - this.gameStageHeight
    )
    backgroundColor.endFill()

    // add to container

    this.container.addChild(backgroundColor)

    // set up gameStage's position
    backgroundColor.x = 0
    backgroundColor.y = this.gameStageY + this.gameStageHeight
  }

  // ===== init game =====
  initGame() {
    this._createPlayer()
    this._createBgLayer()
  }

  _createPlayer() {
    this.player = new Player({
      x: this.gameStageWidth / 2,
      y: this.gameStageHeight,
    })
    this.gameStage.addChild(this.player.sprite)
  }

  _createBgLayer() {
    this.backgroundLayer = new RunBgLayer()
    this.gameStage.addChild(this.backgroundLayer.container)
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

    // this.startGame()
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
  async startGame() {
    await super.startGame()
  }

  _startsceneTicker() {
    this.sceneTicker = new PIXI.Ticker()
    this.sceneTicker.add(async () => {})

    this.sceneTicker.start()
  }

  // ===== game pause =====
  _pauseAllGameActivity() {}

  _resumeAllGameActivity() {}

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

  resetGameSetting() {
    super.resetGameSetting()

    this.gameStage.removeChild(
      this.seesawGroup.container,
      this.timer.container,
      this.conveyor.container
    )
  }
}
