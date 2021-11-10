import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Player } from '../components/Player'
import { DialogBox } from '../components/DialogBox'
import { Ground } from '../components/Ground'
import { Spotlight } from '../components/Spotlight'
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

  async createIntro() {
    this.createBackground()

    // player.sprite.x = Globals.width / 2
    // player.sprite.y = Globals.height / 2
    // this.startStory()

    // start film script
    this.container.on('mousedown', () => {
      if (this.filmScriptStep < this.filmScript.length) {
        this.filmScript[this.filmScriptStep]()
        this.filmScriptStep++
      } else {
        this.container.removeAllListeners()
      }
    })
    await wait(2000)
    for (let i = 0; i < this.filmScript.length; i++) {
      const filmScript = this.filmScript[i]
      await filmScript()
    }
  }

  async startStory() {
    console.log('startStory')
    this.player = new Player({
      x: this.container.width / 2,
      y: this.container.height / 2,
    })
    this.ground = new Ground({
      x: this.container.width / 2,
      y: this.container.height / 2 + 58,
    })
    this.spotlight = new Spotlight({
      x: this.container.width / 2,
      y: this.container.height - 110,
    })
    this.container.addChild(
      this.spotlight.sprite,
      this.ground.sprite,
      this.player.sprite
    )

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

    await this.playerSay({ text: '!', time: 1000 })
  }

  async lookAround() {
    console.log('lookAround')
    await this.player.lookAround()
    await this.playerSay({
      text: '?',
      time: 2000,
      x: this.container.width / 2 - 100,
    })
  }

  async movePlayerToGround() {
    // this.container.addChild(ground.sprite)

    Globals.app.ticker.add(() => {
      if (this.ground.sprite.y <= this.container.height - 108) {
        moveDown(this.player.sprite)
        moveDown(this.ground.sprite)
      } else if (this.player.sprite.x >= 100) {
        // moveLeft(this.player.sprite)
      }
    })
    await wait(1500)

    function moveDown(sprite) {
      sprite.y += 3
    }
    // function moveLeft(sprite) {
    //   sprite.x -= 5
    // }
  }

  async spotlightOn() {
    console.log('spotlightOn')
    this.spotlight.sprite.alpha = 1

    await this.playerSay({
      text: '!?',
      time: 3000,
      y: this.container.height - 299,
      talkerY: this.container.height - 155,
    })

    await wait(1000)
  }

  async doctorDrop() {
    console.log('doctorDrop')
  }

  async playerSay({
    text,
    time = 1000,
    x = this.container.width / 2 + 20,
    y = this.container.height / 2 - 150,
    talkerX = this.container.width / 2,
    talkerY = this.container.height / 2,
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
