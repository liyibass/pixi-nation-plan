import * as PIXI from 'pixi.js'
window.PIXI = PIXI
// import _ from 'lodash'
import { Globals } from '../script/Globals'
import { Status } from '../script/Status'
import { GroundGroup } from '../components/GroundGroup'

import { DoctorSay } from '../components/DoctorSay'
import { CountDown } from '../components/CountDown'
import { TwoButtons } from '../components/TwoButtons'
import { PauseGame } from '../components/PauseGame'
import { GameFail } from '../components/GameFail'
import { GameSuccess } from '../components/GameSuccess'
import { Header } from '../components/Header'
import { sound } from '@pixi/sound'

const BLOCK_WIDTH = 16

export class Scene {
  constructor(selectStage = () => {}) {
    this.container = new PIXI.Container()
    this.gameLevel = 0
    this.selectStage = selectStage
  }

  playSuccessMusic() {
    sound?.play?.('success')
  }
  stopSuccessMusic() {
    sound?.stop?.('success')
  }
  playFailMusic() {
    sound?.play?.('fail')
  }
  stopFailMusic() {
    sound?.stop?.('fail')
  }

  // ===== init system =====
  createScene() {
    this._createBackground(0xaaaaaa)
    this._createItems()
    this._createGameStage()

    // _createDoctorSay must be last one (TODO)
    this._createDoctorSay()
  }

  _createHeader() {
    this.header = new Header()
    this.container.addChild(this.header.container)
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
    await this._countDown(3)
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

  _pauseAllGameActivity() {
    // be overwrite by extended
  }

  _resumeAllGameActivity() {
    // be overwrite by extended
  }

  // ===== game over =====
  async gameOver() {
    this.stopMusic()

    this.sceneTicker.stop()
    if (this.menuButtons?.container) {
      this.container.removeChild(this.menuButtons.container)
    }

    this._pauseAllGameActivity()
    this.failGameHint()
  }

  async failGameHint() {
    console.log('failGameHint')
    if (this.menuButtons?.container) {
      this.container.removeChild(this.menuButtons.container)
    }
    this.gameFail = new GameFail(
      this.failGameChooseHandler.bind(this),
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

    this.container.addChild(this.gameFail.container)

    // reset doctorSay
    this.doctorSay.container.destroy()
    this._createDoctorSay()
  }

  async failGameChooseHandler(chosen) {
    switch (chosen) {
      case 'restart':
        this.container.removeChild(this.gameFail.container)
        this.playMusic()
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
  async gamePassed() {
    this.stopMusic()

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

    if (this.gameLevel === 2) {
      this.gameSuccess = new GameSuccess(
        this.successGameChooseHandler.bind(this),
        {
          text: '回到選單',
          color: 0x000000,
          bgColor: '0xC4C4C4',
          value: 'menu',
        }
      )

      this.container.addChild(this.gameSuccess.container)
    } else {
      this.gameSuccess = new GameSuccess(
        this.successGameChooseHandler.bind(this),
        {
          text: '繼續挑戰',
          color: 0xffffff,
          bgColor: '0x3B6BD6',
          value: 'nextLevel',
        },
        {
          text: '回主選單',
          color: 0x000000,
          bgColor: '0xC4C4C4',
          value: 'menu',
        }
      )
    }

    this.container.addChild(this.gameSuccess.container)

    // reset doctorSay
    this.doctorSay.container.destroy()
    this._createDoctorSay()
  }

  async successGameChooseHandler(chosen) {
    // replace by extend
    switch (chosen) {
      case 'nextLevel':
        this.container.removeChild(this.gameSuccess.container)

        this.resetGameSetting()
        // this.initGame()
        this.startGameFlow()
        break

      case 'result':
        this.container.removeChild(this.gameSuccess.container)
        this.backToMenu(true)
        break

      default:
        break
    }
  }

  resetGameSetting() {
    this.sceneTicker?.destroy?.()
    this.sceneTicker = null

    if (this.menuButtons?.container) {
      this.container.removeChild(this.menuButtons.container)
    }
  }

  async backToMenu(isGameOver) {
    console.log('go to menu')

    this.sceneTicker?.stop?.()

    if (this.gameLevel === 3) {
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

  restartGame() {
    this.playMusic()
    this.resetGameSetting()
    this.initGame()
    this.startGame()
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
          this._pauseAllGameActivity()
          this.backToMenu(false)
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

  async shareGame() {
    console.log('isShared:' + Status.isShared)
    if (Status.isShared) return
    await this.doctorSay.newSay(
      '什麼！這麼快就要放棄啦？看在我們有緣，只要把遊戲分享出去，就可以解鎖獨家角色哦！'
    )

    // note : snakeScene has same function
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
