import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const taiwanDimention = Globals.getTaiwanDimention()

const ratio = taiwanDimention.width / (375 * 3)

export class TaiwanGameIcon {
  constructor(index = 0, chooseGameHandler = () => {}) {
    this.index = index
    this.gameName = getGameName(this.index)
    this.chooseGameHandler = chooseGameHandler

    this.container = new PIXI.Container()
    this.container.buttonMode = true
    this.container.interactive = true

    this.createTaiwanGameIcon()
    this.createGameTitleWording()
    this.x = 0
    this.y = 0

    this.assignPosition()
    this.setupPosition()
    // this.activeListener()
  }

  createTaiwanGameIcon() {
    const texture = Globals.resources[`gameIcon`]?.texture
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)

    this.sprite.width *= ratio
    this.sprite.height *= ratio

    this.container.addChild(this.sprite)
  }

  createGameTitleWording() {
    this.title = new PIXI.Container()

    this.nameText = new PIXI.Text(getGameTitleWording(this.index), {
      fill: ['0x000000'],
      fontSize: taiwanDimention.gameNameFontSize,
    })

    const titleBg = new PIXI.Graphics()
    titleBg.beginFill(0xc4c4c4)
    titleBg.drawRoundedRect(
      0,
      0,
      this.nameText.width + taiwanDimention.gameNamePadding * 2,
      this.nameText.height + taiwanDimention.gameNamePadding * 2
    )
    titleBg.endFill()

    this.nameText.x = (titleBg.width - this.nameText.width) / 2
    this.nameText.y = (titleBg.height - this.nameText.height) / 2

    this.title.addChild(titleBg, this.nameText)
    this.title.pivot.set(this.title.width / 2, this.title.height / 2)
    this.title.y = this.title.height * 1.8
    this.container.addChild(this.title)
  }

  assignPosition() {
    switch (this.index) {
      case 0:
        this.x = 60
        this.y = 4
        break
      case 1:
        this.x = 12
        this.y = 84
        break
      case 2:
        this.x = 76
        this.y = 92
        break
      case 3:
        this.x = 88
        this.y = 56
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
      this.chooseGameHandler(this)
    })
  }

  deactiveListener() {
    this.container.removeAllListeners()
  }
}

function getGameName(index) {
  switch (index) {
    default:
    case 0:
      return 'snake'
    case 1:
      return 'balance'
    case 2:
      return 'candy'
    case 3:
      return 'run'
  }
}

function getGameTitleWording(index) {
  switch (index) {
    default:
    case 0:
      return '資源吃吃蛇'
    case 1:
      return '人口翹翹板'
    case 2:
      return '區塊消消樂'
    case 3:
      return '小鎮跑跑趣'
  }
}
