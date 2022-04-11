import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Player } from '../components/PlayerNew'
import { DialogBoxNew } from '../components/DialogBoxNew'
import { Ground } from '../components/GroundNew'
import { Spotlight } from '../components/SpotlightNew'
import { Doctor } from '../components/DoctorNew'
import { Taiwan } from '../components/Taiwan'
import { DoctorDialogBoxNew } from '../components/DoctorDialogBoxNew'
import { DoctorSay } from '../components/DoctorSay'
import { GroundGroup } from '../components/GroundGroup'
import { IntroSlideshow } from '../components/IntroSlideshow'
import { Header } from '../components/Header'
import { sound } from '@pixi/sound'
import { Status } from '../script/Status'
import gaHandler from '../../gaHandler'
sound.volumeAll = Status.initVolune

const skipButtonDimention = Globals.getSkipButtonDimention()
const groundGroupDimention = Globals.getGroundDimention()

export class IntroScene {
  constructor(selectStage) {
    this.selectStage = selectStage
    this.container = new PIXI.Container()
    this.container.name = 'introScene'
    this.container.interactive = true
    this.container.visible = true

    this.skipCount = 0

    this.isAnimationSkipped = false

    this.filmScript = [
      this.startSlideshow.bind(this),
      this.startStory.bind(this),
      this.firstLightUp.bind(this),
      this.lookAround.bind(this),
      this.movePlayerToGround.bind(this),
      this.spotlightOn.bind(this),
      this.doctorDrop.bind(this),
      this.positionCharacters.bind(this),
      this.taiwanShowUp.bind(this),
      this._createDoctorSay.bind(this),
      this.doctorExplain.bind(this),
    ]
    this.filmScriptStep = 0
    this.initMusic()
    this.createIntro()
  }

  initMusic() {
    sound.add('intro', Globals.resources['music_intro'])
    sound.add('click', Globals.resources['fx_click'])
  }

  playMusic() {
    sound.play('intro', {
      loop: true,
    })
  }

  playClickMusic() {
    sound.play('click')
  }

  stopMusic() {
    sound.stop('intro')
  }

  _createBackground() {
    const bg = new PIXI.Graphics()
    bg.beginFill(0x92b79c)
    bg.drawRect(0, 0, Globals.outerWidth, Globals.outerHeight)
    bg.endFill()

    this.darkBg = new PIXI.Graphics()
    this.darkBg.beginFill(0x00000)
    this.darkBg.drawRect(0, 0, Globals.outerWidth, Globals.outerHeight)
    this.darkBg.endFill()

    this.container.addChild(bg, this.darkBg)
  }

  createStartButton() {
    this.startButton = new PIXI.Text('點擊開始', {
      fill: '0xeeeeee',
      fontSize: '24px',
    })
    this.startButton.position.x = Globals.outerWidth / 2
    this.startButton.position.y = Globals.outerHeight / 2
    this.startButton.anchor.set(0.5, 0.5)

    this.startButton.interactive = true
    this.startButton.buttonMode = true
    this.container.addChild(this.startButton)
  }

  createSkipButton() {
    this.skipButton = new PIXI.Text('跳過動畫', {
      fill: '0xeeeeee',
      fontSize: '20px',
    })
    this.skipButton.position.x = skipButtonDimention.x
    this.skipButton.position.y = skipButtonDimention.y
    this.skipButton.anchor.set(1, 1)

    this.skipButton.interactive = true
    this.skipButton.buttonMode = true
    this.container.addChild(this.skipButton)

    this.skipButton.on('pointerdown', () => {
      gaHandler.gaClickHandler('skip-2nd-anime')
      this.playClickMusic()

      this.isAnimationSkipped = true
      this.container.removeAllListeners()
      this.container.destroy()
      this.stopMusic()
      this.selectStage('menu')
    })
  }

  startGame(choosedGame) {
    this.selectStage(choosedGame.gameName, true)
  }

  createTaiwan() {
    this.taiwan = new Taiwan(this.startGame.bind(this))
    // this.taiwan.container.interactiveChildren = false
    this.taiwan.container.alpha = 0
    this.container.addChild(this.taiwan.container)
  }

