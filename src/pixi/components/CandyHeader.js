import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const gameStageDimention = Globals.getCandyGameStageDimention()

const HEADER_HEIGHT = 28
const BAR_HEIGHT = 11

const ICON_WIDTH = 34
const STEP_WIDTH = 30
const RESET_WIDTH = 28
const PADDING_WIDTH = 5
const STEP_X = ICON_WIDTH + PADDING_WIDTH
const BAR_X = STEP_X + STEP_WIDTH + PADDING_WIDTH
const BAR_WIDTH =
  gameStageDimention.width - BAR_X - PADDING_WIDTH * 2 - RESET_WIDTH
const RESET_X = BAR_X + BAR_WIDTH + PADDING_WIDTH
console.log(gameStageDimention.width)

export class CandyHeader {
  constructor(resetCandy = () => {}) {
    this.container = new PIXI.Container()
    this.container.name = 'candyHeader'
    this.collisionMonresetCandyitor = resetCandy

    this.currentPoint = 0
    this.maxPoint = 2000

    this.createCandyHeader()
  }

  createCandyHeader() {
    this.createBackground()
    this._createLogo()
    this._createRestStepCount()
    this._createScoreBar()
    this._createResetButton()
  }

  createBackground() {
    const background = new PIXI.Graphics()
    background.beginFill(0x6f90ba)
    background.drawRect(0, 0, gameStageDimention.width, BAR_HEIGHT)
    background.endFill()
    this.container.addChild(background)
  }

  _createLogo() {
    const excavatorTexture = Globals.resources[`excavator`]?.texture
    this.logo = new PIXI.Sprite(excavatorTexture)

    this.container.addChild(this.logo)

    this.logo.y = (HEADER_HEIGHT - this.logo.height) / 2
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

    // position text
    this._repositionText()

    this.container.addChild(this.restStepCount)

    this.restStepCount.x = STEP_X
    this.restStepCount.y = (HEADER_HEIGHT - this.restStepCount.height) / 2
  }

  _createScoreBar() {
    this.scoreBar = new PIXI.Container()

    // scoreBar bg
    const scoreBackground = new PIXI.Graphics()
    scoreBackground.beginFill(0x344768)
    scoreBackground.drawRect(0, 0, BAR_WIDTH, BAR_HEIGHT)
    scoreBackground.endFill()

    this.scoreBar.addChild(scoreBackground)

    // scoreBar whiteBar
    this.scoreWhiteBar = new PIXI.Graphics()
    this.scoreWhiteBar.beginFill(0xffffff)
    this.scoreWhiteBar.drawRect(0, 0, BAR_WIDTH / 2, BAR_HEIGHT)
    this.scoreBar.addChild(this.scoreWhiteBar)

    // scoreBar max point
    const maxPointText = new PIXI.Text(`${this.maxPoint}`, {
      fill: ['0xffffff'],
      fontSize: 14,
    })

    this.scoreBar.addChild(maxPointText)
    maxPointText.y = -17
    maxPointText.x = scoreBackground.width - maxPointText.width

    // scoreBar current point
    this.currentPointText = new PIXI.Text(`${this.currentPoint}`, {
      fill: ['0xffffff'],
      fontSize: 14,
    })

    this.scoreBar.addChild(this.currentPointText)
    this.currentPointText.y = -17
    this.currentPointText.x =
      this.scoreWhiteBar.width - this.currentPointText.width

    this.container.addChild(this.scoreBar)

    this.scoreBar.x = BAR_X
    this.scoreBar.y = (HEADER_HEIGHT - this.scoreWhiteBar.height) / 2
  }

  _repositionText() {
    this.reststepCountText.x =
      (this.restStepCount.width - this.reststepCountText.width) / 2
    this.reststepCountText.y =
      (this.restStepCount.height - this.reststepCountText.height) / 2
  }

  _createResetButton() {
    const resetTexture = new PIXI.Texture(Globals.resources[`reset`]?.texture)
    const resetSprite = new PIXI.Sprite(resetTexture)

    this.container.addChild(resetSprite)

    resetSprite.y = (HEADER_HEIGHT - resetSprite.height) / 2
    resetSprite.x = RESET_X

    resetSprite.buttonMode = true
    resetSprite.interactive = true
  }
}
