import * as PIXI from 'pixi.js'

// import { Globals } from '../script/Globals'

import { IntroScene } from './IntroScene'
import { SnakeScene } from './SnakeScene'
import { BalanceScene } from './BalanceScene'

export class MainScene {
  constructor() {
    this.container = new PIXI.Container()

    this.createBackground()
    // this.createPlayer()
    this.createIntroScene()
    // this.createSnakeScene()
  }

  createBackground() {}

  createIntroScene() {
    const introScene = new IntroScene(this.selectStage.bind(this))
    this.container.addChild(introScene.container)
  }

  createSnakeScene() {
    // remove unuse scene
    this.container.removeChildren()
    this.container.removeAllListeners()

    // create snake scene
    const snakeScene = new SnakeScene()
    this.container.addChild(snakeScene.container)
  }
  createBalanceScene() {
    // remove unuse scene
    this.container.removeChildren()
    this.container.removeAllListeners()

    // create snake scene
    const balanceScene = new BalanceScene()
    this.container.addChild(balanceScene.container)
  }

  selectStage(stageName) {
    console.log('clicked ' + stageName)
    switch (stageName) {
      case 'snake':
        this.createSnakeScene()
        break
      case 'balance':
        this.createBalanceScene()
        break

      default:
        break
    }
  }
}
