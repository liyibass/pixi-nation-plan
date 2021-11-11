import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class Doctor {
  constructor(position = { x: 0, y: 0 }) {
    this.createDoctor()
    this.x = position.x
    this.y = position.y
    this.setupPosition()
    this.status = 'falling'
  }

  createDoctor() {
    const texture = Globals.resources['doctor']?.texture
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
  }

  setupPosition() {
    this.sprite.x = this.x
    this.sprite.y = this.y
  }

  stand() {
    const texture = Globals.resources['doctorStand']?.texture

    this.sprite.texture = texture
    this.sprite.angle = 0
  }
}