  async createIntro() {
    this._createBackground()
    this.createStartButton()
    this._createHeader()

    // this.createTaiwan()
    // this.createCard()

    const startFilmScript = async () => {
      this.playClickMusic()
      this.playMusic()

      if (this.filmScriptStep === 0) {
        this.container.removeChild(this.startButton)
        this.startButton.buttonMode = false

        for (let i = 0; i < this.filmScript.length; i++) {
          if (this.isAnimationSkipped) return
          this.filmScriptStep++

          const filmScript = this.filmScript[i]
          await filmScript()
        }
      } else {
        this.startButton.removeAllListeners()
      }
    }
    // start film script
    // // console.log(startFilmScript)
    // this.startButton.on('pointerdown', () => {
    //   this.playClickMusic()
    //   this.playMusic()
    //   this.selectStage('run')
    //   console.log(startFilmScript)
    // })
    this.startButton.on('pointerdown', startFilmScript)
  }

  _createHeader() {
    this.header = new Header()
    this.container.addChild(this.header.container)
  }

  async startSlideshow() {
    return new Promise((resolve) => {
      this.slideshow = new IntroSlideshow(resolve)
      this.container.addChild(this.slideshow.container)
    })
  }

  async startStory() {
    // console.log('startStory')

    this.ground = new Ground({
      x: Globals.outerWidth / 2,
      y: Globals.outerHeight / 2 + 58,
      isDarkGreen: true,
      groundGroupDimention,
    })

    const scale = this.ground.getSpriteScale()

    this.player = new Player({
      x: Globals.outerWidth / 2,
      y: Globals.outerHeight / 2 + 50,
      scale,
    })

    this.spotlight = new Spotlight({
      x: Globals.outerWidth / 2,
      y: Globals.outerHeight - 110,
      width: this.ground.sprite.width,
    })
    this.createTaiwan()
    this.doctor = new Doctor({
      x: Globals.outerWidth / 2,
      y: 0,
      scale,
    })

    await wait(1000)
    this.container.addChild(
      this.spotlight.sprite,
      this.ground.sprite,
      this.doctor.sprite,
      this.player.container,
      this.taiwan.container
    )
    this.taiwan.container.alpha = 0
    this.player.container.alpha = 0
    this.ground.sprite.alpha = 0
    this.spotlight.sprite.alpha = 0
    this.doctor.sprite.alpha = 0
    this.doctor.fall()

    this.createSkipButton()

    // first fade in
    return new Promise((resolve) => {
      const initShowUpTicker = new PIXI.Ticker()

      initShowUpTicker.add(async () => {
        // // console.log('initShowUpTicker')
        if (this.player.container.alpha <= 0.5) {
          this.player.container.alpha += 0.01
          this.ground.sprite.alpha += 0.01
        } else {
          initShowUpTicker.destroy()
          await wait(2000)
          resolve()
        }
      })

      initShowUpTicker.start()
    })
  }

  async firstLightUp() {
    this.player.container.alpha = 1
    this.ground.sprite.alpha = 1
    this.taiwan.container.alpha = 0.1

    const blurFilter = new PIXI.filters.BlurFilter()
    this.taiwan.container.filters = [blurFilter]

    await this.playerSay({ text: '發生什麼事？！', time: 1000 })
    await this.playerSay({ text: '這裡是哪裡？！', time: 1000 })
  }

  async lookAround() {
    // // console.log('lookAround')
    await this.player.lookAround()
    await this.playerSay({
      text: '這不是模擬城市的入口嗎？',
      time: 2000,
      x: Globals.outerWidth / 2 - 100,
    })
  }

  async movePlayerToGround() {
    // this.container.addChild(ground.sprite)
    // // console.log('movePlayerToGround')

    return new Promise((resolve) => {
      const movePlayerToGroundTicker = new PIXI.Ticker()

      movePlayerToGroundTicker.add(async () => {
        if (this.ground.sprite.y <= groundGroupDimention.y) {
          moveDown(this.player.container)
          moveDown(this.ground.sprite)
        }

        if (this.taiwan.container.y >= Globals.outerHeight / 4 + 100) {
          moveUp(this.taiwan.container)
          this.taiwan.container.filters.pop()
        }

        if (this.taiwan.container.alpha <= 0.3) {
          this.taiwan.container.alpha += 0.005
        }

        if (this.ground.sprite.y >= groundGroupDimention.y) {
          movePlayerToGroundTicker.destroy()

          await wait(1500)

          resolve()
        }
      })

      movePlayerToGroundTicker.start()

      function moveDown(sprite) {
        sprite.y += 3
      }
      function moveUp(sprite) {
        sprite.y -= 2
      }
    })
  }

