import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const taiwanDimention = Globals.getTaiwanDimention()

const ratio = taiwanDimention.width / (375 * 3)

export class TaiwanCity {
  constructor(index = 0, chooseCityHandler = () => {}) {
    this.index = index
    this.chooseCityHandler = chooseCityHandler

    this.container = new PIXI.Container()
    this.container.buttonMode = true
    this.container.interactive = true

    this.x = 0
    this.y = 0
    this.createTaiwanCity()
    this.createText()

    this.assignPosition()
    this.setupPosition()
    // this.activeListener()
  }

  createTaiwanCity() {
    const texture0 = Globals.resources[`land_${this.index}_0`]?.texture
    this.sprite0 = new PIXI.Sprite(texture0)
    this.sprite0.anchor.set(0.5, 0.5)

    this.sprite0.width *= ratio
    this.sprite0.height *= ratio

    const texture1 = Globals.resources[`land_${this.index}_1`]?.texture
    this.sprite1 = new PIXI.Sprite(texture1)
    this.sprite1.anchor.set(0.5, 0.5)

    this.sprite1.width *= ratio
    this.sprite1.height *= ratio
    this.sprite1.alpha = 0

    this.container.addChild(this.sprite0, this.sprite1)
  }

  createText() {
    this.textArea = new PIXI.Graphics()
    this.textArea.beginFill(0xffffff)
    this.textArea.drawRoundedRect(0, 0, 48, 21, 5)
    this.textArea.endFill()

    const nameText = new PIXI.Text(`${this._getCityName(this.index)}`, {
      fontSize: 14,
      fill: ['0x000000'],
    })
    this.name = this._getCityName(this.index)

    nameText.x = (this.textArea.width - nameText.width) / 2
    nameText.y = (this.textArea.height - nameText.height) / 2
    this.textArea.addChild(nameText)

    this.textArea.pivot.set(this.textArea.width / 2, this.textArea.height)
    this.container.addChild(this.textArea)
    this.textArea.alpha = 0
  }

  assignPosition() {
    switch (this.index) {
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
      case 19:
        return '連江縣'
      case 20:
        return '金門縣'
    }
  }
}
