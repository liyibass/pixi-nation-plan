import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class Ground {
  constructor(
    args = {
      x: 0,
      y: 0,
      isDarkGreen: true,
      groundGroupDimention: {
        x: 448.5,
        y: 895.3333333333334,
        groundHeight: 82.5911330049261,
        groundWidth: 262.4926108374384,
      },
    }
  ) {
    this.isDarkGreen = args.isDarkGreen
    this.groundGroupDimention = args.groundGroupDimention
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

    this.scale = this.groundGroupDimention.groundWidth / this.sprite.width
    this.sprite.width = this.groundGroupDimention?.groundWidth
    this.sprite.height = this.groundGroupDimention?.groundHeight

    this.sprite.anchor.set(0.5, 0.5)
  }

  setupPosition() {
    this.sprite.x = this.x
    this.sprite.y = this.y
  }

  getSpriteScale() {
    return this.scale
  }
}
