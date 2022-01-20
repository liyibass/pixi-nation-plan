import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class ScrollHint {
  constructor(target) {
    this.container = new PIXI.Container()

    this.container.name = 'ScrollHint'
    this.createScrollHint(target)
  }

  createScrollHint(target) {
    const { tx, ty } = target?.container?.worldTransform ||
      target?.worldTransform || { tx: 50, ty: 50 }

    this.container.x = tx
    this.container.y = ty - 20

    const arrowTexture = new PIXI.Texture(
      Globals.resources['scrollHintArrow']?.texture
    )
    const handTexture = new PIXI.Texture(
      Globals.resources['scrollHintHand']?.texture
    )
    const arrowSprite = new PIXI.Sprite(arrowTexture)
    this.handSprite = new PIXI.Sprite(handTexture)

    const scale = 50 / handTexture.width
    arrowSprite.scale.set(scale, scale)
    this.handSprite.scale.set(scale, scale)

    arrowSprite.anchor.set(0, 1)
    this.handSprite.anchor.set(0, 1)
    this.handSprite.x = this.handSprite.width / 4
    this.container.addChild(arrowSprite, this.handSprite)

    this.container.x = target?.width / 2
    this.container.y = (target?.height * 3) / 5

    this.startScrollHintTicker()
  }

  startScrollHintTicker() {
    let direction = 'down'
    this.scrollHintTicker = new PIXI.Ticker()

    this.scrollHintTicker.add(() => {
      if (direction === 'down') {
        if (this.handSprite.y < this.handSprite.height / 3) {
          this.handSprite.y += 0.5

          if (this.handSprite.y >= this.handSprite.height / 3) direction = 'up'
        }
      } else {
        if (this.handSprite.y > 0) {
          this.handSprite.y -= 0.5

          if (this.handSprite.y <= 0) {
            direction = 'down'
          }
        }
      }
    })

    this.scrollHintTicker.start()
  }

  stopScrollHintTicker() {
    this.scrollHintTicker.stop()
  }
}
