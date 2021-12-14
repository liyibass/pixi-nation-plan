import * as PIXI from 'pixi.js'
import { Player } from '../components/Player'
import { City } from '../components/City'
// window.PIXI = PIXI

import { Globals } from '../script/Globals'
import { Scene } from './Scene'

const BLOCK_WIDTH = 16

const PLAYER_SPEED = 4
const BOARD_SPEED = 3
const BACKGROUND_SPEED = 2
const OBSTACLE_SPEED = 4
// const gameStageDimention = Globals.getSeesawGameStageDimention()

export class RunScene extends Scene {
  constructor() {
    super()
    this.currentCityIndex = 0
    this.inWindowObstacles = []
    this.createScene()
    this.startGameFlow()
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0x0e427f)
    this._createGameStage()
    this._addMaskToGameStage()
    this._createGroundBackground()
    this._createItems()

    this._createDoctorSay()
  }

  _createGameStage() {
    // get gameStage dimention
    const gameStageDimention = Globals.getRunGameStageDimention()

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
    // gameStageFrame.beginFill(0x00000)
    gameStageFrame.beginFill(0x0e427f)

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
    this._createCity(this.currentCityIndex)
    this._createPlayer()
  }

  _createPlayer() {
    this.player = new Player({
      x: 40,
      y: this.gameStageHeight,
    })
    this.gameStage.addChild(this.player.sprite)
  }

  _createCity() {
    this.bottomLayer = new PIXI.Container()
    this.cityBackgroundLayer = new PIXI.Container()
    this.boardLayer = new PIXI.Container()
    this.obstacleLayer = new PIXI.Container()

    for (let i = 0; i < 7; i++) {
      const city = new City(i, this.collisionMonitor.bind(this))

      let interval = (i === 0 ? 0 : 1 * (this.gameStageWidth * 1)) / 3

      const offset = this.gameStageWidth / 4

      city.cityBackground.container.x =
        this.cityBackgroundLayer.width + this.gameStageWidth + interval

      city.cityBoard.container.x =
        ((this.cityBackgroundLayer.width + this.gameStageWidth + interval) *
          BOARD_SPEED) /
          BACKGROUND_SPEED -
        offset

      city.cityObstacle.container.x =
        ((this.cityBackgroundLayer.width + this.gameStageWidth + interval) *
          OBSTACLE_SPEED) /
          BACKGROUND_SPEED -
        offset

      // city.cityObstacle.container.y = 200

      this.cityBackgroundLayer.addChild(city.cityBackground.container)
      this.boardLayer.addChild(city.cityBoard.container)
      this.obstacleLayer.addChild(city.cityObstacle.container)
    }

    this.gameStage.addChild(
      this.cityBackgroundLayer,
      this.boardLayer,
      this.obstacleLayer
    )
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
    //Capture the keyboard arrow keys
    this.left = this.keyboard('ArrowLeft')
    this.up = this.keyboard('ArrowUp')
    this.right = this.keyboard('ArrowRight')
    this.down = this.keyboard('ArrowDown')

    this.player.sprite.vx = 0
    this.player.sprite.vy = 0

    this.cityBackgroundLayer.vx = 0
    this.boardLayer.vx = 0
    this.obstacleLayer.vx = 0

    // infinite run
    // this.cityBackgroundLayer.vx = -BACKGROUND_SPEED
    // this.boardLayer.vx = -BOARD_SPEED
    // this.obstacleLayer.vx = -PLAYER_SPEED
    // end infinite run

    this.right.press = () => {
      this.player.sprite.scale.x = 1
      this.player.sprite.vx = PLAYER_SPEED
      this.player.sprite.vy = 0

      this.cityBackgroundLayer.vx = -BACKGROUND_SPEED
      this.boardLayer.vx = -BOARD_SPEED
      this.obstacleLayer.vx = -PLAYER_SPEED
    }
    this.right.release = () => {
      if (!this.left.isDown && this.player.sprite.vy === 0) {
        this.player.sprite.vx = 0

        this.cityBackgroundLayer.vx = 0
        this.boardLayer.vx = 0
        this.obstacleLayer.vx = 0
      }
    }

    this.left.press = () => {
      this.player.sprite.scale.x = -1
      this.player.sprite.vx = -PLAYER_SPEED
      this.player.sprite.vy = 0

      this.cityBackgroundLayer.vx = BACKGROUND_SPEED
      this.boardLayer.vx = BOARD_SPEED
      this.obstacleLayer.vx = PLAYER_SPEED
    }
    this.left.release = () => {
      if (!this.right.isDown && this.player.sprite.vy === 0) {
        this.player.sprite.vx = 0

        this.cityBackgroundLayer.vx = 0
        this.boardLayer.vx = 0
        this.obstacleLayer.vx = 0
      }
    }

    //Up
    this.up.press = () => {
      // this.player.sprite.vy = -5
      // this.player.sprite.vx = 0

      if (!this.player.isJumping) {
        this.player.jump()
      }
    }
    this.up.release = () => {
      // if (!this.down.isDown && this.player.sprite.vx === 0) {
      //   this.player.sprite.vy = 0
      // }
    }

    //Down
    this.down.press = () => {
      // this.player.sprite.vy = 5
      // this.player.sprite.vx = 0
    }
    this.down.release = () => {
      // if (!this.up.isDown && this.player.sprite.vx === 0) {
      //   this.player.sprite.vy = 0
      // }
    }
  }

  collisionMonitor(obstacle) {
    // console.log(`moniter obstacle ${obstacle.chimneyIndex}`)
    const { tx: playerX, ty: playerY } = this.player.sprite.worldTransform
    const { width: playerWidth } = this.player.sprite
    const { tx: obstacleX, ty: obstacleY } = obstacle.container.worldTransform
    const { width: obstacleWidth, height: obstacleHeight } = obstacle.container
    // console.log(`${playerX},${playerY}`)
    // console.log(`${obstacleX},${obstacleY}`)

    const rightBoundaryHit =
      playerX + playerWidth / 2 >= obstacleX - obstacleWidth / 2
    const leftBoundaryHit =
      playerX - playerWidth / 2 <= obstacleX + obstacleWidth / 2
    const bottomBoundaryHit = playerY >= obstacleY - obstacleHeight

    if (rightBoundaryHit && leftBoundaryHit && bottomBoundaryHit) {
      console.log('collosion')
    }
  }

  _startSceneTicker() {
    this.sceneTicker = new PIXI.Ticker()

    this.sceneTicker.add(async () => {
      if (
        // player stop when in gameStage center
        this.player.sprite.x >= this.gameStageWidth / 2 &&
        this.right.isDown
      ) {
        this.player.sprite.vx = 0
      } else if (
        // player stop when in gameStage's left corner
        this.player.sprite.x <= this.player.sprite.width / 2 &&
        this.left.isDown
      ) {
        this.player.sprite.vx = 0
      }

      // landing after jumped
      if (this.player.isJumping && this.player.sprite.y <= 0) {
        this.player.isJumping = false
        this.player.sprite.y = 0
      }

      // player move depends on its velocity value
      this.player.sprite.x += this.player.sprite.vx
      this.player.sprite.y += this.player.sprite.vy

      // background move depends on their velocity value
      this.cityBackgroundLayer.x += this.cityBackgroundLayer.vx
      this.boardLayer.x += this.boardLayer.vx
      this.obstacleLayer.x += this.obstacleLayer.vx

      // observe obstacle
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
