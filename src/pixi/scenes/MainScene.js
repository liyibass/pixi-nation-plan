import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Player } from '../components/Player'
import { IntroScene } from './IntroScene'

export class MainScene {
  constructor() {
    this.container = new PIXI.Container()

    this.createBackground()
    // this.createPlayer()
    this.createIntroScene()
  }

  createBackground() {}

  createPlayer() {
    const player = new Player({ x: Globals.width / 2, y: Globals.height / 2 })
    this.container.addChild(player.sprite)

    // player.sprite.x = Globals.width / 2
    // player.sprite.y = Globals.height / 2
  }

  createIntroScene() {
    const introScene = new IntroScene()
    this.container.addChild(introScene.container)
  }
}
