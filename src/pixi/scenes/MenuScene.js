// import * as PIXI from 'pixi.js'

// window.PIXI = PIXI

// import { Globals } from '../script/Globals'
import { Taiwan } from '../components/Taiwan'
import { Scene } from './Scene'

export class MenuScene extends Scene {
  constructor(selectStage = () => {}) {
    super()
    this.selectStage = selectStage

    this.inWindowObstacles = []
    this.container.name = 'MenuScene'

    this.currentCityIndex = 0

    this.createScene()

    this.startStage()
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0x92b79c)

    this._createItems()
    this.createTaiwan()
    // this._addMaskToGameStage()

    this._createDoctorSay()
  }

  createTaiwan() {
    this.taiwan = new Taiwan(this.startGame.bind(this))
    // this.taiwan.container.interactiveChildren = false
    this.taiwan.container.alpha = 1
    this.container.addChild(this.taiwan.container)
  }
  startStage() {
    this.taiwan.activeListener()
  }

  startGame(choosedGame) {
    this.selectStage(choosedGame.gameName)
  }
}