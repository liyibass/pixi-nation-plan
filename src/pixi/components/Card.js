import * as PIXI from 'pixi.js'
import { CardFolder } from './CardFolder'
import { CardHeader } from './CardHeader'
import { Globals } from '../script/Globals'
import { cityDataArray } from '../script/CityData'
import { sound } from '@pixi/sound'

const cardDimention = Globals.getCardDimention()

const CARD_MARGIN = 12

export class Card {
  constructor(chooseGameHandler) {
    this.chooseGameHandler = chooseGameHandler
    this.cityIndex = 0
    this.cityData =
      cityDataArray.find((cityData) => cityData.cityIndex === this.cityIndex) ||
      cityDataArray[0]

    this.container = new PIXI.Container()
    this.container.name = 'card'
    // this.container.x = cardDimention.x
    // this.container.y = cardDimention.y

    this.landCityIcon = new PIXI.Container()

    this.container.visible = false
    this.createCard()
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
    cardBackground.beginFill(0xcc8053)
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

  stopAllProcess() {
    this.header.stopAllProcess()
    this.cardFolder.stopAllProcess()
  }

  createHeader() {
    this.header = new CardHeader(0, this._changeCityHandler.bind(this))
    this.cardContainer.addChild(this.header.container)
  }

  _changeCityHandler(choose) {
    console.log('_changeCityHandler')
    if (choose === 'prev') {
      this.cityIndex = this.cityIndex !== 0 ? this.cityIndex - 1 : 17
    } else {
      this.cityIndex = this.cityIndex !== 17 ? this.cityIndex + 1 : 0
    }
    this.header.updateCity(this.cityIndex)
    this.cardFolder.updateCity(
      cityDataArray.find((cityData) => cityData.cityIndex === this.cityIndex) ||
        cityDataArray[0]
    )
    // this.cardFolder.activeListener()
  }

  createTab() {
    const headerHeight = this.header.container.y + this.header.container.height
    const margin = 15
    const folderHeight = cardDimention.height - headerHeight - margin

    this.cardFolder = new CardFolder(
      0,
      this.cityData,
      folderHeight,
      false,
      this.chooseGameHandler
    )
    this.cardContainer.addChild(this.cardFolder.container)
    this.cardFolder.container.y = headerHeight + margin
  }

  _getCityName(currentCityIndex) {
    switch (currentCityIndex) {
      case 0:
        return '新北市'
      // case 1:
      //   return '臺北市'
      case 1:
        return '桃園市'
      case 2:
        return '新竹縣'
      case 3:
        return '新竹市'
      case 4:
        return '苗栗縣'
      case 5:
        return '台中市'
      case 6:
        return '彰化縣'
      case 7:
        return '雲林縣'
      case 8:
        return '嘉義縣'
      case 9:
        return '臺南市'
      case 10:
        return '高雄市'
      case 11:
        return '屏東縣'
      case 12:
        return '臺東縣'
      case 13:
        return '花蓮縣'
      case 14:
        return '宜蘭縣'
      case 15:
        return '基隆市'
      case 16:
        return '南投縣'
      case 17:
        return '澎湖縣'
    }
  }

  showCityInfo(selectedCity = { cityIndex: 0 }) {
    this.container.visible = true
    this.container.interactive = true

    this.backgroundLayer.addListener('pointerdown', () => {
      this.hideCardInfo()
    })

    this.header.updateCity(selectedCity.cityIndex)
    this.cardFolder.updateCity(
      cityDataArray.find(
        (cityData) => cityData.cityIndex === selectedCity.cityIndex
      ) || cityDataArray[0]
    )
  }

  hideCardInfo() {
    this.container.visible = false
    this.backgroundLayer.removeAllListeners()
  }

  activeCardExitButton() {
    this.exitButtonSprite.buttonMode = true
    this.exitButtonSprite.interactive = true
    this.exitButtonSprite.addListener('pointerdown', () => {
      this.playClickMusic()
      // this.stopAllProcess()
      this.hideCardInfo()
      // this.container.parent.removeChild(this.container)
    })
  }

  activeListener() {
    console.log('active Card Listener')
    this.activeCardExitButton()
    this.header.activeListener()
    this.cardFolder.activeTabListenOnly()
  }
}
