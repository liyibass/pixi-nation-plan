import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const taiwanDimention = Globals.getTaiwanDimention()

const ratio = taiwanDimention.width / (375 * 3)

export class TaiwanCity {
  constructor(index = 0, position = { x: 0, y: 0 }) {
    this.index = index
    this.container = new PIXI.Container()
    this.container.buttonMode = true
    this.container.interactive = true

    this.createTaiwanCity()
    this.x = position.x
    this.y = position.y

    this.assignPosition()
    this.setupPosition()
    this.activeListener()
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
        console.log(this)
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

  activeListener() {
    this.container.addListener('pointerdown', async () => {
      console.log(`city ${this.index} is clicked`)
      await this.unlockCity()
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
}
