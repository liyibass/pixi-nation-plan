import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { TwoButtons } from './TwoButtons'
import { Stop } from './Stop'

export class GameFail extends Stop {
  constructor(chooseHandler, button1Setting, button2Setting) {
    super(chooseHandler, button1Setting, button2Setting)
    this.init()
  }

  async init() {
    this.createMask()
    await this.showDocument()
    this.createTwoButtons()
  }

  async showDocument() {
    this.docGroup = new PIXI.Container()
    this.container.addChild(this.docGroup)
    await this.createDocument()
    await this.wait(500)
    await this.createStamp()
    await this.wait(500)
    await this.createWording()
  }

  createDocument() {
    const texture = Globals.resources['docIcon'].texture
    const docSprite = new PIXI.Sprite(texture)
    // docSprite.anchor.set(0.5, 0.5)
    docSprite.x = 0
    docSprite.y = 0

    docSprite.scale.set(1.5, 1.5)
    this.docGroup.addChild(docSprite)

    this.docGroup.x = this.container.width / 2 - this.docGroup.width / 2
    this.docGroup.y = Globals.height / 2 - this.docGroup.height

    const createDocumentTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      createDocumentTicker.add(() => {
        if (docSprite.scale.x > 1) {
          docSprite.scale.x -= 0.05
          docSprite.scale.y -= 0.05
          this.docGroup.x = (this.container.width - docSprite.width) / 2
          this.docGroup.y = Globals.height / 2 - docSprite.height
        } else {
          createDocumentTicker.destroy()
          resolve()
        }
      })

      createDocumentTicker.start()
    })
  }

  createStamp() {
    const texture = Globals.resources['stampFailed'].texture
    const stampSprite = new PIXI.Sprite(texture)

    stampSprite.x = this.docGroup.width * 0.15
    stampSprite.y = this.docGroup.height * 0.2

    stampSprite.scale.set(1.2, 1.2)
    this.docGroup.addChild(stampSprite)

    const createStampTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      createStampTicker.add(() => {
        if (stampSprite.scale.x > 1) {
          stampSprite.scale.x -= 0.05
          stampSprite.scale.y -= 0.05
        } else {
          createStampTicker.destroy()
          resolve()
        }
      })

      createStampTicker.start()
    })
  }

  createWording() {
    const wording = new PIXI.Text('闖關失敗！', {
      align: 'center', // 對齊
      fontSize: 16,
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: 80,
      fill: ['0x000000'],
    })

    wording.x = this.docGroup.width * 0.28
    wording.y = this.docGroup.height * 0.65

    wording.angle = -9.56
    this.docGroup.addChild(wording)

    const mask = new PIXI.Graphics()
    mask.beginFill(0x988888)
    mask.drawRect(0, 0, wording.width, wording.height)
    mask.endFill()
    mask.width = 0

    wording.mask = mask
    wording.addChild(mask)

    const wordingMaskTicker = new PIXI.Ticker()
    return new Promise((resolve) => {
      wordingMaskTicker.add(() => {
        if (mask.width < wording.width) {
          mask.width += 3
        } else {
          wordingMaskTicker.destroy()
          resolve()
        }
      })
      wordingMaskTicker.start()
    })
  }
}
