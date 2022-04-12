import * as PIXI from 'pixi.js'
import { Player } from '../components/PlayerNew'
import { City } from '../components/City'
// window.PIXI = PIXI

import { Globals } from '../script/Globals'
import { Status } from '../script/Status'
import { Scene } from './Scene'
import { Tiger } from '../components/Tiger'
import { unlockRun } from '../script/Utils'
import { sound } from '@pixi/sound'

const BLOCK_WIDTH = 16

const PLAYER_SPEED = 4
const BOARD_SPEED = 3
const BACKGROUND_SPEED = 2
const OBSTACLE_SPEED = 4
const gameStageDimention = Globals.getRunGameStageDimention()

export class RunScene extends Scene {
  constructor(...args) {
    super(...args)
    this.currentCityIndex = 0
    this.inWindowObstacles = []
    this.container.name = 'RunScene'
    this.gameLevel = Status.run.gameLevel
    this.initMusic()

    this.bottomLayer = new PIXI.Container()
    this.cityBackgroundLayer = new PIXI.Container()
    this.boardLayer = new PIXI.Container()
    this.obstacleLayer = new PIXI.Container()
    this.cityConveyor = []
    this.obstacleCallbackArray = []

    this.createScene()
    this.startGameFlow()
  }

  initMusic() {
    sound.add('run', Globals.resources['music_run'])
  }

  playMusic() {
    sound.play('run', {
      loop: true,
    })
  }

  stopMusic() {
    sound.stop('run')
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0x0e427f)
    this._createGroundBackground()
    this._createItems()
    this._createGameStage()
    // this._addMaskToGameStage()

    this._createDoctorSay()
    this._createHeader()
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

