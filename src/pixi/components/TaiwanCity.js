import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { cityDataArray, unlockCardCityArray } from '../script/CityData'

const taiwanDimention = Globals.getTaiwanDimention()

const ratio = taiwanDimention.width / (375 * 3)

export class TaiwanCity {
  constructor(cityIndex = 0, chooseCityHandler = () => {}) {
    this.cityIndex = cityIndex
    this.chooseCityHandler = chooseCityHandler

    this.container = new PIXI.Container()
    this.container.buttonMode = true
    this.container.interactive = true

    this.x = 0
    this.y = 0

    this.cityData =
      cityDataArray.find((cityData) => cityData.cityIndex === this.cityIndex) ||
      cityDataArray[0]

    // this.activeListener()
    this.createFlow()
  }

  async createFlow() {
    this.createTaiwanCity()
    this.assignPosition()
    this.setupPosition()
    this.createDecoration()
    this.createText()
  }

  createTaiwanCity() {
    const texture0 = Globals.resources[`land_${this.cityIndex}_0`]?.texture
    this.sprite0 = new PIXI.Sprite(texture0)
    this.sprite0.anchor.set(0.5, 0.5)

    this.sprite0.width *= ratio
    this.sprite0.height *= ratio

    const texture1 = Globals.resources[`land_${this.cityIndex}_1`]?.texture
    this.sprite1 = new PIXI.Sprite(texture1)
    this.sprite1.anchor.set(0.5, 0.5)

    this.sprite1.width *= ratio
    this.sprite1.height *= ratio
    this.sprite1.alpha = 0

    this.white = new PIXI.Graphics()
    this.white.beginFill(0xffffff, 1)
    this.white.drawRect(0, 0, this.sprite0.width, this.sprite0.height)
    this.white.endFill()
    this.white.pivot.set(this.white.width / 2, this.white.height / 2)
    const whiteMask = new PIXI.Sprite(texture1)
    // whiteMask.anchor.set(0.5, 0.5)
    whiteMask.width *= ratio
    whiteMask.height *= ratio
    this.white.mask = whiteMask
    this.white.alpha = 0
    this.white.addChild(whiteMask)
    this.container.addChild(this.sprite0, this.sprite1, this.white)
  }

  async createDecoration() {
    this.decoration = new PIXI.Container()

    const notYetUnlockAll = !!this.cityData.tabs.find((tab) => {
      return tab.isLocked === true
    })

    if (notYetUnlockAll) {
      const workingTexture = new PIXI.Texture(Globals.resources['Fuck'].texture)
      this.workingSprite = new PIXI.Sprite(workingTexture)

      this.workingSprite.alpha = 0

      this.workingSprite.x = -20
      this.workingSprite.y =
        -this.sprite0.height / 2 - this.workingSprite.height
      this.decoration.addChild(this.workingSprite)
      this.sprite0.addChild(this.decoration)

      return new Promise((resolve) => {
        this.decorationTicker = new PIXI.Ticker()

        this.decorationTicker.add(() => {
          if (this.workingSprite.alpha < 1) {
            this.workingSprite.alpha += 0.02
          } else {
            this.workingSprite.alpha = 1
            this.decorationTicker.stop()
            resolve()
          }
        })

        this.decorationTicker.start()
      })
    } else {
      await this.unlockCity()
    }

    const hasNewUnlock = unlockCardCityArray.find(
      (cityData) => cityData.cityIndex === this.cityIndex
    )

    if (hasNewUnlock) {
      await this.unlockNewCardHighlight()
    }
  }

  unlockNewCardHighlight() {
    console.log('unlockNewCardHighlight')
    const pingTexture = new PIXI.Texture(Globals.resources['ping']?.texture)
    this.pingSprite = new PIXI.Sprite(pingTexture)
    this.pingSprite.name = 'pingSprite'

    this.pingSprite.width = 73.94 * 0.3
    this.pingSprite.height = 110.29 * 0.3
    this.pingSprite.pivot.set(this.pingSprite.width / 2, this.pingSprite.height)
    const initY = -this.pingSprite.height
    this.pingSprite.y = initY
    this.container.addChild(this.pingSprite)
    this.container.setChildIndex(this.pingSprite, 1)

    // ping animation
    this.pingTicker = new PIXI.Ticker()
    let direction = 'up'
    this.pingTicker.add(() => {
      if (direction === 'up') {
        if (this.pingSprite.y > initY - this.pingSprite.height / 4) {
          this.pingSprite.y -= 0.2

          if (this.pingSprite.y <= initY - this.pingSprite.height / 4) {
            direction = 'down'
          }
        }
      } else {
        if (this.pingSprite.y < initY) {
          this.pingSprite.y += 0.2

          if (this.pingSprite.y >= initY) {
            direction = 'up'
          }
        }
      }
    })

    this.pingTicker.start()
  }

