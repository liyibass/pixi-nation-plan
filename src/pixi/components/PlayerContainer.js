import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class Player {
  constructor() {
    this.container = new PIXI.Container()
    this.createPlayer()
  }

  createPlayer() {
    console.log(this.container)
    const texture = Globals.resources['player']?.texture
    const sprite = new PIXI.Sprite(texture)
    sprite.anchor.set(0.5, 0.5)
    this.container.addChild(sprite)
  }
}
