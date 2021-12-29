import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const gameStageDimention = Globals.getCandyGameStageDimention()

const INIT_STEP_COUNT = 50
const MAX_POINT = 2000

const HEADER_HEIGHT = 28
const BAR_HEIGHT = 15

const ICON_WIDTH = 34
const STEP_WIDTH = 30
const RESET_WIDTH = 28
const PADDING_WIDTH = 5
const STEP_X = ICON_WIDTH + PADDING_WIDTH
const BAR_X = STEP_X + STEP_WIDTH + PADDING_WIDTH
const BAR_WIDTH =
  gameStageDimention.width - BAR_X - PADDING_WIDTH * 2 - RESET_WIDTH
const RESET_X = BAR_X + BAR_WIDTH + PADDING_WIDTH

export class CandyHeader {
  constructor(
    reCreateCandys = () => {},
    gameFail = () => {},
    gamePassed = () => {}
  ) {
    this.container = new PIXI.Container()
    this.container.name = 'candyHeader'
    this.reCreateCandys = reCreateCandys
    this.gameFail = gameFail
    this.gamePassed = gamePassed

    this.remainStepCount = INIT_STEP_COUNT

    this.currentPoint = 0
    this.maxPoint = MAX_POINT

    this.createCandyHeader()
  }

  createCandyHeader() {
    this.createBackground()
    this._createLogo()
    this._createRemainStepCount()
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

  _createRemainStepCount() {
    this.remainStepCountIcon = new PIXI.Container()

    const stepBackground = new PIXI.Graphics()
    stepBackground.beginFill(0x232c5b)
    stepBackground.drawRoundedRect(0, 0, 30, 20, 5)
    stepBackground.endFill()

    this.remainStepCountIcon.addChild(stepBackground)

    this.reststepCountText = new PIXI.Text(this.remainStepCount, {
      align: 'center',
      fontSize: 14,
      fill: ['0xffffff'],
    })

    this.remainStepCountIcon.addChild(this.reststepCountText)

    // position text
    this._repositionText()

    this.container.addChild(this.remainStepCountIcon)

    this.remainStepCountIcon.x = STEP_X
    this.remainStepCountIcon.y =
      (HEADER_HEIGHT - this.remainStepCountIcon.height) / 2
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
    this.scoreWhiteBar.drawRect(0, 0, BAR_WIDTH, BAR_HEIGHT)
    this.scoreBar.addChild(this.scoreWhiteBar)
    this._setWhiteBarWidth()

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
      (this.remainStepCountIcon.width - this.reststepCountText.width) / 2
    this.reststepCountText.y =
      (this.remainStepCountIcon.height - this.reststepCountText.height) / 2
  }

  _createResetButton() {
    const resetTexture = new PIXI.Texture(Globals.resources[`reset`]?.texture)
    const resetSprite = new PIXI.Sprite(resetTexture)

    this.container.addChild(resetSprite)

    resetSprite.y = (HEADER_HEIGHT - resetSprite.height) / 2
    resetSprite.x = RESET_X

    resetSprite.buttonMode = true
    resetSprite.interactive = true

    resetSprite.addListener('pointerdown', () => {
      this.reCreateCandys()
    })
  }

  decreaseStepCount() {
    this.remainStepCount--
    this.reststepCountText.text = this.remainStepCount

    if (this.remainStepCount <= 0) {
      this.gameFail()
    }
  }

  increaseScore(needToDeleteArray) {
    const lineCount = Math.floor(needToDeleteArray.length / 3)
    const bonusCount = needToDeleteArray.length % 3

    this.currentPoint += lineCount * 50 + bonusCount * 10
    this.currentPointText.text = this.currentPoint
    this._setWhiteBarWidth()

    if (this.currentPoint >= this.maxPoint) {
      this.gamePassed()
    }
  }

  _setWhiteBarWidth() {
    this.barTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.barTicker.add(() => {
        // text position setting
        if (!this.currentPointText) return

        const targetWidth = (this.currentPoint / this.maxPoint) * BAR_WIDTH

        if (this.scoreWhiteBar.width < targetWidth) {
          this.scoreWhiteBar.width++
          this.currentPointText.x =
            this.scoreWhiteBar.width - this.currentPointText?.width - 3
        } else {
          this.scoreWhiteBar.width = targetWidth
          this.barTicker.stop()
          resolve()
        }

        // current point's position will cheange depends on white bar's width
        if (this.scoreWhiteBar.width > (BAR_WIDTH * 7) / 8) {
          this.currentPointText.y =
            (BAR_HEIGHT - this.currentPointText.height) / 2

          this.currentPointText.style.fill = 0x888888
        } else {
          this.currentPointText.y = -17
          this.currentPointText.style.fill = 0xffffff
        }
      })

      this.barTicker.start()
    })
  }

  resetCandyHeader() {
    this.remainStepCount = INIT_STEP_COUNT

    this._setWhiteBarWidth()
    this.currentPoint = 0
    this.currentPointText.text = this.currentPoint
    this.currentPointText.y = -17
    this.currentPointText.x = 0
  }
}
