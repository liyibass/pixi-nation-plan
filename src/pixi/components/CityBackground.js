import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
const gameStageDimention = Globals.getRunGameStageDimention()
const proximateCityWidth = gameStageDimention.width * 2

export class CityBackground {
  constructor(cityName) {
    this.cityName = cityName
    this.container = new PIXI.Container()
    this.container.name = `cityBackground-${this.cityName}`

    this.bottomLayerContainer = new PIXI.Container()

    this.createCityBackground()
    this.optimize()
  }

  createCityBackground() {
    switch (this.cityName) {
      case 'Taoyuan':
        this._createTaoyuan()

        break

      case 'Hsinchu':
        this._createHsinchu()
        break

      case 'Miaoli':
        this._createMiaoli()
        break

      case 'Yunlin':
        this._createYunlin()
        break

      case 'Kaohsiung':
        this._createKaohsiung()
        break

      case 'Mountain':
        this._createMountain()
        break

      case 'Yilan':
        this._createYilan()
        break

      default:
        break
    }
  }

  _createTaoyuan() {
    const factoryTexture = new PIXI.Texture(
      Globals.resources[`factory1`].texture
    )
    const factoryCount = Math.floor(proximateCityWidth / factoryTexture.width)

    for (let i = 0; i < factoryCount; i++) {
      const factoryTexture = new PIXI.Texture(
        Globals.resources[`factory${Math.floor(i % 3) + 1}`].texture
      )
      const factorySprite = new PIXI.Sprite(factoryTexture)
      factorySprite.pivot.set(0, factorySprite.height)

      factorySprite.x =
        factorySprite.width + this.container.width + Math.random() * 40 + 20
      factorySprite.y = gameStageDimention.height

      this.container.addChild(factorySprite)
    }
  }

  _createHsinchu() {
    const castleTexture = new PIXI.Texture(Globals.resources['castle'].texture)
    const castleSprite = new PIXI.Sprite(castleTexture)
    castleSprite.pivot.set(0, castleSprite.height)
    castleSprite.y = gameStageDimention.height

    this.container.addChild(castleSprite)

    const cityBackgroundTexture = new PIXI.Texture(
      Globals.resources['cityBackground'].texture
    )
    const cityBackgroundSprite = new PIXI.Sprite(cityBackgroundTexture)
    cityBackgroundSprite.pivot.set(0, cityBackgroundSprite.height)
    cityBackgroundSprite.y = gameStageDimention.height
    cityBackgroundSprite.x = castleSprite.width

    this.container.addChild(cityBackgroundSprite)
  }

  _createMiaoli() {
    const highwayTexture = new PIXI.Texture(
      Globals.resources['highway'].texture
    )
    const HIGHWAY_COUNT = Math.round(proximateCityWidth / highwayTexture.width)

    for (let i = 0; i < HIGHWAY_COUNT; i++) {
      const highwaySprite = new PIXI.Sprite(highwayTexture)
      highwaySprite.pivot.y = highwaySprite.height
      highwaySprite.x = this.container.width
      highwaySprite.y = gameStageDimention.height
      this.container.addChild(highwaySprite)
    }

    const TOTAL_BUSH = 2 * HIGHWAY_COUNT + 1

    for (let j = 0; j < TOTAL_BUSH; j++) {
      const bushTexture = new PIXI.Texture(
        Globals.resources[`bush${(j % 2) + 1}`].texture
      )
      const bushSprite = new PIXI.Sprite(bushTexture)
      bushSprite.pivot.y = bushSprite.height

      bushSprite.x =
        (this.container.width / (TOTAL_BUSH - 1)) * j +
        (Math.random() * 70 - 35)

      const bushYOffset = Math.floor(Math.random() * 30)
      bushSprite.y = gameStageDimention.height + bushYOffset

      this.container.addChild(bushSprite)

      this._addMaskToObstacle(bushSprite, bushYOffset)
    }
  }

  _createYunlin() {
    const buildingTexture = new PIXI.Texture(
      Globals.resources[`building`].texture
    )
    const TOTAL_BUILDING = Math.floor(
      proximateCityWidth / (buildingTexture.width + 50)
    )

    for (let j = 0; j < TOTAL_BUILDING; j++) {
      const buildingSprite = new PIXI.Sprite(buildingTexture)
      buildingSprite.pivot.y = buildingSprite.height

      buildingSprite.x =
        (proximateCityWidth / TOTAL_BUILDING) * j + (Math.random() * 100 - 50)
      const buildingYOffset = Math.floor(Math.random() * 40) + 10
      buildingSprite.y = gameStageDimention.height + buildingYOffset

      this.container.addChild(buildingSprite)

      this._addMaskToObstacle(buildingSprite, buildingYOffset)
    }
  }

  _createKaohsiung() {
    const cityBackgroundTexture = new PIXI.Texture(
      Globals.resources['cityBackground2'].texture
    )
    const cityBackgroundSprite = new PIXI.Sprite(cityBackgroundTexture)
    cityBackgroundSprite.pivot.set(0, cityBackgroundSprite.height)
    cityBackgroundSprite.y = gameStageDimention.height

    this.container.addChild(cityBackgroundSprite)

    const eightyFiveTexture = new PIXI.Texture(
      Globals.resources['eightyFive'].texture
    )
    const eightyFiveSprite = new PIXI.Sprite(eightyFiveTexture)
    eightyFiveSprite.pivot.set(0, eightyFiveSprite.height)
    eightyFiveSprite.y = gameStageDimention.height
    eightyFiveSprite.x = (cityBackgroundSprite.width * 2) / 3

    this.container.addChild(eightyFiveSprite)
  }

