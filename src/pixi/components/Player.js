import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class Player {
  constructor() {
    this.createSprite()
  }

  createSprite() {
    const texture = Globals.resources['player']?.texture
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
  }
}