    this._createCity()
    this.gameStage.setChildIndex(
      this.player.container,
      this.gameStage.children.length - 1
    )
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
      x: 0,
      y: this.gameStageHeight,
      scale: Globals.textureScale,
    })
    this.gameStage.addChild(this.player.container)
    this.player.initStandHeight = this.player.container.y
    this.player.standHeight = this.player.initStandHeight
    this.player.createRunningPlayerSprite()
  }

  _createCity() {
    const city = this.getNewCity(this.currentCityIndex)

    this.cityBackgroundLayer.addChild(city.cityBackground.container)
    this.boardLayer.addChild(city.cityBoard.container)
    this.obstacleLayer.addChild(city.cityObstacle.container)

    this.cityConveyor.push(city)

    this.gameStage.addChild(
      this.cityBackgroundLayer,
      this.boardLayer,
      this.obstacleLayer
    )
  }

  middleCallback(lastCityIndex) {
    // console.log('YOYO')
    console.log(lastCityIndex)

    this.currentCityIndex++

    const newCity = this.getNewCity(this.currentCityIndex)

    this.cityBackgroundLayer.addChild(newCity.cityBackground.container)
    this.boardLayer.addChild(newCity.cityBoard.container)
    this.obstacleLayer.addChild(newCity.cityObstacle.container)

    this.cityConveyor.push(newCity)
  }

  exitCallback(lastCityIndex) {
    console.log(`${lastCityIndex} leaved`)
    const passedCity = this.cityConveyor.shift()

    this.cityBackgroundLayer.removeChild(passedCity.cityBackground.container)
    this.boardLayer.removeChild(passedCity.cityBoard.container)
    this.obstacleLayer.removeChild(passedCity.cityObstacle.container)
  }

  getNewCity(cityIndex) {
    const city = new City(
      cityIndex,
      this.collisionMonitor.bind(this),
      this.player,
      this.currentCityNameMonitor.bind(this),
      this.middleCallback.bind(this),
      this.exitCallback.bind(this),
      this.obstacleCallbackArray
    )

    let interval = (cityIndex === 0 ? 0 : 1 * (this.gameStageWidth * 2)) / 3
    if (city.cityName === 'Mountain') {
      interval = 0
    }
    const offset = this.gameStageWidth / 4

    city.cityBackground.container.x = 100 + this.gameStageWidth + interval

    city.cityBoard.container.x =
      ((100 + this.gameStageWidth + interval) * BOARD_SPEED) /
        BACKGROUND_SPEED -
      offset

    city.cityObstacle.container.x =
      ((100 + this.gameStageWidth + interval) * OBSTACLE_SPEED) /
        BACKGROUND_SPEED -
      offset

    // city.cityObstacle.container.y = 200

    return city
  }

  currentCityNameMonitor(cityName) {
    if (this.cityName !== cityName) {
      this.cityName = cityName

      if (this.cityName === 'Miaoli' && !this.tiger) {
        console.log('GENERATE TIGER')

        this.tiger = new Tiger()
        this.gameStage.addChild(this.tiger.container)
        this.tiger.container.x = -window.innerWidth / 2
        this.tiger.container.y = gameStageDimention.height + 20
      }
    }
  }

  // ===== game flow =====
  async startGameFlow() {
    console.log('startGameFlow')
    this.playMusic()

    await this._wait(500)

    switch (this.gameLevel) {
      case 0:
        this.gameLevel0()
        break

      case 1:
        this.gameLevel1()
        break

      case 2:
        this.gameLevel2_0()
        break

      case 3:
        this.gameLevel--
        this.gameLevel2_0()
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

  async gameLevel2_0() {
    await this.doctorSay.newSay('哎呀！我收到通報，附近的城市遇到麻煩了')

    const chosen = await this.doctorSay.chooseSay(
      '附近的城市遇到麻煩了，你願意去幫幫他們嗎？',
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

    if (chosen === 'play') {
      // this.createPoisonInterval('fauset')
      this.gameLevel2_1()
    } else {
      await this.shareGame()
      this.backToMenuFromBegining()
    }
  }
  async gameLevel2_1() {
    await this.doctorSay.newSay(
      '方法很簡單，你只要完成每個村莊的指定任務就可以了，麻煩你啦！'
    )
    this._createPlayer()
    await this._playerJumpAnimation()
    this.initGame()
    this.startGame()
  }

  // ===== start game =====
  async startGame() {
    await super.startGame()
    // super.createKeyboardListener(this.moveHandler.bind(this))
    // this.moveHandler()

    this._startSceneTicker()
    this._startObstacleTicker()
    this.newMoveHandler()

    this.player.jump()
  }

  moveHandler() {
    //Capture the keyboard arrow keys
    this.left = this.keyboard('ArrowLeft')
    this.up = this.keyboard('ArrowUp')
    this.right = this.keyboard('ArrowRight')
    this.down = this.keyboard('ArrowDown')

    this.player.container.vx = 0
    this.player.container.vy = 0

    this.cityBackgroundLayer.vx = 0
    this.boardLayer.vx = 0
    this.obstacleLayer.vx = 0

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
      // if (!this.down.isDown && this.player.container.vx === 0) {
      //   this.player.container.vy = 0
      // }
    }

    //Down
    this.down.press = () => {
      // this.player.container.vy = 5
      // this.player.container.vx = 0
    }
    this.down.release = () => {
      // if (!this.up.isDown && this.player.container.vx === 0) {
      //   this.player.container.vy = 0
      // }
    }
  }

  newMoveHandler() {
    //Capture the keyboard arrow keys
    this.left = this.keyboard('ArrowLeft')
    this.up = this.keyboard('ArrowUp')
    this.right = this.keyboard('ArrowRight')
    this.down = this.keyboard('ArrowDown')

    this.player.container.scale.x = 1
    this.player.container.vx = PLAYER_SPEED
    this.player.container.vy = 0
    this.player.changePlayerTexture('running')

    this.cityBackgroundLayer.vx = -BACKGROUND_SPEED
    this.boardLayer.vx = -BOARD_SPEED
    this.obstacleLayer.vx = -PLAYER_SPEED

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
      // if (!this.down.isDown && this.player.container.vx === 0) {
      //   this.player.container.vy = 0
      // }
    }

    // jump player while tab screen
    this.gameStage.interactive = true
    this.gameStage.buttonMode = true
    this.activateClickToJump()
  }

  activateClickToJump() {
    console.log(this.gameStage)
    this.container.interactive = true
    this.container.buttonMode = true
    this.container.addListener('pointerdown', () => {
      if (!this.player.isJumping) {
        this.player.jump()
      }
    })
  }

  deactivateClickToJump() {
    this.container.interactive = false
    this.container.buttonMode = false
    this.container.removeAllListeners()
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

    const tickerCallback = () => {
      // console.log(time)
      if (
        // player stop when in gameStage center
        this.player.container.x >= this.gameStageWidth / 3 &&
        true
        // this.right.isDown
      ) {
        this.player.container.vx = 0
      } else if (
        // player stop when in gameStage's left corner
        this.player.container.x <= this.player.container.width / 3 &&
        true
        // this.left.isDown
      ) {
        this.player.container.vx = 0
      }

      // player move depends on its velocity value
      this.player.container.x += this.player.container.vx

      // background move depends on their velocity value
      this.cityBackgroundLayer.children.forEach((bg) => {
        bg.x += this.cityBackgroundLayer.vx
      })
      this.boardLayer.children.forEach((board) => {
        board.x += this.boardLayer.vx
      })
      this.obstacleLayer.children.forEach((obstacle) => {
        obstacle.x += this.obstacleLayer.vx
      })
      // console.log(this.cityBackgroundLayer.children)

      // observe obstacle
      this._obstacleProcesser()

      // tiger handler
      if (
        this.tiger &&
        this.tiger?.container?.x < 80 &&
        this.cityName === 'Miaoli'
      ) {
        this.tiger.container.x += 2
      } else if (this.tiger && this.cityName !== 'Miaoli') {
        if (this.tiger.container.x > -window.innerWidth / 2) {
          this.tiger.container.x--
        } else {
          this.gameStage.removeChild(this.tiger.container)
        }
      }
    }

    this.sceneTicker.add(tickerCallback)

    this.sceneTicker.start()
  }

  _startObstacleTicker() {
    this.obstacleTicker = new PIXI.Ticker()

    let debounceCount
    const tickerCallback = () => {
      debounceCount++
      if (debounceCount < 10) return

      this.obstacleCallbackArray.forEach((callback) => {
        callback()
      })
    }

    this.obstacleTicker.add(tickerCallback)

    this.obstacleTicker.start()
  }

  _obstacleProcesser() {
    // console.log(this.inWindowObstacles)

    for (let i = 0; i < this.inWindowObstacles.length; i++) {
      const obstacle = this.inWindowObstacles[i]
      obstacle._setGlobalXAndY()

      const { tx: playerX, ty: playerY } = this.player.container.worldTransform
      // const { width: playerWidth } = this.player.container

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
            playerY - this.player.container.height <=
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

            this.player.container.x -= playerX < obstacleX ? 1 : -1
            this.player.container.vx = 0
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
    this.sceneTicker?.stop?.()
    this.obstacleTicker?.stop?.()

    this.cityBackgroundLayer.children.forEach((background) => {
      background.optimizeTicker?.stop()
    })
    // this.inWindowObstacles.forEach((obstacle) => {
    //   obstacle.ObstacleOperateTicker.stop()
    // })

    this.player.changePlayerTexture('stand')
    this.player.jumpTicker.stop()
    this.player.runningPlayerSprite.stop()
    this.deactivateClickToJump()
  }

  _resumeAllGameActivity() {
    // super.createKeyboardListener()
    this.player.jumpTicker.start()
    this.player.changePlayerTexture('running')
    this.sceneTicker.start()
    this.obstacleTicker.start()
    this.cityBackgroundLayer.children.forEach((background) => {
      background.optimizeTicker?.start()
    })
    // this.inWindowObstacles.forEach((obstacle) => {
    //   obstacle.ObstacleOperateTicker.start()
    // })

    this.player.runningPlayerSprite.play()
    this.activateClickToJump()
  }

  // ===== game over =====
  async gameOver(obstacle) {
    this.stopMusic()
    this.sceneTicker.stop()
    this.obstacleTicker.stop()

    console.log(this.currentCityIndex)
    console.log(this.cityBackgroundLayer.children)

    if (this.cityBackgroundLayer.children.length > 1) {
      this.currentCityIndex--
    }

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
      this.player.container,
      this.gameStage.children.length - 1
    )

    this.player.container.angle -= 10

    if (obstacle.obstacleName === 'water') {
      console.log('water')
      await this._drawningAnitation()
    } else {
      await this._wait(1000)
    }
    this.player.container.width *= 2
    await this._wait(1000)
  }

  async _drawningAnitation() {
    const drawningTicker = new PIXI.Ticker()
    return new Promise((resolve) => {
      drawningTicker.add(() => {
        if (
          this.player.container.y <
          gameStageDimention.height + this.player.container.height / 2
        ) {
          this.player.container.y += 0.3
        } else {
          drawningTicker.stop()
          resolve()
        }
      })

      drawningTicker.start()
    })
  }

  async failGameHint() {
    this.playFailMusic()
    super.failGameHint()

    // switch (this.gameLevel) {
    //   case 1:
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
        this._createPlayer()
        await this._playerJumpAnimation()
        this.initGame()
        this.startGame()
        break

      case 'menu':
        this.container.removeChild(this.gameFail.container)
        await this.doctorSay.newSay(
          '什麼！這麼快就要放棄啦？看在我們有緣，只要把遊戲分享出去，就可以解鎖獨家角色哦！'
        )
        await this.shareGame()
        this.backToMenu(true)
        break
    }
  }

  // ===== game pass =====
  async gamePassed() {
    this.sceneTicker.stop()
    this.obstacleTicker.stop()
    if (this.menuButtons?.container) {
      this.container.removeChild(this.menuButtons.container)
    }

    this._pauseAllGameActivity()

    await this.player.jumpOut(this.groundGroup.player)

    this.successGameHint()
  }

  async successGameHint() {
    this.playSuccessMusic()

    super.successGameHint()
    this.gameLevel++
    Status.run.gameLevel++

    if (this.gameLevel === 3) {
      await this.doctorSay.newSay(
        '你真是太可靠了，順利解決所有的問題！這是村民提供的謝禮，你就收下吧！'
      )

      unlockRun()
    }
  }

  async successGameChooseHandler(chosen) {
    this.stopSuccessMusic()

    switch (chosen) {
      case 'nextLevel':
        this.container.removeChild(this.gameSuccess.container)

        this.resetGameSetting()
        // this.initGame()
        this.startGameFlow()
        break

      default:
      case 'menu':
        if (this.gameLevel === 3) {
          await this.doctorSay.newSay(
            '下面這些村莊也遭遇到類似的問題，好好閱讀他們的經驗，相信會對你有所幫助！'
          )
        }

        this.container.removeChild(this.gameSuccess.container)
        this.backToMenu(true)
        break
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
