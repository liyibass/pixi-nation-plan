import * as PIXI from 'pixi.js'
import { CardFolder } from './CardFolder'
import { CardHeader } from './CardHeader'
import { Globals } from '../script/Globals'
import { infoCard } from '../script/CityData'

const cardDimention = Globals.getCardDimention()

const CARD_MARGIN = 12

export class InfoCard {
  constructor(exitCallback = () => {}) {
    this.exitCallback = exitCallback
    this.cityData = infoCard

    this.container = new PIXI.Container()
    this.container.name = 'card'
    this.container.x = cardDimention.x
    this.container.y = cardDimention.y

    this.landCityIcon = new PIXI.Container()

    this.createCard()
  }

  createCard() {
    this.createBody()
    this.createHeader()
    this.createTab()
  }

  createBody() {
    // background
    const cardBackground = new PIXI.Graphics()
    cardBackground.beginFill(0x000000)
    cardBackground.drawRoundedRect(
      0,
      0,
      cardDimention.width,
      cardDimention.height,
      21
    )
    cardBackground.endFill()

    this.container.addChild(cardBackground)

    // exit button
    const buttonTexture = new PIXI.Texture(Globals.resources['exit']?.texture)
    const buttonSprite = new PIXI.Sprite(buttonTexture)
    this.container.addChild(buttonSprite)
    buttonSprite.x = cardDimention.width - buttonSprite.width - CARD_MARGIN
    buttonSprite.y = CARD_MARGIN
    buttonSprite.buttonMode = true
    buttonSprite.interactive = true

    buttonSprite.addListener('pointerdown', () => {
      this.stopAllProcess()

      this.container.parent.removeChild(this.container)

      if (this.exitCallback) {
        this.exitCallback()
      }
    })
  }

  stopAllProcess() {
    this.header.stopAllProcess()
    this.cardFolder.stopAllProcess()
  }

  createHeader() {
    this.header = new CardHeader(0, null, true)
    this.container.addChild(this.header.container)
  }

  createTab() {
    const headerHeight = this.header.container.y + this.header.container.height
    const margin = 15
    const folderHeight = cardDimention.height - headerHeight - margin

    this.cardFolder = new CardFolder(0, this.cityData, folderHeight, true)
    this.container.addChild(this.cardFolder.container)
    this.cardFolder.container.y = headerHeight + margin * 2
    this.cardFolder.activeListener()
  }
}
