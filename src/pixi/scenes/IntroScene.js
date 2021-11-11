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
  constructor() {
    this.container = new PIXI.Container()
    this.container.interactive = true
    this.container.visible = true

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
  }

  createBackground() {
    let graphics = new PIXI.Graphics()
    graphics.lineStyle(4, 0x00000, 1)
    graphics.beginFill(0x000000)
    graphics.drawRect(0, 0, Globals.width, Globals.height)
    graphics.endFill()

    this.container.addChild(graphics)
  }

  createStartButton() {
    this.startButton = new PIXI.Text('點擊開始', {
      fill: '0xeeeeee',
      fontSize: '24px',
    })
    this.startButton.position.x = Globals.width / 2
    this.startButton.position.y = Globals.height / 2
    this.startButton.anchor.set(0.5, 0.5)
    this.container.addChild(this.startButton)
  }

  async createIntro() {
    this.createBackground()
    this.createStartButton()
    this.container.buttonMode = true

    // start film script
    this.container.on('mousedown', async () => {
      if (this.filmScriptStep === 0) {
        this.container.removeChild(this.startButton)
        this.container.buttonMode = false

        for (let i = 0; i < this.filmScript.length; i++) {
          this.filmScriptStep++

          const filmScript = this.filmScript[i]
          await filmScript()
        }
      } else {
        this.container.removeAllListeners()
      }
    })
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

    Globals.app.ticker.add(() => {
      if (this.player.sprite.alpha <= 0.5) {
        this.player.sprite.alpha += 0.01
        this.ground.sprite.alpha += 0.01
      }
    })
    await wait(2000)
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

    Globals.app.ticker.add(() => {
      if (this.ground.sprite.y <= Globals.height - 108) {
        moveDown(this.player.sprite)
        moveDown(this.ground.sprite)
      }

      if (this.taiwan.container.y >= Globals.height / 2 - 100) {
        moveUp(this.taiwan.container)
        this.taiwan.container.filters.pop()
      }

      if (this.taiwan.container.alpha <= 0.3) {
        this.taiwan.container.alpha += 0.005
      }
    })
    await wait(1500)

    function moveDown(sprite) {
      sprite.y += 3
    }
    function moveUp(sprite) {
      sprite.y -= 2
    }
  }

  async spotlightOn() {
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

    Globals.app.ticker.add(() => {
      if (this.doctor.sprite.alpha < 1) {
        this.doctor.sprite.alpha += 0.1
      }
      if (this.doctor.sprite.y <= Globals.height - 168) {
        moveDown(this.doctor.sprite)
        this.doctor.sprite.angle += 4
      }
      if (this.player.sprite.x >= Globals.width / 2 - 50) {
        moveLeft(this.player.sprite)
      }
    })
    function moveDown(sprite) {
      sprite.y += 3
    }

    function moveLeft(sprite) {
      sprite.x -= 1
    }

    await wait(4000)
  }

  async positionCharacters() {
    this.spotlight.sprite.alpha = 0
    this.doctor.stand()

    Globals.app.ticker.add(() => {
      if (this.player.sprite.y <= Globals.height - 110) {
        this.player.sprite.x -= 0.8
        this.player.sprite.y += 2
      }
      if (this.doctor.sprite.y <= Globals.height - 138) {
        this.doctor.sprite.x -= 2.1
        this.doctor.sprite.y += 0.5
      }
    })

    await wait(1000)
  }

  async taiwanShowUp() {
    Globals.app.ticker.add(() => {
      if (this.taiwan.container.alpha <= 1) {
        this.taiwan.container.alpha += 0.05
      }
    })

    await wait(2000)
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

    await wait(1000)
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
}

function wait(delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delayTime)
  })
}
