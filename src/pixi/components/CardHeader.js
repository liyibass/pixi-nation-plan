import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { sound } from '@pixi/sound'

const cardDimention = Globals.getCardDimention()

const CARD_MARGIN = 12
const CARD_CONTENT_WIDTH = cardDimention.width - 2 * CARD_MARGIN
const CARD_HEADER_HEIGHT = cardDimention.cardHearderHeight
const CARD_HEADER_LAND_CITY_HEIGHT = CARD_HEADER_HEIGHT * 0.5
// const CARD_HEADER_TITLE_HEIGHT = CARD_HEADER_HEIGHT * 0.5

export class CardHeader {
  constructor(cityIndex = 0, changeCityHandler, isInfoCard = false) {
    this.cityIndex = cityIndex
    this.changeCityHandler = changeCityHandler
    this.isInfoCard = isInfoCard

    this.container = new PIXI.Container()
    this.container.name = 'cardHeader'

    this.landCityIcon = new PIXI.Container()

    this.createHeader()
  }

  playClickMusic() {
    sound.play('click')
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
    this.container.y = CARD_MARGIN + 20

    this.createLandCity()
    this.createTitleSection()
  }

  createLandCity() {
    if (this.isInfoCard) return

    // landCity
    const landCityTexture = new PIXI.Texture(
      Globals.resources[`land_${this.cityIndex}_1`]?.texture
    )
    const landCitySprite = new PIXI.Sprite(landCityTexture)
    let smaller = 1
    if (this.cityIndex === 3 || this.cityIndex === 15) {
      smaller = 0.5
    }
    const heightRatio =
      (CARD_HEADER_LAND_CITY_HEIGHT / landCitySprite.height) * smaller

    landCitySprite.width *= heightRatio
    landCitySprite.height *= heightRatio

    this.landCityIconContainer.removeChildren()
    this.landCityIconContainer.addChild(landCitySprite)

    // landCity position
    this.landCityIconContainer.x =
      (CARD_CONTENT_WIDTH - this.landCityIconContainer.width) / 2
    // this.landCityIconContainer.y = 20
    this.landCityIconContainer.y =
      (CARD_HEADER_LAND_CITY_HEIGHT - this.landCityIconContainer.height) / 2
  }

  createTitleSection() {
    this.createTitle()
    this.createArrow()

    this.titleSectionContainer.y =
      this.landCityIconContainer.y + this.landCityIconContainer.height + 23
  }

  createTitle() {
    this.titleContainer = new PIXI.Container()
    // title
    this.titleText = new PIXI.Text(this._getCityName(this.cityIndex), {
      fill: ['0xffffff'],
      fontSize: cardDimention.titleFontSize,
      wordWrap: true,
      breakWords: !this.isInfoCard,
      wordWrapWidth: 190,
      align: 'center',
    })
    this.titleContainer.addChild(this.titleText)

    // titleBar
    const titleBar1 = new Bar()
    const titleBar2 = new Bar()
    if (this.isInfoCard) {
      titleBar1.graphics.alpha = 0
      titleBar2.graphics.alpha = 0
    }
    this.titleContainer.addChild(titleBar1.graphics, titleBar2.graphics)

    titleBar1.graphics.width = this.titleText.width
    titleBar2.graphics.width = this.titleText.width

    // title's inner position
    this.titleText.y = titleBar1.graphics.height
    titleBar2.graphics.y = this.titleText.y + this.titleText.height

    this.titleSectionContainer.addChild(this.titleContainer)

    this.titleContainer.x = (CARD_CONTENT_WIDTH - this.titleContainer.width) / 2
  }

  updateCity(newCityIndex) {
    this.cityIndex = newCityIndex
    this.titleText.text = this._getCityName(newCityIndex)

    this.createLandCity()
  }

  createArrow() {
    if (this.isInfoCard) return
    // arrows
    this.arrow1 = new Arrow(0, this.titleContainer.height)
    this.arrow2 = new Arrow(1, this.titleContainer.height)
    this.arrowArray = [this.arrow1, this.arrow2]
    this.titleSectionContainer.addChild(
      this.arrow1.container,
      this.arrow2.container
    )

    this.arrow1.container.y =
      (this.titleSectionContainer.height - this.arrow1.container.height) / 2
    this.arrow2.container.y =
      (this.titleSectionContainer.height - this.arrow2.container.height) / 2
    this.arrow2.container.x = CARD_CONTENT_WIDTH
  }

  stopAllProcess() {
    if (this.isInfoCard) return

    this.arrowArray.forEach((arrow) => {
      arrow.container.removeAllListeners()
    })
  }

  _getCityName(currentCityIndex) {
    if (this.isInfoCard) {
      return '什麼是 「國土計畫」'
    }
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

  activeListener() {
    this.arrow1.container.buttonMode = true
    this.arrow1.container.interactive = true
    this.arrow2.container.buttonMode = true
    this.arrow2.container.interactive = true
    this.arrow1.container.addListener('pointerdown', () => {
      this.playClickMusic()
      this.changeCityHandler('prev')
    })
    this.arrow2.container.addListener('pointerdown', () => {
      this.playClickMusic()
      this.changeCityHandler('next')
    })
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
  constructor(index = 0, activeRegionHeight) {
    this.container = new PIXI.Container()
    this.activeRegionHeight = activeRegionHeight

    this.direction = index === 0 ? 'left' : 'right'
    this.createActiveRegion()
    this.createArrow()
  }
  createActiveRegion() {
    const activeRegion = new PIXI.Graphics()
    activeRegion.beginFill(0xff0000)
    activeRegion.drawRect(0, 0, 100, this.activeRegionHeight)
    activeRegion.endFill()
    activeRegion.alpha = 0
    this.container.addChild(activeRegion)
    if (this.direction === 'right') {
      activeRegion.x = -activeRegion.width
    }
  }
  createArrow() {
    const arrowTexture = new PIXI.Texture(Globals.resources['arrow']?.texture)
    const arrowSprite = new PIXI.Sprite(arrowTexture)
    this.container.addChild(arrowSprite)
    arrowSprite.anchor.set(0, 0.5)

    arrowSprite.y = this.activeRegionHeight / 2

    if (this.direction === 'right') {
      arrowSprite.scale.x = -1
    }
  }
}
