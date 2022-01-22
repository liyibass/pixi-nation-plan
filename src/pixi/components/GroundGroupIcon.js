import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Status, CityStatusArray } from '../script/Status'
import { InfoCard } from './InfoCard'

// const groundDimention = Globals.getGroundDimention()
const fontRatio = window.innerHeight / 812
const fontSize = Math.floor(16 * fontRatio)

export class GroundGroupIcon {
  constructor(iconIndex) {
    this.container = new PIXI.Container()
    this.container.name = 'icon'
    this.iconIndex = iconIndex
    this.currentCount = getCount(this.iconIndex)
    this.totalCount = getTotalCount(iconIndex)

    this.createGroundGroupIcon()
    this.createText()
    this.startAnimationTicker()
  }

  createGroundGroupIcon() {
    // icon
    const texture = new PIXI.Texture(
      Globals.resources[`icon_${this.iconIndex}`].texture
    )
    this.iconSprite = new PIXI.Sprite(texture)
    this.iconSprite.width *= Globals.textureScale
    this.iconSprite.height *= Globals.textureScale
    this.iconSprite.anchor.set(0.5, 1)
    this.container.addChild(this.iconSprite)
  }

  createText() {
    // text
    const textContainer = new PIXI.Container()

    if (this.iconIndex !== 2) {
      this.currentCountText = new PIXI.Text(`${this.currentCount}`, {
        fill: ['0xffffff'],
        fontSize,
      })

      this.totalCountText = new PIXI.Text(`/${this.totalCount}`, {
        fill: ['0xffffff'],
        fontSize,
      })
      this.totalCountText.alpha = 0.5
      this.totalCountText.x = this.currentCountText.width

      textContainer.addChild(this.currentCountText, this.totalCountText)
    } else {
      const title = new PIXI.Text(`國土計畫`, {
        fill: ['0xffffff'],
        fontSize,
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

  activeListener(enterCallback, exitCallback) {
    if (this.iconIndex !== 2) return

    this.container.interactive = true
    this.container.buttonMode = true

    this.container.addListener('pointerdown', () => {
      const infoCard = new InfoCard(exitCallback)
      const topParent = this.container.parent.parent.parent

      topParent.addChild(infoCard.container)

      if (enterCallback) {
        enterCallback?.()
      }
    })
  }

  deactiveListener() {
    this.container.removeAllListeners()
  }

  removeTicker() {
    this.animationTicker?.stop?.()
  }
}

function getTotalCount(index) {
  switch (index) {
    case 0:
      return 4

    case 1:
      return CityStatusArray.length

    default:
    case 2:
      return null
  }
}

function getCount(iconIndex) {
  let acc = 0
  switch (iconIndex) {
    case 0:
      // game
      for (const key in Status) {
        if (Object.hasOwnProperty.call(Status, key)) {
          const element = Status[key]

          if (element?.isCleared) {
            acc++
          }
        }
      }
      return acc

    default:
    case 1:
      // city
      CityStatusArray.forEach((city) => {
        if (city?.isUnlockAll) {
          acc++
        }
      })
      return acc
  }
}