  _createMountain() {
    const mountainTexture = new PIXI.Texture(
      Globals.resources['mountain'].texture
    )
    const MOUNTAIN_COUNT = Math.round(
      proximateCityWidth / mountainTexture.width / 2
    )

    for (let i = 0; i < MOUNTAIN_COUNT; i++) {
      const mountainSprite = new PIXI.Sprite(mountainTexture)
      mountainSprite.pivot.y = mountainSprite.height
      mountainSprite.x = this.container.width - Math.floor(Math.random() * 100)
      const mountainYOffset = Math.floor(Math.random() * 20)
      mountainSprite.y = gameStageDimention.height + mountainYOffset
      this.container.addChild(mountainSprite)

      this._addMaskToObstacle(mountainSprite, mountainYOffset)
    }
  }

  _createYilan() {
    const mountainTexture = new PIXI.Texture(
      Globals.resources['mountain'].texture
    )
    const MOUNTAIN_COUNT = Math.round(
      proximateCityWidth / (mountainTexture.width + 200)
    )

    for (let i = 0; i < MOUNTAIN_COUNT; i++) {
      const mountainSprite = new PIXI.Sprite(mountainTexture)
      mountainSprite.pivot.y = mountainSprite.height
      mountainSprite.x = this.container.width + Math.floor(Math.random() * 100)
      const mountainYOffset = Math.floor(Math.random() * 20)
      mountainSprite.y = gameStageDimention.height + mountainYOffset

      this.container.addChild(mountainSprite)

      this._addMaskToObstacle(mountainSprite, mountainYOffset)
    }

    const TOTAL_HOTEL = 2 * MOUNTAIN_COUNT + 1

    for (let j = 0; j < TOTAL_HOTEL; j++) {
      const hotelContainer = new PIXI.Container()

      // farm
      const farmTexture = new PIXI.Texture(Globals.resources['farm']?.texture)
      const farmSprite = new PIXI.Sprite(farmTexture)
      farmSprite.pivot.y = farmSprite.height - 23

      // hotel
      const hotelTexture = new PIXI.Texture(
        Globals.resources[`hotel${j % 4}`].texture
      )
      const hotelSprite = new PIXI.Sprite(hotelTexture)
      hotelSprite.pivot.y = hotelSprite.height
      hotelSprite.y = hotelSprite.height

      // mask
      const hotelMask = new PIXI.Graphics()
      hotelMask.beginFill(0x000000, 0)
      hotelMask.drawRect(0, 0, hotelSprite.width, hotelSprite.height)
      hotelMask.endFill()
      hotelMask.pivot.y = hotelMask.height
      hotelContainer.mask = hotelMask

      hotelContainer.addChild(hotelSprite, farmSprite, hotelMask)

      this.container.addChild(hotelContainer)

      hotelContainer.x =
        (this.container.width / (TOTAL_HOTEL - 1)) * j +
        (Math.random() * 70 - 35)
      hotelContainer.y = gameStageDimention.height

      let vibrateDirection = 'left'
      const hotelShownTicker = new PIXI.Ticker()
      hotelShownTicker.add(() => {
        if (
          hotelContainer.worldTransform.tx > (window.innerWidth * 3) / 4 ||
          hotelContainer.worldTransform.tx < 0
        )
          return

        if (hotelSprite.y > 0) {
          hotelSprite.y--
          farmSprite.height--
          farmSprite.alpha -= 0.01

          if (vibrateDirection === 'left') {
            // left
            hotelSprite.x--

            if (hotelSprite.x < -2) {
              vibrateDirection = 'right'
            }
          } else {
            // right
            hotelSprite.x++

            if (hotelSprite.x > 2) {
              vibrateDirection = 'left'
            }
          }
        } else {
          hotelShownTicker.destroy()
        }
      })
      hotelShownTicker.start()
    }
  }

  _addMaskToObstacle(viewObject, offset) {
    // if (this.cityName === 'Yunlin') return

    const maskWidth = viewObject.width
    const maskHeight = viewObject.height

    const mask = new PIXI.Graphics()
    mask.beginFill(0x333333)
    mask.drawRect(0, 0, maskWidth, maskHeight - offset)
    mask.endFill()
    // mask.pivot.set(0, mask.height)
    mask.x = 0
    mask.y = 0
    viewObject.mask = mask
    viewObject.addChild(mask)
  }

  optimize() {
    this.optimizeTicker = new PIXI.Ticker()

    this.optimizeTicker.add(() => {
      try {
        if (
          (this.container.worldTransform.tx < window.innerWidth &&
            this.container.worldTransform.tx + this.container.width > 0) ||
          (this.container.worldTransform.tx + this.container.width < 0 &&
            this.container.worldTransform.tx < 0)
        ) {
          this.container.renderable = true
        } else {
          this.container.renderable = false
        }
      } catch (err) {
        this.optimizeTicker.stop()
        this.container.destroy()
      }
    })

    this.optimizeTicker.start()
  }
}
