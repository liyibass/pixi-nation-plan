import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class Player {
  constructor(position = { x: 0, y: 0 }) {
    this.createSprite()
    this.sprite.x = position.x
    this.sprite.y = position.y
  }

  createSprite() {
    const texture = Globals.resources['player']?.texture

    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
  }
}
