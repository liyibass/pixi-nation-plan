import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const cardDimention = Globals.getCardDimention()

const CARD_MARGIN = 12
const CARD_CONTENT_WIDTH = cardDimention.width - 2 * CARD_MARGIN
const CARD_HEADER_HEIGHT = Math.floor(cardDimention.height * 0.32)
const CARD_HEADER_LAND_CITY_HEIGHT = CARD_HEADER_HEIGHT * 0.5
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
    // header container init setting
    const headerContainer = new PIXI.Container()
    headerContainer.name = 'header'

    const landCityIconContainer = new PIXI.Container()
    const titleContainer = new PIXI.Container()
    headerContainer.addChild(landCityIconContainer, titleContainer)
    headerContainer.x = CARD_MARGIN
    headerContainer.y = CARD_MARGIN

    this.container.addChild(headerContainer)

    // landCity
    const landCityTexture = new PIXI.Texture(
      Globals.resources[`land_city_0`]?.texture
    )
    const landCitySprite = new PIXI.Sprite(landCityTexture)
    const ratio = CARD_HEADER_LAND_CITY_HEIGHT / landCitySprite.height
    landCitySprite.width *= ratio
    landCitySprite.height *= ratio

    landCityIconContainer.addChild(landCitySprite)

    // landCity position
    landCityIconContainer.x =
      (cardDimention.width - 2 * CARD_MARGIN - landCityIconContainer.width) / 2
    landCityIconContainer.y = 20

    // title
    const titleText = new PIXI.Text(`新北市`, {
      fill: ['0xffffff'],
      fontSize: 36,
    })
    titleContainer.addChild(titleText)

    // titleBar
    const titleBar1 = new Bar()
    const titleBar2 = new Bar()
    titleContainer.addChild(titleBar1.graphics, titleBar2.graphics)
    titleBar1.graphics.width = titleText.width
    titleBar2.graphics.width = titleText.width

    // title's inner position
    titleText.y = titleBar1.graphics.height
    titleBar2.graphics.y = titleText.y + titleText.height

    // arrows
    const arrow1 = new Arrow(0)
    const arrow2 = new Arrow(1)
    titleContainer.addChild(arrow1.container, arrow2.container)

    // whole title position
    titleContainer.x = 0
    // (cardDimention.width - 2 * CARD_MARGIN - titleContainer.width) / 2
    titleContainer.y =
      landCityIconContainer.y + landCityIconContainer.height + 23
    arrow1.container.y = (titleContainer.height - arrow1.container.height) / 2
    arrow2.container.y = (titleContainer.height - arrow2.container.height) / 2
    arrow2.container.x = CARD_CONTENT_WIDTH
    titleText.x = (CARD_CONTENT_WIDTH - titleText.width) / 2
    titleBar1.graphics.x = (CARD_CONTENT_WIDTH - titleText.width) / 2
    titleBar2.graphics.x = (CARD_CONTENT_WIDTH - titleText.width) / 2
  }

  createTab() {}

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

class Bar {
  constructor() {
    this.graphics = new PIXI.Graphics()
    this.createBar()
  }
  createBar() {
    this.graphics.beginFill(0xffffff)
    this.graphics.drawRect(0, 0, 110, 6)
    this.graphics.endFill()
  }
}

class Arrow {
  constructor(index = 0) {
    this.container = new PIXI.Container()
    this.container.buttonMode = true
    this.container.interactive = true
    this.direction = index === 0 ? 'left' : 'right'
    this.createArrow()
  }
  createArrow() {
    const arrowTexture = new PIXI.Texture(Globals.resources['arrow']?.texture)
    const arrowSprite = new PIXI.Sprite(arrowTexture)
    this.container.addChild(arrowSprite)
    arrowSprite.anchor.set(0, 0.5)

    if (this.direction === 'right') {
      arrowSprite.scale.x = -1
    }
  }
}
