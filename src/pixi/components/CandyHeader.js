import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

// const gameStageDimention = Globals.getRunGameStageDimention()

export class CandyHeader {
  constructor(resetCandy = () => {}) {
    this.container = new PIXI.Container()
    this.container.name = 'candyHeader'
    this.collisionMonresetCandyitor = resetCandy

    this.createCandyHeader()
  }

  createCandyHeader() {
    this._createLogo()
    this._createRestStepCount()
  }

  _createLogo() {
    const excavatorTexture = Globals.resources[`excavator`]?.texture
    this.logo = new PIXI.Sprite(excavatorTexture)

    this.container.addChild(this.logo)
  }

  _createRestStepCount() {
    this.restStepCount = new PIXI.Container()

    const stepBackground = new PIXI.Graphics()
    stepBackground.beginFill(0x232c5b)
    stepBackground.drawRoundedRect(0, 0, 30, 20, 5)
    stepBackground.endFill()

    this.restStepCount.addChild(stepBackground)

    this.reststepCountText = new PIXI.Text('30', {
      align: 'center',
      fontSize: 14,
      fill: ['0xffffff'],
    })

    this.restStepCount.addChild(this.reststepCountText)

    // position text position
    this._repositionText()

    this.container.addChild(this.restStepCount)
  }

  _repositionText() {
    this.reststepCountText.x =
      (this.restStepCount.width - this.reststepCountText.width) / 2
    this.reststepCountText.y =
      (this.restStepCount.height - this.reststepCountText.height) / 2
  }
}
