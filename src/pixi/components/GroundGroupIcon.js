import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { InfoCard } from './InfoCard'

// const groundDimention = Globals.getGroundDimention()

export class GroundGroupIcon {
  constructor(iconIndex) {
    this.container = new PIXI.Container()
    this.container.name = 'icon'
    this.iconIndex = iconIndex
    this.currentCount = 0
    this.totalCount = getTotalCount(iconIndex)

    this.createGroundGroupIcon()
    this.createText()
    this.activeListener()
    this.startAnimationTicker()
  }

  createGroundGroupIcon() {
    // icon
    const texture = new PIXI.Texture(
      Globals.resources[`icon_${this.iconIndex}`].texture
    )
    this.iconSprite = new PIXI.Sprite(texture)
    this.iconSprite.pivot.set(this.iconSprite.width / 2, this.iconSprite.height)
    this.container.addChild(this.iconSprite)
  }

  createText() {
    // text
    const textContainer = new PIXI.Container()

    if (this.iconIndex !== 2) {
      this.currentCountText = new PIXI.Text(`${this.currentCount}`, {
        fill: ['0xffffff'],
        fontSize: 15,
      })

      this.totalCountText = new PIXI.Text(`/${this.totalCount}`, {
        fill: ['0xffffff'],
        fontSize: 15,
      })
      this.totalCountText.alpha = 0.5
      this.totalCountText.x = this.currentCountText.width

      textContainer.addChild(this.currentCountText, this.totalCountText)
    } else {
      const title = new PIXI.Text(`國土計畫`, {
        fill: ['0xffffff'],
        fontSize: 15,
      })

      textContainer.addChild(title)
    }

    textContainer.x = -textContainer.width / 2
    textContainer.y = 5
    this.container.addChild(textContainer)

    // position
  }

  startAnimationTicker() {
    if (this.iconIndex !== 2) return

    this.animationTicker = new PIXI.Ticker()
    this.animationTicker.add(() => {})
  }

  activeListener() {
    if (this.iconIndex !== 2) return

    this.container.interactive = true
    this.container.buttonMode = true

    this.container.addListener('pointerdown', () => {
      console.log('show info')
      const infoCard = new InfoCard()
      const topParent = this.container.parent.parent.parent

      topParent.addChild(infoCard.container)
    })
  }
}

function getTotalCount(index) {
  switch (index) {
    case 0:
      return 4

    case 1:
      return 21

    default:
    case 2:
      return null
  }
}
