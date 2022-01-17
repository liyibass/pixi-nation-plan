import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'

export class Tip {
  constructor() {}

  createPointerTip(target) {
    const { tx, ty } = target?.container?.worldTransform ||
      target?.worldTransform || { tx: 0, ty: 0 }
    this.pointerTipContainer = new PIXI.Container()
    this.pointerTipContainer.x = tx
    this.pointerTipContainer.y = ty - 20

    const headTexture = new PIXI.Texture(Globals.resources['tipHead']?.texture)
    const fingerTexture = new PIXI.Texture(
      Globals.resources['tipHeadFinger']?.texture
    )
    const headSprite = new PIXI.Sprite(headTexture)
    this.fingerSprite = new PIXI.Sprite(fingerTexture)

    const scale = 30 / headSprite.width
    headSprite.scale.set(scale, scale)
    this.fingerSprite.scale.set(scale, scale)

    headSprite.anchor.set(0, 1)
    this.fingerSprite.anchor.set(0, 1)
    this.fingerSprite.x = -this.fingerSprite.width / 2 + 5
    this.pointerTipContainer.addChild(headSprite, this.fingerSprite)

    this.startPointerTipTicker()
  }

  startPointerTipTicker() {
    let direction = 'down'
    this.pointerTipTicker = new PIXI.Ticker()

    this.pointerTipTicker.add(() => {
      if (direction === 'down') {
        if (this.fingerSprite.y < this.fingerSprite.height / 3) {
          this.fingerSprite.y += 0.2

          if (this.fingerSprite.y >= this.fingerSprite.height / 3)
            direction = 'up'
        }
      } else {
        if (this.fingerSprite.y > 0) {
          this.fingerSprite.y -= 0.2

          if (this.fingerSprite.y <= 0) {
            direction = 'down'
          }
        }
      }
    })

    this.pointerTipTicker.start()
  }

  createScrollHint(target) {
    const { tx, ty } = target?.container?.worldTransform ||
      target?.worldTransform || { tx: 50, ty: 50 }
    this.scrollHintContainer = new PIXI.Container()
    this.scrollHintContainer.x = tx
    this.scrollHintContainer.y = ty - 20

    const arrowTexture = new PIXI.Texture(
      Globals.resources['scrollHintArrow']?.texture
    )
    const handTexture = new PIXI.Texture(
      Globals.resources['scrollHintHand']?.texture
    )
    const arrowSprite = new PIXI.Sprite(arrowTexture)
    this.handSprite = new PIXI.Sprite(handTexture)

    const scale = 30 / handTexture.width
    arrowSprite.scale.set(scale, scale)
    this.handSprite.scale.set(scale, scale)

    arrowSprite.anchor.set(0, 1)
    this.handSprite.anchor.set(0, 1)
    this.handSprite.x = -this.handSprite.width / 2 + 5
    this.scrollHintContainer.addChild(arrowSprite, this.handSprite)

    this.startScrollHintTicker()
  }

  startScrollHintTicker() {
    let direction = 'down'
    this.scrollHintTicker = new PIXI.Ticker()

    this.scrollHintTicker.add(() => {
      if (direction === 'down') {
        if (this.handSprite.y < this.handSprite.height / 3) {
          this.handSprite.y += 0.2

          if (this.handSprite.y >= this.handSprite.height / 3) direction = 'up'
        }
      } else {
        if (this.handSprite.y > 0) {
          this.handSprite.y -= 0.2

          if (this.handSprite.y <= 0) {
            direction = 'down'
          }
        }
      }
    })

    this.scrollHintTicker.start()
  }
}
