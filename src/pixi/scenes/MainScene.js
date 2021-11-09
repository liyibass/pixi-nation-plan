import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Player } from '../components/Player'

export class MainScene {
  constructor() {
    this.container = new PIXI.Container()

    // this.createBackground()
    this.createPlayer()
  }

  createBackground() {
    console.log(Globals)

    this.bg = new Player()
    this.container.addChild(this.bg.sprite)
  }

  createPlayer() {
    const player = new Player({ x: Globals.width / 2, y: Globals.height / 2 })
    this.container.addChild(player.sprite)

    // player.sprite.x = Globals.width / 2
    // player.sprite.y = Globals.height / 2
  }
}
