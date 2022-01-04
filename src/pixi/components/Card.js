import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { CardFolder } from './CardFolder'
import { CardHeader } from './CardHeader'

const cardDimention = Globals.getCardDimention()

const CARD_MARGIN = 12

// const CARD_HEADER_TITLE_HEIGHT = CARD_HEADER_HEIGHT * 0.5

export class Card {
  constructor(index = 0) {
    this.index = index
    this.cityName = this._getCityName(this.index)
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
    const buttonSprite = new PIXI.Sprite(buttonTexture)
    this.container.addChild(buttonSprite)
    buttonSprite.x = cardDimention.width - buttonSprite.width - CARD_MARGIN
    buttonSprite.y = CARD_MARGIN
    buttonSprite.buttonMode = true
    buttonSprite.interactive = true
  }

  createHeader() {
    this.header = new CardHeader('新北市', this._changeCityHandler.bind(this))
    this.container.addChild(this.header.container)
  }

  _changeCityHandler(choose) {
    console.log(choose)
  }

  createTab() {
    const headerHeight = this.header.container.y + this.header.container.height
    const margin = 15
    const folderHeight = cardDimention.height - headerHeight - margin
    const cardFolder = new CardFolder(folderHeight)
    this.container.addChild(cardFolder.container)
    cardFolder.container.y = headerHeight + margin
  }

  _getCityName(currentCityIndex) {
    switch (currentCityIndex) {
      case 0:
        return 'Taipei'
      case 1:
        return 'Taoyuan'
      case 3:
        return 'Hsinchu'
      case 4:
        return 'Miaoli'
      case 5:
        return 'Taizhong'
      case 6:
        return 'Zhanghua'
      case 7:
        return 'Yunlin'
      case 8:
        return 'Jiayi'
      case 9:
        return 'Tainan'
      case 10:
        return 'Kaohsiung'
      case 11:
        return 'Pingdong'
      case 12:
        return 'Taidong'
      case 13:
        return 'Hualian'
      case 14:
        return 'Yilan'
      case 15:
        return 'Nantou'
    }
  }
}
