import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class Tiger {
  constructor() {
    this.container = new PIXI.Container()
    this.createTiger()
  }

  createTiger() {
    const textureArray = []

    for (let i = 0; i < 4; i++) {
      const texture = Globals.resources[`tiger_${i}`]?.texture
      textureArray.push(texture)
    }

    this.tigerSprite = new PIXI.AnimatedSprite(textureArray)
    this.tigerSprite.animationSpeed = 0.3
    this.container.addChild(this.tigerSprite)
    this.tigerSprite.anchor.set(0.5, 1)

    this.tigerSprite.play()
  }
}
