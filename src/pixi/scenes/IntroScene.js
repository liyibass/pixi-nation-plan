import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Player } from '../components/Player'
import { DialogBox } from '../components/DialogBox'
export class IntroScene {
  constructor() {
    this.container = new PIXI.Container()
    this.container.interactive = true
    this.container.visible = true

    this.filmScript = [
      this.startStory.bind(this),
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
    this.player = new Player({ x: Globals.width / 2, y: Globals.height / 2 })

    this.container.addChild(this.player.sprite)
    this.player.sprite.x = this.container.width / 2
    this.player.sprite.y = this.container.height / 2
    await this.playerSay('!')
    await wait(600)
  }

  async lookAround() {
    console.log('lookAround')
    await this.player.lookAround()
    await this.playerSay('?', 2000)
  }

  async playerSay(text, time = 1000) {
    this.playerDialogBox = new DialogBox({
      x: 200,
      y: 250,
      talkerX: this.container.width / 2,
      talkerY: this.container.height / 2,
      width: 100,
      height: 72,
      text: text,
    })
    this.container.addChild(this.playerDialogBox.container)

    return new Promise((resolve) => {
      setTimeout(() => {
        this.container.removeChild(this.playerDialogBox.container)
        resolve()
      }, time)
    })
  }

  async movePlayerToGround() {
    Globals.app.ticker.add(() => {
      if (this.player.sprite.y <= 700) {
        moveDown(this.player.sprite)
      } else if (this.player.sprite.x >= 100) {
        moveLeft(this.player.sprite)
      }
    })
    await wait(1000)

    function moveDown(sprite) {
      sprite.y += 5
    }
    function moveLeft(sprite) {
      sprite.x -= 5
    }
  }

  async spotlightOn() {
    console.log('spotlightOn')
    await wait(1000)
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
