import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const cardDimention = Globals.getCardDimention()

const CARD_MARGIN = 12
const CARD_CONTENT_WIDTH = cardDimention.width - 2 * CARD_MARGIN
const CARD_HEADER_HEIGHT = Math.floor(cardDimention.height * 0.32)
const CARD_HEADER_LAND_CITY_HEIGHT = CARD_HEADER_HEIGHT * 0.5
// const CARD_HEADER_TITLE_HEIGHT = CARD_HEADER_HEIGHT * 0.5

export class CardHeader {
  constructor(cityName = '新北市', changeCityHandler) {
    this.cityName = cityName
    this.changeCityHandler = changeCityHandler

    this.container = new PIXI.Container()
    this.container.name = 'cardHeader'

    this.landCityIcon = new PIXI.Container()

    this.createHeader()
  }

  createHeader() {
    // header container init setting
    this.landCityIconContainer = new PIXI.Container()
    this.titleSectionContainer = new PIXI.Container()
    this.container.addChild(
      this.landCityIconContainer,
      this.titleSectionContainer
    )
    this.container.x = CARD_MARGIN
    this.container.y = CARD_MARGIN

    this.createLandCity()
    this.createTitleSection()

    // // whole title position
    // titleContainer.x = 0
    // // (cardDimention.width - 2 * CARD_MARGIN - titleContainer.width) / 2
    // titleContainer.y =
    //   landCityIconContainer.y + landCityIconContainer.height + 23

    // titleText.x = (CARD_CONTENT_WIDTH - titleText.width) / 2
    // titleBar1.graphics.x = (CARD_CONTENT_WIDTH - titleText.width) / 2
    // titleBar2.graphics.x = (CARD_CONTENT_WIDTH - titleText.width) / 2
  }

  createLandCity() {
    // landCity
    const landCityTexture = new PIXI.Texture(
      Globals.resources[`land_city_0`]?.texture
    )
    const landCitySprite = new PIXI.Sprite(landCityTexture)
    const ratio = CARD_HEADER_LAND_CITY_HEIGHT / landCitySprite.height
    landCitySprite.width *= ratio
    landCitySprite.height *= ratio

    this.landCityIconContainer.addChild(landCitySprite)

    // landCity position
    this.landCityIconContainer.x =
      (CARD_CONTENT_WIDTH - this.landCityIconContainer.width) / 2
    this.landCityIconContainer.y = 20
  }

  createTitleSection() {
    this.createTitle()
    this.createArrow()

    this.titleSectionContainer.y =
      this.landCityIconContainer.y + this.landCityIconContainer.height + 23
  }

  createTitle() {
    const titleContainer = new PIXI.Container()
    // title
    this.titleText = new PIXI.Text(`新北市`, {
      fill: ['0xffffff'],
      fontSize: 36,
    })
    titleContainer.addChild(this.titleText)

    // titleBar
    const titleBar1 = new Bar()
    const titleBar2 = new Bar()
    titleContainer.addChild(titleBar1.graphics, titleBar2.graphics)

    titleBar1.graphics.width = this.titleText.width
    titleBar2.graphics.width = this.titleText.width

    // title's inner position
    this.titleText.y = titleBar1.graphics.height
    titleBar2.graphics.y = this.titleText.y + this.titleText.height

    this.titleSectionContainer.addChild(titleContainer)

    titleContainer.x = (CARD_CONTENT_WIDTH - titleContainer.width) / 2
  }

  createArrow() {
    // arrows
    const arrow1 = new Arrow(0)
    const arrow2 = new Arrow(1)
    this.titleSectionContainer.addChild(arrow1.container, arrow2.container)

    arrow1.container.y =
      (this.titleSectionContainer.height - arrow1.container.height) / 2
    arrow2.container.y =
      (this.titleSectionContainer.height - arrow2.container.height) / 2
    arrow2.container.x = CARD_CONTENT_WIDTH

    arrow1.container.addListener('pointerdown', () => {
      this.changeCityHandler('prev')
    })
    arrow2.container.addListener('pointerdown', () => {
      this.changeCityHandler('next')
    })
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
