import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Player } from '../components/Player'
import { DialogBox } from '../components/DialogBox'
import { Ground } from '../components/Ground'
import { Spotlight } from '../components/Spotlight'
import { Doctor } from '../components/Doctor'
import { Taiwan } from '../components/Taiwan'
import { DoctorDialogBox } from '../components/DoctorDialogBox'

export class IntroScene {
  constructor(selectStage) {
    this.selectStage = selectStage
    this.container = new PIXI.Container()
    this.container.interactive = true
    this.container.visible = true

    this.skipCount = 0

    this.filmScript = [
      this.startStory.bind(this),
      this.firstLightUp.bind(this),
      this.lookAround.bind(this),
      this.movePlayerToGround.bind(this),
      this.spotlightOn.bind(this),
      this.doctorDrop.bind(this),
      this.positionCharacters.bind(this),
      this.taiwanShowUp.bind(this),
      this.doctorExplain.bind(this),
    ]
    this.filmScriptStep = 0

    this.createIntro()

    this.getGroundPosition = this.getGroundPosition.bind(this)
  }

  _createBackground() {
    const bg = new PIXI.Graphics()
    bg.beginFill(0x92b79c)
    bg.drawRect(0, 0, Globals.width, Globals.height)
    bg.endFill()

    this.darkBg = new PIXI.Graphics()
    this.darkBg.beginFill(0x00000)
    this.darkBg.drawRect(0, 0, Globals.width, Globals.height)
    this.darkBg.endFill()

    this.container.addChild(bg, this.darkBg)
  }

  createStartButton() {
    this.startButton = new PIXI.Text('點擊開始', {
      fill: '0xeeeeee',
      fontSize: '24px',
    })
    this.startButton.position.x = Globals.width / 2
    this.startButton.position.y = Globals.height / 2
    this.startButton.anchor.set(0.5, 0.5)

    this.startButton.interactive = true
    this.startButton.buttonMode = true
    this.container.addChild(this.startButton)
  }

  createSelectStageButton(stageName, position) {
    this.stageButton = new PIXI.Text(stageName, {
      fill: '0xeeeeee',
      fontSize: '24px',
    })
    this.stageButton.position.x = 0
    this.stageButton.position.y = position * 30

    this.stageButton.interactive = true
    this.stageButton.buttonMode = true
    this.container.addChild(this.stageButton)

    this.stageButton.on('pointerdown', () => {
      this.selectStage(stageName)
    })
  }

  async createIntro() {
    this._createBackground()
    this.createStartButton()
    this.createSelectStageButton('snake', 1)
    this.createSelectStageButton('balance', 2)
    this.createSelectStageButton('run', 3)
    this.createSelectStageButton('candy', 4)

    const startFilmScript = async () => {
      if (this.filmScriptStep === 0) {
        this.container.removeChild(this.startButton)
        this.startButton.buttonMode = false

        for (let i = 0; i < this.filmScript.length; i++) {
          this.filmScriptStep++

          const filmScript = this.filmScript[i]
          await filmScript()
        }
      } else {
        this.startButton.removeAllListeners()
      }
    }

    // start film script
    this.startButton.on('pointerdown', startFilmScript)
  }

