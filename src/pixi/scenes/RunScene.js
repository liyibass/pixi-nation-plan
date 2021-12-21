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
const gameStageDimention = Globals.getSeesawGameStageDimention()

export class RunScene extends Scene {
  constructor() {
    super()
    this.currentCityIndex = 0
    this.inWindowObstacles = []
    this.container.name = 'RunScene'

    this.bottomLayer = new PIXI.Container()
    this.cityBackgroundLayer = new PIXI.Container()
    this.boardLayer = new PIXI.Container()
    this.obstacleLayer = new PIXI.Container()

    this.currentCityIndex = 0

    this.createScene()
    this.startGameFlow()
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0x0e427f)
    this._createGroundBackground()
    this._createItems()
    this._createGameStage()
    this._addMaskToGameStage()

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
    this.backgroundColor = new PIXI.Graphics()
    this.backgroundColor.name = 'groundBackground'
    this.backgroundColor.beginFill(0x92b79c)
    this.backgroundColor.drawRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight - gameStageDimention.y - gameStageDimention.height
    )
    this.backgroundColor.endFill()

    // add to container

    this.container.addChild(this.backgroundColor)

    // set up gameStage's position
    this.backgroundColor.x = 0
    this.backgroundColor.y = gameStageDimention.y + gameStageDimention.height

    // console.log(backgroundColor)
    // console.log(this.gameStage)
    // this.container.setChildIndex(this.gameStage, 2)
  }

  _addMaskToGameStage() {
    const mask = new PIXI.Graphics()
    mask.drawRect(0, 0, this.gameStageWidth, window.innerHeight)
    // mask.drawRect(0, 0, window.innerWidth, this.gameStageHeight + 30)

    this.gameStage.mask = mask
    this.gameStage.addChild(mask)
  }

  // ===== init game =====
  async initGame() {
    console.log('initGame')
    this._createPlayer()
    this._createCity(this.currentCityIndex)
    this.gameStage.setChildIndex(
      this.player.sprite,
      this.gameStage.children.length - 1
    )

    await this._playerJumpAnimation()
  }

  async _playerJumpAnimation() {
    // let greenGroundIndex = this.backgroundColor.index
    // this.backgroundColor.zIndex = 0
    this.groundGroup.hidePlayer()
    await this.player.jumpIn(this.groundGroup.player)
    // this.backgroundColor.zIndex = greenGroundIndex
  }

  _createPlayer() {
    this.player = new Player({
      x: 40,
      y: this.gameStageHeight,
    })
    this.gameStage.addChild(this.player.sprite)
    this.player.initStandHeight = this.player.sprite.y
    this.player.standHeight = this.player.initStandHeight
  }

  _createCity() {
    for (let i = 0; i < 7; i++) {
      this._createNewCity(i)
    }

    this.gameStage.addChild(
      this.cityBackgroundLayer,
      this.boardLayer,
      this.obstacleLayer
    )
  }

  _createNewCity(cityIndex) {
    const city = new City(
      cityIndex,
      this.collisionMonitor.bind(this),
      this.player
    )

    let interval = (cityIndex === 0 ? 0 : 1 * (this.gameStageWidth * 1)) / 3
    if (city.cityName === 'Mountain') {
      interval = 0
    }
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

    this.right.press = () => {
      if (!this.sceneTicker?.started) {
        return
      }
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
      if (!this.sceneTicker?.started) {
        return
      }
      this.player.sprite.scale.x = -1
      this.player.sprite.vx = -PLAYER_SPEED
      this.player.sprite.vy = 0

      // this.cityBackgroundLayer.vx = BACKGROUND_SPEED
      // this.boardLayer.vx = BOARD_SPEED
      // this.obstacleLayer.vx = PLAYER_SPEED
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
      if (!this.sceneTicker?.started) {
        return
      }

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
    if (obstacle.obstacleName === 'water') {
      this.gameOver(obstacle)
      return
    }
    // add in-window obstacle to array
    if (!obstacle.isAddedToProcesser) {
      this.inWindowObstacles.push(obstacle)
    } else {
      // remove out-window obstacle from array
      this.inWindowObstacles = this.inWindowObstacles.filter((item) => {
        return item.index !== obstacle.index
      })
    }
  }

  _startSceneTicker() {
    this.sceneTicker = new PIXI.Ticker()

    this.sceneTicker.add(async () => {
      if (
        // player stop when in gameStage center
        this.player.sprite.x >= this.gameStageWidth / 3 &&
        this.right.isDown
      ) {
        this.player.sprite.vx = 0
      } else if (
        // player stop when in gameStage's left corner
        this.player.sprite.x <= this.player.sprite.width / 3 &&
        this.left.isDown
      ) {
        this.player.sprite.vx = 0
      }

      // player move depends on its velocity value
      this.player.sprite.x += this.player.sprite.vx
      // if (!this.player.isJumping) {
      //   this.player.sprite.y += this.player.sprite.vy
      // }

      // background move depends on their velocity value
      this.cityBackgroundLayer.x += this.cityBackgroundLayer.vx
      this.boardLayer.x += this.boardLayer.vx
      this.obstacleLayer.x += this.obstacleLayer.vx

      // observe obstacle
      this._obstacleProcesser()

      this.cityBackgroundLayer.children.forEach((cityBackground, index) => {
        const needToDeleteOldCity =
          cityBackground.worldTransform.tx + cityBackground.width < 0

        if (needToDeleteOldCity) {
          cityBackground.visible = false
          // cityBackground.destroy()

          this.boardLayer.children[index]?.destroy()
        }
      })
    })

    this.sceneTicker.start()
  }

  _obstacleProcesser() {
    // console.log(this.inWindowObstacles)
    for (let i = 0; i < this.inWindowObstacles.length; i++) {
      const obstacle = this.inWindowObstacles[i]
      obstacle._setGlobalXAndY()

      const { tx: playerX, ty: playerY } = this.player.sprite.worldTransform
      // const { width: playerWidth } = this.player.sprite

      const { obstacleGlobalX: obstacleX, obstacleGlobalY: obstacleY } =
        obstacle

      const { obstacleWidth, obstacleHeight } = obstacle

      const rightBoundaryHit = playerX >= obstacleX - obstacleWidth / 2
      const leftBoundaryHit = playerX <= obstacleX + obstacleWidth / 2
      let bottomBoundaryHit
      let topBoundaryHit

      const isInObstacleArea = rightBoundaryHit && leftBoundaryHit

      if (isInObstacleArea) {
        if (obstacle.obstacleName === 'finishLine') {
          this.gamePassed()
          return
        }

        this.player.touchedObstacleIndex = obstacle.index

        if (obstacle.obstacleName === 'rock') {
          bottomBoundaryHit = playerY >= obstacleY - obstacleHeight / 2
          topBoundaryHit =
            playerY - this.player.sprite.height <=
            obstacleY + obstacleHeight / 2
        } else {
          bottomBoundaryHit = playerY >= obstacleY - obstacleHeight
          topBoundaryHit = true
        }

        if (bottomBoundaryHit && topBoundaryHit) {
          // console.log('just touch obstacle')

          if (obstacle.canNotStanding) {
            console.log('DEAD')
            this.gameOver(obstacle)
            return
          }

          if (
            this.player.hasBeenTop ||
            (playerY >= obstacleY - obstacleHeight - 5 &&
              playerY <= obstacleY - obstacleHeight + 5)
          ) {
            // console.log('stand collision')

            if (obstacle.obstacleName === 'water') {
              console.log('DEAD')
            } else {
              // this.player.jumpTicker.stop()

              this.player.setStandHeight(
                this.player.initStandHeight - obstacleHeight
              )
            }
          } else {
            // console.log('side collision')

            this.player.sprite.x -= playerX < obstacleX ? 1 : -1
            this.player.sprite.vx = 0
            this.cityBackgroundLayer.vx = 0
            this.boardLayer.vx = 0
            this.obstacleLayer.vx = 0
          }
        }

        return
      } else {
        // console.log(' else from' + obstacle.index)

        if (this.player.touchedObstacleIndex === obstacle.index) {
          // console.log(' else fall from' + obstacle.index)
          // console.log(this.player.touchedObstacleIndex)

          this.player.setStandHeight(this.player.initStandHeight)
          this.player.fall()
          this.player.touchedObstacleIndex = null
        }
      }
    }
  }

  // ===== game pause =====
  _pauseAllGameActivity() {
    // super.removeKeyboardListener()

    // if (this.player.jumpTicker?.started) {
    //   this.player.jumpTicker.stop()
    // }
    this.sceneTicker.stop()

    this.cityBackgroundLayer.children.forEach((background) => {
      background.optimizeTicker?.stop()
    })
    this.inWindowObstacles.forEach((obstacle) => {
      obstacle.ObstacleOperateTicker.stop()
    })
  }

  _resumeAllGameActivity() {
    // super.createKeyboardListener()
    this.player.jumpTicker.start()
    this.sceneTicker.start()
    this.cityBackgroundLayer.children.forEach((background) => {
      background.optimizeTicker?.start()
    })
    this.inWindowObstacles.forEach((obstacle) => {
      obstacle.ObstacleOperateTicker.start()
    })
  }

  // ===== game over =====
  async gameOver(obstacle) {
    this.sceneTicker.stop()
    if (this.menuButtons?.container) {
      this.container.removeChild(this.menuButtons.container)
    }

    this._pauseAllGameActivity()
    await this._deadAnimation(obstacle)

    await this._wait(2000)
    this.failGameHint()
  }

  async _deadAnimation(obstacle) {
    this.gameStage.setChildIndex(
      this.player.sprite,
      this.gameStage.children.length - 1
    )

    this.player.sprite.angle -= 10

    if (obstacle.obstacleName === 'water') {
      console.log('water')
      await this._drawningAnitation()
    } else {
      await this._wait(1000)
    }
    this.player.sprite.width *= 2
    await this._wait(1000)
  }

  async _drawningAnitation() {
    const drawningTicker = new PIXI.Ticker()
    return new Promise((resolve) => {
      drawningTicker.add(() => {
        if (
          this.player.sprite.y <
          gameStageDimention.height + this.player.sprite.height / 2
        ) {
          this.player.sprite.y += 0.3
        } else {
          drawningTicker.stop()
          resolve()
        }
      })

      drawningTicker.start()
    })
  }

  async failGameHint() {
    super.failGameHint()

    switch (this.gameLevel) {
      case 1:
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
  async gamePassed() {
    this.sceneTicker.stop()
    if (this.menuButtons?.container) {
      this.container.removeChild(this.menuButtons.container)
    }

    this._pauseAllGameActivity()

    await this.player.jumpOut(this.groundGroup.player)

    this.successGameHint()
  }

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
    console.log('resetGameSetting')
    // super.removeKeyboardListener()
    super.resetGameSetting()

    this.cityBackgroundLayer.removeChildren()
    this.boardLayer.removeChildren()
    this.obstacleLayer.removeChildren()
    this.inWindowObstacles = []

    this.bottomLayer = new PIXI.Container()
    this.cityBackgroundLayer = new PIXI.Container()
    this.boardLayer = new PIXI.Container()
    this.obstacleLayer = new PIXI.Container()

    this.gameStage.removeChildren()
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
