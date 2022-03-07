import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
const gameStageDimention = Globals.getCandyGameStageDimention()
const CANDY_WIDTH = 16
const FONT_SIZE = 14
const FONT_WIDTH = 36
const MARGIN = 2
const BLOCK_MARGIN = 8
const BLOCK_WIDTH = CANDY_WIDTH + (MARGIN + FONT_WIDTH) * 2
const RESET_WIDTH = Globals.CANDY_SCORE_HEIGHT

export class CandyScore {
  constructor(pointArray) {
    this.container = new PIXI.Container()
    this.container.name = 'CandyScore'
    this.pointArray = pointArray
    this.countTextArray = []

    this.createCandyScore()
  }

  createCandyScore() {
    this.pointArray.forEach((candy) => {
      const pointContainer = new PIXI.Container()
      const { typeIndex, point, count } = candy

      const candySprite = this._createCandySprite(typeIndex)
      pointContainer.addChild(candySprite)

      if (typeIndex !== 4) {
        const candyPointText = this._createCandyPointText(
          typeIndex,
          padLeadingZeros(point, 4)
        )
        candyPointText.x =
          candySprite.width + MARGIN + FONT_WIDTH - candyPointText.width

        pointContainer.addChild(candyPointText)
      }

      const candyCountText = this._createCandyCountText(
        typeIndex,
        padLeadingZeros(count, 4)
      )
      if (typeIndex !== 4) {
        candyCountText.x =
          candySprite.width +
          MARGIN +
          FONT_WIDTH +
          MARGIN +
          FONT_WIDTH -
          candyCountText.width
      } else {
        candyCountText.x =
          candySprite.width + MARGIN + FONT_WIDTH - candyCountText.width
      }
      pointContainer.addChild(candyCountText)
      this.countTextArray.push(candyCountText)

      switch (typeIndex) {
        case 0:
          pointContainer.x = 0
          pointContainer.y = 0
          break
        case 1:
          pointContainer.x = 0
          pointContainer.y = CANDY_WIDTH + BLOCK_MARGIN
          break
        case 2:
          pointContainer.x = BLOCK_WIDTH + BLOCK_MARGIN
          pointContainer.y = 0
          break
        case 3:
          pointContainer.x = BLOCK_WIDTH + BLOCK_MARGIN
          pointContainer.y = CANDY_WIDTH + BLOCK_MARGIN
          break
        case 4:
          pointContainer.x =
            gameStageDimention.width -
            RESET_WIDTH -
            FONT_WIDTH -
            CANDY_WIDTH -
            BLOCK_MARGIN
          pointContainer.y = CANDY_WIDTH + BLOCK_MARGIN
          break
      }
      this.container.addChild(pointContainer)
    })
  }

  _createCandySprite(typeIndex) {
    const candyTexture = new PIXI.Texture(
      Globals.resources[`b${typeIndex}`]?.texture
    )
    const candySprite = new PIXI.Sprite(candyTexture)

    candySprite.width = CANDY_WIDTH
    candySprite.height = CANDY_WIDTH

    return candySprite
  }

  _createCandyPointText(typeIndex, point) {
    return new PIXI.Text(point, {
      fontSize: FONT_SIZE,
      fill: getCandyColor(typeIndex),
      fontWeight: 'bold',
    })
  }
  _createCandyCountText(typeIndex, count) {
    return new PIXI.Text(count, {
      fontSize: FONT_SIZE,
      fill: 0xffffff,
      fontWeight: 'bold',
    })
  }

  updateScore() {
    this.pointArray.forEach((candy) => {
      const { typeIndex, count } = candy

      this.countTextArray[typeIndex].text = padLeadingZeros(count, 4)
    })
  }
}

function getCandyColor(typeIndex) {
  switch (typeIndex) {
    case 0:
      return 0xff8b29
    case 1:
      return 0x497752
    case 2:
      return 0x3b6bd5
    case 3:
      return 0xde4248

    default:
      return 0xffffff
  }
}

function padLeadingZeros(num, size) {
  var s = num + ''
  while (s.length < size) s = '0' + s
  return s
}
