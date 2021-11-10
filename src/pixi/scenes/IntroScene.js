import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Player } from '../components/Player'
import { DialogBox } from '../components/DialogBox'
import { Ground } from '../components/Ground'
import { Spotlight } from '../components/Spotlight'
import { Doctor } from '../components/Doctor'
import { Taiwan } from '../components/Taiwan'
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
        await wait(1000)

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

    this.container.addChild(
      this.taiwan.container,
      this.spotlight.sprite,
      this.ground.sprite,
      this.player.sprite
    )
    this.taiwan.container.alpha = 0
    this.player.sprite.alpha = 0
    this.ground.sprite.alpha = 0
    this.spotlight.sprite.alpha = 0

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
    this.doctor = new Doctor({
      x: Globals.width / 2,
      y: 0,
    })
    this.container.addChild(this.doctor.sprite)
    this.doctor.sprite.alpha = 0

    Globals.app.ticker.add(() => {
      if (this.doctor.sprite.alpha < 1) {
        this.doctor.sprite.alpha += 0.1
      }
      if (this.doctor.sprite.y <= Globals.height - 168) {
        moveDown(this.doctor.sprite)
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

  async playerSay({
    text,
    time = 1000,
    x = Globals.width / 2 + 20,
    y = Globals.height / 2 - 150,
    talkerX = Globals.width / 2,
    talkerY = Globals.height / 2,
    width = 100,
    height = 72,
  }) {
    this.playerDialogBox = new DialogBox({
      x,
      y,
      talkerX,
      talkerY,
      width,
      height,
      text,
    })
    this.container.addChild(this.playerDialogBox.container)

    return new Promise((resolve) => {
      setTimeout(() => {
        this.container.removeChild(this.playerDialogBox.container)
        resolve()
      }, time)
    })
  }

  async doctorExplain(text) {
    console.log('doctorExplain')
    console.log(text)
    await wait(1000)
  }
}

function wait(delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delayTime)
  })
}
