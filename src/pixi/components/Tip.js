import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { ScrollHint } from './ScrollHint'
// import { Globals } from '../script/Globals'

export class Tip {
  constructor() {}

  createPointerTip(target) {
    const { tx, ty } = target?.container?.worldTransform ||
      target?.worldTransform || { tx: 0, ty: 0 }
    this.pointerTipContainer = new PIXI.Container()
    this.pointerTipContainer.x = tx
    this.pointerTipContainer.y = ty - 40

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
    // const { tx, ty } = target?.container?.worldTransform ||
    //   target?.worldTransform || { tx: 50, ty: 50 }
    this.scrollHint = new ScrollHint(target)
    this.scrollHintContainer = this.scrollHint.container
  }
}
