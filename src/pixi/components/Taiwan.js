import * as PIXI from 'pixi.js'

import { TaiwanCity } from './TaiwanCity'
import { Globals } from '../script/Globals'
import { TaiwanGameIcon } from './TaiwanGameIcon'
import { Card } from './Card'
import { sound } from '@pixi/sound'
const taiwanDimention = Globals.getTaiwanDimention()

export class Taiwan {
  constructor(startGame = () => {}) {
    this.startGame = startGame

    this.container = new PIXI.Container()
    this.container.name = 'taiwan'

    this.x = taiwanDimention.x
    this.y = taiwanDimention.y

    this.taiwanCityArray = []
    this.gameIconArray = []
    this.createTaiwan()
    this.createCard()
    this.container.interactiveChildren = false
  }

  playClickMusic() {
    sound.play('click')
  }

  createTaiwan() {
    this.taiwanContainer = new PIXI.Container()
    this.taiwanContainer.name = 'taiwanContainer'

    this.createFrame()
    this.createTaiwanCity()
    this.createGameIcon()
    this.setupPosition()
    this.container.addChild(this.taiwanContainer)
  }

  createFrame() {
    const frame = new PIXI.Graphics()
    frame.beginFill(0x92b79c, 0)
    frame.drawRect(0, 0, taiwanDimention.width, taiwanDimention.height)
    frame.endFill()
    this.taiwanContainer.addChild(frame)
  }

  createTaiwanCity() {
    for (let i = 0; i < 18; i++) {
      const taiwanCity = new TaiwanCity(i, this._chooseCityHandler.bind(this))
      this.taiwanCityArray.push(taiwanCity)
      this.taiwanContainer.addChild(taiwanCity.container)

      if (i === 10) {
        this.kaoshiung = taiwanCity
      }
    }
  }

  _chooseCityHandler(selectedCity) {
    this.playClickMusic()
    this.card.showCityInfo(selectedCity)
    // this.cardFolder.activeListener()
    // this.card.cardFolder.activeListener()
  }

  createGameIcon() {
    for (let i = 0; i < 4; i++) {
      const gameIcon = new TaiwanGameIcon(i, this._chooseGameHandler.bind(this))
      this.gameIconArray.push(gameIcon)
      this.taiwanContainer.addChild(gameIcon.container)
    }
  }

  _chooseGameHandler(choosedGame) {
    // pass choosedGameIndex to parent
    this.startGame(choosedGame, true)
  }
  _chooseGameInCardHandler(choosedGame) {
    // pass choosedGameIndex to parent
    this.startGame(choosedGame, false)
  }

  setupPosition() {
    this.taiwanContainer.x = this.x
    this.taiwanContainer.y = this.y
  }

  createCard() {
    this.card = new Card(this._chooseGameInCardHandler.bind(this))
    this.container.addChild(this.card.container)
  }

  activeCityListener() {
    console.log('activeCityListener')
    this.container.interactiveChildren = true

    this.taiwanCityArray.forEach((city) => {
      city.activeListener()
    })
  }

  activeKaoshiungListener(callBack) {
    this.container.interactiveChildren = true

    this.kaoshiung.activeListener(callBack)
  }

  deactiveKaoshiungListener() {
    this.kaoshiung.deactiveListener()
  }

  activeGameListener() {
    this.container.interactiveChildren = true
    this.gameIconArray.forEach((gameIcon) => {
      gameIcon.activeListener()
    })
  }

  destroyTaiwan() {
    this.container.interactiveChildren = false

    this.taiwanCityArray.forEach((city) => {
      city.deactiveListener()
      city.removeAllTicker()
    })

    this.gameIconArray.forEach((gameIcon) => {
      gameIcon.deactiveListener()
    })
  }
}
