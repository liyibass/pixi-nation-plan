import * as PIXI from 'pixi.js'

// import { Globals } from '../script/Globals'

import { IntroScene } from './IntroScene'
import { SnakeScene } from './SnakeScene'
import { BalanceScene } from './BalanceScene'
import { RunScene } from './RunScene'
import { CandyScene } from './CandyScene'
import { MenuScene } from './MenuScene'
// import { clearUnlockCardCityArray } from '../script/Utils'

export class MainScene {
  constructor() {
    this.container = new PIXI.Container()

    // this.createPlayer()
    this.createIntroScene()
    // this.createSnakeScene()
  }

  createIntroScene() {
    const introScene = new IntroScene(this.selectStage.bind(this))
    this.container.addChild(introScene.container)
  }

  createSnakeScene() {
    // create snake scene
    const snakeScene = new SnakeScene(this.selectStage.bind(this))
    this.container.addChild(snakeScene.container)
  }

  createBalanceScene() {
    // create snake scene
    const balanceScene = new BalanceScene(this.selectStage.bind(this))
    this.container.addChild(balanceScene.container)
  }

  createRunScene() {
    // create snake scene
    const runScene = new RunScene(this.selectStage.bind(this))
    this.container.addChild(runScene.container)
  }

  createCandyScene() {
    // create snake scene
    const candyScene = new CandyScene(this.selectStage.bind(this))
    this.container.addChild(candyScene.container)
  }

  createMenuScene() {
    const menuScene = new MenuScene(this.selectStage.bind(this))

    this.container.addChild(menuScene.container)
  }

  selectStage(stageName, prevScene) {
    this.container.removeChildren()
    this.container.removeAllListeners()

    this.clearPrevScene(prevScene)

    switch (stageName) {
      case 'snake':
        this.createSnakeScene()
        break
      case 'balance':
        this.createBalanceScene()
        break
      case 'run':
        this.createRunScene()
        break
      case 'candy':
        this.createCandyScene()
        break

      case 'menu':
        this.createMenuScene()
        break

      default:
        break
    }
  }

  clearPrevScene(prevScene) {
    // console.log(prevScene)
    prevScene?.header?.destoryHeader()
  }
}
