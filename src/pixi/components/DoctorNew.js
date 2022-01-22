import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class Doctor {
  constructor(position = { x: 0, y: 0, scale: 1 }) {
    this.scale = position.scale
    this.createDoctor()
    this.x = position.x
    this.y = position.y
    this.setupPosition()
    this.status = 'falling'
  }

  createDoctor() {
    const texture = new PIXI.Texture(Globals.resources['doctorStand']?.texture)
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
    this.sprite.width *= this.scale
    this.sprite.height *= this.scale

    // save character's size to Globals
    Globals.doctorWidth = this.sprite.width
    Globals.doctorHeight = this.sprite.height
  }

  setupPosition() {
    this.sprite.x = this.x
    this.sprite.y = this.y
  }

  fall() {
    const texture = new PIXI.Texture(Globals.resources['doctor']?.texture)
    this.sprite.texture = texture
    this.sprite.angle = 0
  }
  stand() {
    const texture = new PIXI.Texture(Globals.resources['doctorStand']?.texture)

    this.sprite.texture = texture
    this.sprite.angle = 0
  }
}
