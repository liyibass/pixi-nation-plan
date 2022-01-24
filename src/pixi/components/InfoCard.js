import * as PIXI from 'pixi.js'
import { CardFolder } from './CardFolder'
import { CardHeader } from './CardHeader'
import { Globals } from '../script/Globals'
import { infoCard } from '../script/CityData'
import { sound } from '@pixi/sound'

const cardDimention = Globals.getCardDimention()

const CARD_MARGIN = 12

export class InfoCard {
  constructor(exitCallback = () => {}) {
    this.exitCallback = exitCallback
    this.cityData = infoCard

    this.container = new PIXI.Container()
    this.container.name = 'card'

    this.landCityIcon = new PIXI.Container()

    this.createCard()
    this.activeListener()
  }

  playClickMusic() {
    sound.play('click')
  }

  createCard() {
    this.createBackgroundLayer()
    this.createBody()
    this.createOverallMask()
    this.createHeader()
    this.createTab()
  }

  createBackgroundLayer() {
    // cardDimention
    // background
    this.backgroundLayer = new PIXI.Graphics()
    this.backgroundLayer.beginFill(0xff0000)
    this.backgroundLayer.drawRect(0, 0, window.innerWidth, window.innerHeight)
    this.backgroundLayer.endFill()

    this.backgroundLayer.buttonMode = true
    this.backgroundLayer.interactive = true
    this.backgroundLayer.alpha = 0

    this.container.addChild(this.backgroundLayer)

    this.backgroundLayer.addListener('pointerdown', () => {
      this.exitInfoCard()
    })

    this.cardContainer = new PIXI.Container()
    this.cardContainer.x = cardDimention.x
    this.cardContainer.y = cardDimention.y
    this.cardContainer.buttonMode = true
    this.cardContainer.interactive = true
    this.container.addChild(this.cardContainer)
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

    this.cardContainer.addChild(cardBackground)

    // exit button
    const buttonTexture = new PIXI.Texture(Globals.resources['exit']?.texture)
    this.exitButtonSprite = new PIXI.Sprite(buttonTexture)
    this.cardContainer.addChild(this.exitButtonSprite)
    this.exitButtonSprite.x =
      cardDimention.width - this.exitButtonSprite.width - CARD_MARGIN
    this.exitButtonSprite.y = CARD_MARGIN
    this.exitButtonSprite.buttonMode = true
    this.exitButtonSprite.interactive = true
  }

  createOverallMask() {
    const overallMask = new PIXI.Graphics()
    overallMask.beginFill(0xcc8053)
    overallMask.drawRoundedRect(
      0,
      0,
      cardDimention.width,
      cardDimention.height,
      21
    )
    overallMask.endFill()

    this.cardContainer.mask = overallMask
    this.cardContainer.addChild(overallMask)
  }

  createHeader() {
    this.header = new CardHeader(0, null, true)
    this.cardContainer.addChild(this.header.container)
  }

  createTab() {
    const headerHeight = this.header.container.y + this.header.container.height
    const margin = 15
    const folderHeight = cardDimention.height - headerHeight - margin

    this.cardFolder = new CardFolder(0, this.cityData, folderHeight, true)
    this.cardContainer.addChild(this.cardFolder.container)
    this.cardFolder.container.y = headerHeight + margin * 2
  }

  activeListener() {
    this.activeCardExitButton()
    this.cardFolder.activeListener()
  }

  activeCardExitButton() {
    this.exitButtonSprite.buttonMode = true
    this.exitButtonSprite.interactive = true

    this.exitButtonSprite.addListener('pointerdown', () => {
      this.exitInfoCard()
      // this.stopAllProcess()
    })
  }

  exitInfoCard() {
    this.playClickMusic()
    this.stopAllProcess()
    this.container.parent.removeChild(this.container)

    if (this.exitCallback) {
      this.exitCallback()
    }
  }

  stopAllProcess() {
    console.log('stopAllProcess')
    this.cardFolder.stopAllProcess()
    this.exitButtonSprite.removeAllListeners()
    this.backgroundLayer.removeAllListeners()
  }
}
