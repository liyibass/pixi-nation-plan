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

const BLOCK_WIDTH = 16

export class Scene {
  constructor() {
    this.container = new PIXI.Container()
    this.gameLevel = 0
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0xaaaaaa)
    this._createItems()
    this._createGameStage()

    // _createDoctorSay must be last one (TODO)
    this._createDoctorSay()
  }

  _createBackground(color) {
    const bg = new PIXI.Graphics()
    // bg.lineStyle(4, 0x00000, 1)
    bg.beginFill(color)

    bg.drawRect(0, 0, Globals.width, Globals.height)
    bg.endFill()

    this.container.addChild(bg)
  }

  _createItems() {
    const groundGroupDimention = Globals.getGroundDimention()

    this.groundGroup = new GroundGroup(groundGroupDimention)
    this.container.addChild(this.groundGroup.container)
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

  _addMaskToGameStage() {
    const mask = new PIXI.Graphics()
    mask.drawRect(0, 0, this.gameStageWidth, this.gameStageHeight)
    this.gameStage.mask = mask
    this.gameStage.addChild(mask)
  }

  _createDoctorSay() {
    this.doctorSay = new DoctorSay()
    this.container.addChild(this.doctorSay.container)
  }

  // ===== init game =====
  initGame() {
    // be overwrite by extended
  }

  // ===== start game =====

  async startGame() {
    console.log('game started')
    // await this._countDown(3)
  }

  // ===== game pause =====
  pauseGame() {
    console.log('pause game')
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
    await this._countDown(3)

    this._resumeAllGameActivity()
  }

  _pauseAllGameActivity() {
    // be overwrite by extended
  }

  _resumeAllGameActivity() {
    // be overwrite by extended
  }

  // ===== game over =====
  async gameOver() {
    this.sceneTicker.stop()
    if (this.menuButtons?.container) {
      this.container.removeChild(this.menuButtons.container)
    }

    this._pauseAllGameActivity()
    this.failGameHint()
  }

  async failGameHint() {
    if (this.menuButtons?.container) {
      this.container.removeChild(this.menuButtons.container)
    }
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

    async function failGameChooseHandler(chosen) {
      switch (chosen) {
        case 'restart':
          this.container.removeChild(gameFail.container)

          this.resetGameSetting()
          this.initGame()
          this.startGame()
          break

        // case 'menu':
        //   await this.doctorSay.newSay(
        //     '什麼！這麼快就要放棄啦？那只好請你幫我找下一個替死鬼，我才能放你回家。'
        //   )

        //   this.goToMenu()
        //   break
      }
    }
  }

  // ===== game pass =====
  async gamePassed() {
    this.sceneTicker.stop()
    if (this.menuButtons?.container) {
      this.container.removeChild(this.menuButtons.container)
    }

    this._pauseAllGameActivity()

    this.successGameHint()
  }

  async successGameHint() {
    if (this.menuButtons?.container) {
      this.container.removeChild(this.menuButtons.container)
    }

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
    this._createDoctorSay()

    async function successGameChooseHandler(chosen) {
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
    this.sceneTicker.destroy()
    this.sceneTicker = null

    if (this.menuButtons?.container) {
      this.container.removeChild(this.menuButtons.container)
    }
  }

  goToMenu() {
    console.log('go to menu')
  }

  // ===== game utils =====
  _createMenuButtons() {
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

  async _countDown(countNumber) {
    const countContainer = new CountDown(countNumber)
    this.container.addChild(countContainer.container)

    const isDone = await countContainer.start()

    if (isDone) {
      this.container.removeChild(countContainer.container)
      this._createMenuButtons()
    }
  }

  _wait(delayTime) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, delayTime)
    })
  }

  createKeyboardListener(moveHandler) {
    //  add keyboard listener
    this.keyboardListenerCallBack = (event) => {
      const key = event.key

      switch (key) {
        case 'ArrowDown':
          moveHandler('down')
          break
        case 'ArrowRight':
          moveHandler('right')
          break
        case 'ArrowUp':
          moveHandler('up')
          break
        case 'ArrowLeft':
          moveHandler('left')
          break
      }
    }

    document.addEventListener('keydown', this.keyboardListenerCallBack)
    document.addEventListener('keyup', () => moveHandler('null'))
  }

  removeKeyboardListener() {
    if (this.keyboardListenerCallBack) {
      document.removeEventListener('keydown', this.keyboardListenerCallBack)
    }
  }
}
