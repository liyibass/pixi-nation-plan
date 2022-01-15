import * as PIXI from 'pixi.js'
import { CardFolder } from './CardFolder'
import { CardHeader } from './CardHeader'
import { Globals } from '../script/Globals'
import { cityDataArray } from '../script/CityData'

const cardDimention = Globals.getCardDimention()

const CARD_MARGIN = 12

export class Card {
  constructor(index = 0) {
    this.cityIndex = index
    this.cityData = cityDataArray[this.cityIndex] || cityDataArray[0]

    this.container = new PIXI.Container()
    this.container.name = 'card'
    this.container.x = cardDimention.x
    this.container.y = cardDimention.y

    this.landCityIcon = new PIXI.Container()

    this.createCard()
    this.container.visible = false
  }

  createCard() {
    this.createBody()
    this.createHeader()
    this.createTab()
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

    this.container.addChild(cardBackground)

    // exit button
    const buttonTexture = new PIXI.Texture(Globals.resources['exit']?.texture)
    this.exitButtonSprite = new PIXI.Sprite(buttonTexture)
    this.container.addChild(this.exitButtonSprite)
    this.exitButtonSprite.x =
      cardDimention.width - this.exitButtonSprite.width - CARD_MARGIN
    this.exitButtonSprite.y = CARD_MARGIN
  }

  stopAllProcess() {
    this.header.stopAllProcess()
    this.cardFolder.stopAllProcess()
  }

  createHeader() {
    this.header = new CardHeader(0, this._changeCityHandler.bind(this))
    this.container.addChild(this.header.container)
  }

  _changeCityHandler(choose) {
    if (choose === 'prev') {
      this.cityIndex = this.cityIndex !== 0 ? this.cityIndex - 1 : 16
    } else {
      this.cityIndex = this.cityIndex !== 16 ? this.cityIndex + 1 : 0
    }
    this.header.updateCity(this.cityIndex)
    this.cardFolder.updateCity(
      cityDataArray[this.cityIndex] || cityDataArray[0]
    )
  }

  createTab() {
    const headerHeight = this.header.container.y + this.header.container.height
    const margin = 15
    const folderHeight = cardDimention.height - headerHeight - margin

    this.cardFolder = new CardFolder(0, this.cityData, folderHeight)
    this.container.addChild(this.cardFolder.container)
    this.cardFolder.container.y = headerHeight + margin
  }

  _getCityName(currentCityIndex) {
    switch (currentCityIndex) {
      case 0:
        return '新北市'
      case 1:
        return '臺北市'
      case 2:
        return '桃園市'
      case 3:
        return '新竹縣'
      case 4:
        return '新竹市'
      case 5:
        return '苗栗縣'
      case 6:
        return '台中市'
      case 7:
        return '彰化市'
      case 8:
        return '雲林縣'
      case 9:
        return '嘉義縣'
      case 10:
        return '臺南市'
      case 11:
        return '高雄市'
      case 12:
        return '屏東縣'
      case 13:
        return '臺東縣'
      case 14:
        return '花蓮縣'
      case 15:
        return '宜蘭縣'
      case 16:
        return '基隆市'
      case 17:
        return '南投縣'
      case 18:
        return '澎湖縣'
      case 19:
        return '連江縣'
      case 20:
        return '金門縣'
    }
  }

  showCityInfo(selectedCity = { index: 0 }) {
    this.container.visible = true
    this.container.interactive = true

    this.header.updateCity(selectedCity.index)
    this.cardFolder.updateCity(
      cityDataArray[selectedCity.index] || cityDataArray[0]
    )
  }

  hideCardInfo() {
    this.container.visible = false
  }

  activeCardExitButton() {
    this.exitButtonSprite.buttonMode = true
    this.exitButtonSprite.interactive = true
    this.exitButtonSprite.addListener('pointerdown', () => {
      // this.stopAllProcess()
      this.hideCardInfo()
      // this.container.parent.removeChild(this.container)
    })
  }

  activeListener() {
    this.activeCardExitButton()
    this.header.activeListener()
    // this.cardFolder.activeListener()
  }
}
