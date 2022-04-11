import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import gaHandler from '../../gaHandler'

export class UnlockButton {
  constructor(callback = () => {}, cityIndex) {
    this.callback = callback
    this.cityIndex = cityIndex
    this.container = new PIXI.Container()
    this.createButton()
    this.createLockIcon()
    // this.activeListener()
  }

  createButton() {
    const text = new PIXI.Text('玩遊戲解鎖', {
      fill: ['0xffffff'],
      fontSize: 14,
      align: 'center',
    })

    const background = new PIXI.Graphics()
    background.beginFill(0x3b6bd5)
    const padding = 5
    background.drawRect(
      0,
      0,
      text.width + padding * 2,
      text.height + padding * 2
    )
    background.endFill()

    text.x = padding
    text.y = padding

    background.addChild(text)
    this.container.addChild(background)

    this.container.buttonMode = true
    this.container.interactive = true
  }

  createLockIcon() {
    const lockTexture = new PIXI.Texture(Globals.resources['lock'].texture)
    const lockSprite = new PIXI.Sprite(lockTexture)

    lockSprite.width = 23.84
    lockSprite.height = 34.5
    lockSprite.y = -lockSprite.height - 10
    lockSprite.x = (this.container.width - lockSprite.width) / 2
    this.container.addChild(lockSprite)
  }

  activeListener(cityName) {
    this.container.addListener('pointerdown', () => {
      gaHandler.gaClickHandler(`${cityName}/area/game`)
      this.container.removeAllListeners()
      this.callback()
    })
  }
}