  async spotlightOn() {
    this.spotlight.sprite.y = groundGroupDimention.y
    await wait(70)
    this.spotlight.sprite.alpha = 0.3
    await wait(70)
    this.spotlight.sprite.alpha = 0.1
    await wait(40)
    this.spotlight.sprite.alpha = 0.5
    await wait(70)
    this.spotlight.sprite.alpha = 0
    await wait(400)

    // console.log('spotlightOn')
    this.spotlight.sprite.alpha = 0.8

    await this.playerSay({
      text: '!?',
      time: 3000,
      y: Globals.outerHeight - 299,
      talkerY: Globals.outerHeight - 155,
    })
  }

  async doctorDrop() {
    // console.log('doctorDrop')

    return new Promise((resolve) => {
      const doctorDropTicker = new PIXI.Ticker()

      doctorDropTicker.add(async () => {
        if (this.doctor.sprite.alpha < 1) {
          this.doctor.sprite.alpha += 0.1
        }
        // // console.log(this.ground.sprite.y)
        if (this.doctor.sprite.y <= groundGroupDimention.y - 55) {
          moveDown(this.doctor.sprite)
          this.doctor.sprite.angle += 4
        }
        if (this.player.container.x >= Globals.outerWidth / 2 - 50) {
          moveLeft(this.player.container)
        }

        if (this.doctor.sprite.y >= groundGroupDimention.y - 55) {
          doctorDropTicker.destroy()
          await wait(1000)
          resolve()
        }
      })

      doctorDropTicker.start()

      function moveDown(sprite) {
        sprite.y += sprite.height / 15
      }

      function moveLeft(sprite) {
        sprite.x -= 1
      }
    })
  }

  async positionCharacters() {
    this.doctor.stand()

    const playerXRatio = 90 / 359
    const playerYRatio = 30 / 113
    const doctorXRatio = 70 / 359
    const doctorYRatio = 40 / 113
    const playerX =
      -groundGroupDimention.groundWidth / 2 +
      groundGroupDimention.groundWidth * playerXRatio +
      this.ground.sprite.x
    const playerY =
      groundGroupDimention.groundHeight * playerYRatio + this.ground.sprite.y
    const doctorX =
      -groundGroupDimention.groundWidth / 2 +
      groundGroupDimention.groundWidth * doctorXRatio +
      this.ground.sprite.x

    const doctorY =
      -groundGroupDimention.groundHeight * doctorYRatio + this.ground.sprite.y

    return new Promise((resolve) => {
      const positionCharactersTicker = new PIXI.Ticker()

      positionCharactersTicker.add(async () => {
        // console.log('positionCharactersTicker')

        if (this.player.container.x <= playerX) {
          this.player.container.x -= 0.8
        }
        if (this.player.container.y <= playerY) {
          this.player.container.y += 2
        }

        if (this.doctor.sprite.x >= doctorX) {
          this.doctor.sprite.x -= 2.1
        }

        if (this.doctor.sprite.y <= doctorY) {
          this.doctor.sprite.y += 1
        }

        if (this.spotlight.sprite.alpha > 0) {
          this.spotlight.sprite.alpha -= 0.1
        }

        if (
          this.player.container.y >= playerY &&
          this.doctor.sprite.y >= doctorY &&
          this.doctor.sprite.x <= doctorX
        ) {
          positionCharactersTicker.destroy()

          await wait(800)
          resolve()
        }
      })
      positionCharactersTicker.start()
    })
  }

  async taiwanShowUp() {
    return new Promise((resolve) => {
      const taiwanShowUpTicker = new PIXI.Ticker()

      taiwanShowUpTicker.add(async () => {
        if (this.taiwan.container.alpha <= 1) {
          this.taiwan.container.alpha += 0.05
        } else {
          taiwanShowUpTicker.destroy()
          this.taiwan.container.filters = []

          await wait(400)
          resolve()
        }
      })

      taiwanShowUpTicker.start()
    })
  }

  async doctorExplain() {
    // console.log('doctorExplain')
    await this.lightUpBackground()
    await this.doctorSay.newSay('新的挑戰者出現啦！')
    this.updateGroundGroup()
    this.skipButton.removeAllListeners()
    this.container.removeChild(this.skipButton)
    this.stopMusic()
    this.selectStage('menu')
  }

