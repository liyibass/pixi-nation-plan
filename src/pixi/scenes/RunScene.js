import * as PIXI from 'pixi.js'
import { Player } from '../components/Player'
import { RunBgLayer } from '../components/RunBgLayer'
window.PIXI = PIXI

import { Globals } from '../script/Globals'
import { Scene } from './Scene'

const BLOCK_WIDTH = 16
// const gameStageDimention = Globals.getSeesawGameStageDimention()

export class RunScene extends Scene {
  constructor() {
    super()
    this.createScene()
    this.startGameFlow()

    this.leftPressed = false
    this.rightPressed = false
    this.upPressed = false
    this.downPressed = false
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
    this._createBgLayer()
    this._createPlayer()
  }

  _createPlayer() {
    this.player = new Player({
      x: 40,
      y: this.gameStageHeight,
    })
    this.gameStage.addChild(this.player.sprite)
  }

  _createBgLayer() {
    this.backgroundLayer = new RunBgLayer()
    this.gameStage.addChild(this.backgroundLayer.container)

    this.backgroundLayer.container.x = this.gameStageWidth
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
  async startGame() {
    await super.startGame()
    // super.createKeyboardListener(this.moveHandler.bind(this))
    this.moveHandler()

    this._startSceneTicker()
  }

  moveHandler() {
    const PLAYER_SPEED = 4
    const BACKGROUND_SPEED = 2
    //Capture the keyboard arrow keys
    this.left = this.keyboard('ArrowLeft')
    this.up = this.keyboard('ArrowUp')
    this.right = this.keyboard('ArrowRight')
    this.down = this.keyboard('ArrowDown')

    this.player.sprite.vx = 0
    this.player.sprite.vy = 0
    this.backgroundLayer.container.vx = 0

    this.right.press = () => {
      this.player.sprite.vx = PLAYER_SPEED
      this.player.sprite.vy = 0

      this.backgroundLayer.container.vx = -BACKGROUND_SPEED
    }
    this.right.release = () => {
      if (!this.left.isDown && this.player.sprite.vy === 0) {
        this.player.sprite.vx = 0

        this.backgroundLayer.container.vx = 0
      }
    }

    this.left.press = () => {
      this.player.sprite.vx = -PLAYER_SPEED
      this.player.sprite.vy = 0

      this.backgroundLayer.container.vx = BACKGROUND_SPEED
    }
    this.left.release = () => {
      if (!this.right.isDown && this.player.sprite.vy === 0) {
        this.player.sprite.vx = 0

        this.backgroundLayer.container.vx = 0
      }
    }

    //Up
    this.up.press = () => {
      this.player.sprite.vy = -5
      this.player.sprite.vx = 0
    }
    this.up.release = () => {
      if (!this.down.isDown && this.player.sprite.vx === 0) {
        this.player.sprite.vy = 0
      }
    }

    //Down
    this.down.press = () => {
      this.player.sprite.vy = 5
      this.player.sprite.vx = 0
    }
    this.down.release = () => {
      if (!this.up.isDown && this.player.sprite.vx === 0) {
        this.player.sprite.vy = 0
      }
    }
  }

  _startSceneTicker() {
    this.sceneTicker = new PIXI.Ticker()
    this.sceneTicker.add(async () => {
      if (
        this.player.sprite.x >= this.gameStageWidth / 2 &&
        this.right.isDown
      ) {
        this.player.sprite.vx = 0
      } else if (
        this.player.sprite.x <= this.player.sprite.width / 2 &&
        this.left.isDown
      ) {
        this.player.sprite.vx = 0
        this.backgroundLayer.container.vx = 0
      }
      this.player.sprite.x += this.player.sprite.vx

      this.player.sprite.y += this.player.sprite.vy

      this.backgroundLayer.container.x += this.backgroundLayer.container.vx

      // console.log('ticker on')
      // switch (this.direction) {
      //   case 'right':
      //     if (this.player.sprite.x < gameStageDimention.width / 2 + 15) {
      //       this.player.sprite.x += 3
      //     }
      //     break
      //   case 'left':
      //     if (this.player.sprite.x > gameStageDimention.width / 2 - 15) {
      //       this.player.sprite.x -= 3
      //     }
      //     break
      //   default:
      //     break
      // }
    })

    this.sceneTicker.start()
  }

  // ===== game pause =====
  _pauseAllGameActivity() {
    // super.removeKeyboardListener()
  }

  _resumeAllGameActivity() {
    // super.createKeyboardListener()
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
    // super.removeKeyboardListener()
    super.resetGameSetting()

    this.gameStage.removeChild(
      this.seesawGroup.container,
      this.timer.container,
      this.conveyor.container
    )
  }

  keyboard(value) {
    const key = {}
    key.value = value
    key.isDown = false
    key.isUp = true
    key.press = undefined
    key.release = undefined
    //The `downHandler`
    key.downHandler = (event) => {
      if (event.key === key.value) {
        if (key.isUp && key.press) {
          key.press()
        }
        key.isDown = true
        key.isUp = false
        event.preventDefault()
      }
    }

    //The `upHandler`
    key.upHandler = (event) => {
      if (event.key === key.value) {
        if (key.isDown && key.release) {
          key.release()
        }
        key.isDown = false
        key.isUp = true
        event.preventDefault()
      }
    }

    //Attach event listeners
    const downListener = key.downHandler.bind(key)
    const upListener = key.upHandler.bind(key)

    window.addEventListener('keydown', downListener, false)
    window.addEventListener('keyup', upListener, false)

    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener('keydown', downListener)
      window.removeEventListener('keyup', upListener)
    }

    return key
  }
}
