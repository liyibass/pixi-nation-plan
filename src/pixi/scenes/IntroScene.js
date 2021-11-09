import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Player } from '../components/Player'

export class IntroScene {
  constructor() {
    this.container = new PIXI.Container()
    this.container.interactive = true
    this.container.visible = true

    this.filmScript = [
      this.startStory.bind(this),
      this.lookAround.bind(this),
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

  createIntro() {
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
  }

  startStory() {
    console.log('startStory')
    this.player = new Player({ x: Globals.width / 2, y: Globals.height / 2 })

    this.container.addChild(this.player.sprite)
    this.player.sprite.x = this.container.width / 2
    this.player.sprite.y = this.container.height / 2
  }
  async lookAround() {
    console.log('lookAround')

    await playerLookAround(this.player.sprite, 600)
    await playerLookAround(this.player.sprite, 600)

    function playerLookAround(sprite, delayTime) {
      return new Promise((resolve) => {
        setTimeout(() => {
          sprite.scale.x *= -1
          resolve()
        }, delayTime)
      })
    }
  }
  spotlightOn() {
    console.log('spotlightOn')
  }
  doctorExplain(text) {
    console.log('doctorExplain')
    console.log(text)
  }
}