  async lightUpBackground() {
    const lightUpBackgroundTicker = new PIXI.Ticker()
    return new Promise((resolve) => {
      lightUpBackgroundTicker.add(() => {
        if (this.darkBg.alpha >= 0) {
          this.darkBg.alpha -= 0.01
        } else {
          lightUpBackgroundTicker.destroy()
          resolve()
        }
      })
      lightUpBackgroundTicker.start()
    })
  }

  updateGroundGroup() {
    this.container.removeChild(
      this.spotlight.sprite,
      this.ground.sprite,
      this.doctor.sprite,
      this.player.container
    )

    delete this.spotlight
    delete this.ground
    delete this.doctor
    delete this.player

    this.groundGroup = new GroundGroup(groundGroupDimention)

    this.groundGroup.container.x = groundGroupDimention.x
    this.groundGroup.container.y = groundGroupDimention.y

    this.container.addChild(this.groundGroup.container)
    // this.groundGroup.activeListener()

    // fix taiwan's zIndex

    this.container.setChildIndex(
      this.taiwan.container,
      this.container.children.length - 1
    )
  }

  async chosenHandler(chosen) {
    // console.log('choosed ' + chosen)

    const lightUpBackgroundTicker = new PIXI.Ticker()
    lightUpBackgroundTicker.add(() => {
      if (this.darkBg.alpha >= 0) {
        this.darkBg.alpha -= 0.01
      } else {
        lightUpBackgroundTicker.destroy()
      }
    })
    lightUpBackgroundTicker.start()

    if (chosen === 'play') {
      // console.log('play game')
      this.container.removeAllListeners()
    } else {
      this.skipCount++
      await wait(300)
      const promptArray = [
        '真的不找找看嗎？ 不然你幫我分享，我先告訴你一點 回到現實世界的小秘訣',
        '玩啦玩啦',
        '拜託玩一下下就好了啦',
        '玩嘛玩嘛玩嘛',
        '真的不找找看嗎？',
        '來啦來啦',
        '一下下就好了拜託',
        '真的不找找看嗎？ 不然你幫我分享，我先告訴你一點 回到現實世界的小秘訣',
      ]

      if (this.skipCount <= promptArray.length) {
        await this.doctorSay({
          fontSize: 16,
          text: promptArray[this.skipCount - 1],
          x: Globals.outerWidth / 2 - 327 / 2,
          y: Globals.outerHeight - 130 - 182 - 80,
          talkerX: Globals.outerWidth / 2 - 80,
          talkerY: Globals.outerHeight - 130,
          width: 327,
          height: 182,
        })
      } else {
        await this.playerSay(
          {
            fontSize: 16,
            text: '幹！都不玩！',
            x: Globals.outerWidth / 2 - 327 / 2,
            y: Globals.outerHeight - 130 - 182 - 80,
            talkerX: Globals.outerWidth / 2 - 80,
            talkerY: Globals.outerHeight - 130,
            width: 327,
            height: 182,
          },
          2000
        )
        this.container.removeAllListeners()
      }
    }
  }

  async playerSay({ text, time = 0, talkerX, talkerY }) {
    this.playerDialogBox = new DialogBoxNew({
      talkerX,
      talkerY,
      text,
    })
    this.playerDialogBox.init()
    this.container.addChild(this.playerDialogBox.container)

    if (time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.container.removeChild(this.playerDialogBox.container)
          resolve()
        }, time)
      })
    }
  }

  async doctorSay({
    text,
    fontSize,
    time = 0,
    x,
    y,
    talkerX,
    talkerY,
    width,
    height,
  }) {
    this.doctorDialogBox = new DoctorDialogBoxNew({
      x,
      y,
      talkerX,
      talkerY,
      width,
      height,
      text,
      fontSize,
      chosenHandler: this.chosenHandler.bind(this),
    })
    this.container.addChild(this.doctorDialogBox.container)

    if (time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.container.removeChild(this.doctorDialogBox.container)
          resolve()
        }, time)
      })
    }
  }

  _createDoctorSay() {
    this.doctorSay = new DoctorSay()
    this.container.addChild(this.doctorSay.container)
  }
}

function wait(delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delayTime)
  })
}