  async startStory() {
    console.log('startStory')
    this.player = new Player({
      x: Globals.width / 2,
      y: Globals.height / 2,
    })
    this.ground = new Ground({
      x: Globals.width / 2,
      y: Globals.height / 2 + 58,
      isDarkGreen: true,
    })
    this.spotlight = new Spotlight({
      x: Globals.width / 2,
      y: Globals.height - 110,
    })
    this.taiwan = new Taiwan({
      x: Globals.width / 2,
      y: Globals.height / 2,
    })
    this.doctor = new Doctor({
      x: Globals.width / 2,
      y: 0,
    })

    await wait(1000)
    this.container.addChild(
      this.taiwan.container,
      this.spotlight.sprite,
      this.ground.sprite,
      this.doctor.sprite,
      this.player.sprite
    )
    this.taiwan.container.alpha = 0
    this.player.sprite.alpha = 0
    this.ground.sprite.alpha = 0
    this.spotlight.sprite.alpha = 0
    this.doctor.sprite.alpha = 0
    this.doctor.fall()

    // first fade in
    return new Promise((resolve) => {
      const initShowUpTicker = new PIXI.Ticker()

      initShowUpTicker.add(async () => {
        console.log('initShowUpTicker')
        if (this.player.sprite.alpha <= 0.5) {
          this.player.sprite.alpha += 0.01
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
    this.player.sprite.alpha = 1
    this.ground.sprite.alpha = 1
    this.taiwan.container.alpha = 0.1

    const blurFilter = new PIXI.filters.BlurFilter()
    this.taiwan.container.filters = [blurFilter]

    await this.playerSay({ text: '!', time: 1000 })
  }

  async lookAround() {
    console.log('lookAround')
    await this.player.lookAround()
    await this.playerSay({
      text: '?',
      time: 2000,
      x: Globals.width / 2 - 100,
    })
  }

  async movePlayerToGround() {
    // this.container.addChild(ground.sprite)
    console.log('movePlayerToGround')

    return new Promise((resolve) => {
      const movePlayerToGroundTicker = new PIXI.Ticker()

      movePlayerToGroundTicker.add(async () => {
        if (this.ground.sprite.y <= this.getGroundPosition()) {
          moveDown(this.player.sprite)
          moveDown(this.ground.sprite)
        }

        if (this.taiwan.container.y >= Globals.height / 4 + 100) {
          moveUp(this.taiwan.container)
          this.taiwan.container.filters.pop()
        }

        if (this.taiwan.container.alpha <= 0.3) {
          this.taiwan.container.alpha += 0.005
        }

        if (this.ground.sprite.y >= this.getGroundPosition()) {
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
    this.spotlight.sprite.y = this.getGroundPosition()
    await wait(70)
    this.spotlight.sprite.alpha = 0.3
    await wait(70)
    this.spotlight.sprite.alpha = 0.1
    await wait(40)
    this.spotlight.sprite.alpha = 0.5
    await wait(70)
    this.spotlight.sprite.alpha = 0
    await wait(400)

    console.log('spotlightOn')
    this.spotlight.sprite.alpha = 0.8

    await this.playerSay({
      text: '!?',
      time: 3000,
      y: Globals.height - 299,
      talkerY: Globals.height - 155,
    })
  }

  async doctorDrop() {
    console.log('doctorDrop')

    return new Promise((resolve) => {
      const doctorDropTicker = new PIXI.Ticker()

      doctorDropTicker.add(async () => {
        if (this.doctor.sprite.alpha < 1) {
          this.doctor.sprite.alpha += 0.1
        }
        // console.log(this.ground.sprite.y)
        if (this.doctor.sprite.y <= this.getGroundPosition() - 55) {
          moveDown(this.doctor.sprite)
          this.doctor.sprite.angle += 4
        }
        if (this.player.sprite.x >= Globals.width / 2 - 50) {
          moveLeft(this.player.sprite)
        }

        if (this.doctor.sprite.y >= this.getGroundPosition() - 55) {
          doctorDropTicker.destroy()
          await wait(1000)
          resolve()
        }
      })

      doctorDropTicker.start()

      function moveDown(sprite) {
        sprite.y += 3
      }

      function moveLeft(sprite) {
        sprite.x -= 1
      }
    })
  }

  async positionCharacters() {
    this.doctor.stand()

    return new Promise((resolve) => {
      const positionCharactersTicker = new PIXI.Ticker()

      positionCharactersTicker.add(async () => {
        console.log('positionCharactersTicker')

        if (this.player.sprite.y <= Globals.height - 110) {
          this.player.sprite.x -= 0.8
          this.player.sprite.y += 2
        }
        if (this.doctor.sprite.y <= Globals.height - 138) {
          this.doctor.sprite.y += 0.5
        }

        if (this.doctor.sprite.x >= Globals.width / 2 - 111) {
          this.doctor.sprite.x -= 2.1
        }

        if (this.spotlight.sprite.alpha > 0) {
          this.spotlight.sprite.alpha -= 0.1
        }

        if (
          this.player.sprite.y >= Globals.height - 110 &&
          this.doctor.sprite.y >= Globals.height - 138 &&
          this.doctor.sprite.x <= Globals.width / 2 - 111
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

          await wait(400)
          resolve()
        }
      })

      taiwanShowUpTicker.start()
    })
  }

  async doctorExplain() {
    console.log('doctorExplain')

    await this.doctorSay({
      fontSize: 16,
      text: '經營村莊的不二法門，就是別讓村民不開心，但村子久了總是會出現一些狀況，像是垃圾變多、公共設備損壞，你的任務就是要幫我解決問題。',
      x: Globals.width / 2 - 327 / 2,
      y: Globals.height - 130 - 182 - 80,
      talkerX: Globals.width / 2 - 80,
      talkerY: Globals.height - 130,
      width: 327,
      height: 182,
    })
  }

  async chosenHandler(chosen) {
    console.log('choosed ' + chosen)

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
      console.log('play game')
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
          x: Globals.width / 2 - 327 / 2,
          y: Globals.height - 130 - 182 - 80,
          talkerX: Globals.width / 2 - 80,
          talkerY: Globals.height - 130,
          width: 327,
          height: 182,
        })
      } else {
        await this.playerSay(
          {
            fontSize: 16,
            text: '幹！都不玩！',
            x: Globals.width / 2 - 327 / 2,
            y: Globals.height - 130 - 182 - 80,
            talkerX: Globals.width / 2 - 80,
            talkerY: Globals.height - 130,
            width: 327,
            height: 182,
          },
          2000
        )
        this.container.removeAllListeners()
      }
    }
  }

  async playerSay({
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
    this.playerDialogBox = new DialogBox({
      x,
      y,
      talkerX,
      talkerY,
      width,
      height,
      text,
      fontSize,
    })
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
    this.doctorDialogBox = new DoctorDialogBox({
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

  getGroundPosition() {
    return (Globals.height * 3) / 4 > Globals.height - 108
      ? (Globals.height * 3) / 4
      : Globals.height - 108
  }
}

function wait(delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delayTime)
  })
}