  removeAllTicker() {
    this.pingTicker?.stop?.()
    this.decorationTicker?.stop?.()
  }

  async createText() {
    console.log('createText')
    this.textArea = new PIXI.Graphics()
    this.textArea.name = 'textArea'
    this.textArea.beginFill(0xffffff)
    this.textArea.drawRoundedRect(0, 0, 48, 21, 5)
    this.textArea.endFill()

    const nameText = new PIXI.Text(`${this._getCityName(this.cityIndex)}`, {
      fontSize: 14,
      fill: ['0x000000'],
    })
    this.name = this._getCityName(this.cityIndex)

    nameText.x = (this.textArea.width - nameText.width) / 2
    nameText.y = (this.textArea.height - nameText.height) / 2
    this.textArea.addChild(nameText)

    this.textArea.pivot.set(this.textArea.width / 2, this.textArea.height)
    this.container.addChild(this.textArea)

    this.textArea.alpha = 0
  }

  assignPosition() {
    switch (this.cityIndex) {
      case 0:
        this.x = 78
        this.y = 24
        break
      case 1:
        this.x = 74
        this.y = 14
        break
      case 2:
        this.x = 56
        this.y = 20
        break
      case 3:
        this.x = 62
        this.y = 30
        break
      case 4:
        this.x = 52
        this.y = 28
        break
      case 5:
        this.x = 38
        this.y = 24
        break
      case 6:
        this.x = 38
        this.y = 32
        break
      case 7:
        this.x = 39
        this.y = 42
        break
      case 8:
        this.x = 16
        this.y = 42
        break
      case 9:
        this.x = 34
        this.y = 52
        break
      case 10:
        this.x = 22
        this.y = 62
        break
      case 11:
        this.x = 38
        this.y = 70
        break
      case 12:
        this.x = 42
        this.y = 86
        break
      case 13:
        this.x = 72
        this.y = 70
        break
      case 14:
        this.x = 72
        this.y = 52
        break
      case 15:
        this.x = 82
        this.y = 35
        break
      case 16:
        this.x = 90
        this.y = 19
        break
      case 17:
        this.x = 58
        this.y = 44
        break
      case 18:
        this.x = 12
        this.y = 26
        break
      case 19:
        this.x = 28
        this.y = 14
        break
      case 20:
        this.x = 48
        this.y = 10
        break

      default:
        break
    }
  }

  setupPosition() {
    this.container.x = (this.x * taiwanDimention.width) / 100
    this.container.y = (this.y * taiwanDimention.height) / 100
  }

  activeListener(callback = () => {}) {
    this.container.addListener('pointerover', async () => {
      // await this.unlockCity()
      this.textArea.alpha = 1
    })
    this.container.addListener('pointerout', async () => {
      // await this.unlockCity()
      this.textArea.alpha = 0
    })
    this.container.addListener('pointerdown', async () => {
      // await this.unlockCity()
      this.chooseCityHandler(this)
      if (callback) {
        callback()
      }
    })
  }

  hintCity() {
    this.hintTicker = new PIXI.Ticker()

    let hintState = 'light'
    this.hintTicker.add(() => {
      if (hintState === 'light') {
        if (this.white.alpha < 1) {
          this.white.alpha += 0.02

          if (this.white.alpha >= 1) {
            hintState = 'dark'
          }
        }
      } else {
        if (this.white.alpha > 0) {
          this.white.alpha -= 0.02

          if (this.white.alpha <= 0) {
            hintState = 'light'
          }
        }
      }
    })

    this.hintTicker.start()
  }

  stopHintCity() {
    this.hintTicker?.stop()
  }

  deactiveListener() {
    this.container.removeAllListeners()
    this.textArea.alpha = 0
  }

  unlockCity() {
    this.unlockTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.unlockTicker.add(() => {
        if (this.sprite1.alpha < 1) {
          this.sprite1.alpha += 0.02
        } else {
          this.unlockTicker.stop()
          resolve()
        }
      })

      this.unlockTicker.start()
    })
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
    }
  }
}
