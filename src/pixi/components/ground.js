import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class Ground {
  constructor(args = { x: 0, y: 0, isDarkGreen: true }) {
    this.isDarkGreen = args.isDarkGreen
    this.createGround()
    this.x = args.x
    this.y = args.y
    this.setupPosition()
  }

  createGround() {
    let texture
    if (this.isDarkGreen) {
      texture = Globals.resources['groundDarkGreen']?.texture
    } else {
      texture = Globals.resources['groundBrown']?.texture
    }
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
  }

  setupPosition() {
    this.sprite.x = this.x
    this.sprite.y = this.y
  }
}
