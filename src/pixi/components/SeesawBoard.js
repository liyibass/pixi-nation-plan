import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'
const TEXT_WIDTH = 16

export class SeesawBoard {
  constructor(weight = 0, maxWeight = 32) {
    this.container = new PIXI.Container()
    this.weight = weight
    this.maxWeight = maxWeight
    this.leftWeight = 0
    this.leftMaxWeight = 32
    this.rightWeight = 0
    this.rightMaxWeight = 32

    this.width = Globals.getSeesawGameStageDimention().width
    this.colorBarLength = Math.floor(this.width / 9)
    this.colorBarHeight = 15

    this.createBoard()
    this.createWeightScale()

    this.container.pivot.x = this.container.width / 2
    this.container.pivot.y = this.colorBarHeight

    // setInterval(() => {
    //   this.container.angle++
    // }, 100)
  }

  createBoard() {
    for (let i = 0; i < 9; i++) {
      const colorBar = new PIXI.Graphics()
      const filledColor = i === 0 || i === 8 ? 0xcc8053 : 0xded4ae
      colorBar.beginFill(filledColor)

      colorBar.drawRect(0, 0, this.colorBarLength, this.colorBarHeight)
      colorBar.endFill()

      colorBar.x = i * this.colorBarLength
      this.container.addChild(colorBar)
    }
  }

  createWeightScale() {
    const weightScaleGroup = new PIXI.Container()

    //  circle
    const degreeScaleTexture = Globals.resources['circle']?.texture
    const degreeScaleSprite = new PIXI.Sprite(degreeScaleTexture)

    const scale = this.colorBarLength / 37
    degreeScaleSprite.width *= scale
    degreeScaleSprite.height *= scale
    weightScaleGroup.addChild(degreeScaleSprite)

    const leftWeightTextGroup = this.createWeightText('left')
    weightScaleGroup.addChild(leftWeightTextGroup)
    const rightWeightTextGroup = this.createWeightText('right')
    weightScaleGroup.addChild(rightWeightTextGroup)

    leftWeightTextGroup.x =
      (weightScaleGroup.width - leftWeightTextGroup.width) / 2 - 11
    leftWeightTextGroup.y =
      (degreeScaleSprite.height - rightWeightTextGroup.height) / 2
    rightWeightTextGroup.x =
      (weightScaleGroup.width - rightWeightTextGroup.width) / 2 + 11
    rightWeightTextGroup.y =
      (degreeScaleSprite.height - rightWeightTextGroup.height) / 2

    weightScaleGroup.x = (this.width - weightScaleGroup.width) / 2
    weightScaleGroup.y = -degreeScaleSprite.height / 2 + this.colorBarHeight / 2

    this.container.addChild(weightScaleGroup)
  }

  createWeightText(side) {
    const leftWeightTextGroup = new PIXI.Container()

    this[`${side}WeightText`] = new PIXI.Text(`${this[`${side}Weight`]}`, {
      fill: [0xffffff],
      fontSize: 10,
    })
    this[`${side}MaxWeightText`] = new PIXI.Text(
      `${this[`${side}MaxWeight`]}`,
      {
        fill: [0xffffff],
        fontSize: 10,
      }
    )

    const devider = new PIXI.Graphics()
    const frameLineWeight = 1
    devider.lineStyle(frameLineWeight, 0xdddddd, 1)

    /*
     * NOTE: We use gameStageFrame(which is a Graphics) to bump up outer container
     * the drawing process down below MUST start at 0,0
     * (Graphics and drawRect is NOT in same level)
     */
    devider.drawRect(0, 0, TEXT_WIDTH, 1)
    devider.endFill()

    leftWeightTextGroup.addChild(
      this[`${side}WeightText`],
      devider,
      this[`${side}MaxWeightText`]
    )

    this[`${side}WeightText`].x =
      (TEXT_WIDTH - this[`${side}WeightText`].width) / 2
    devider.y = this[`${side}WeightText`].height + 1

    this[`${side}MaxWeightText`].x =
      (TEXT_WIDTH - this[`${side}MaxWeightText`].width) / 2
    this[`${side}MaxWeightText`].y = devider.y + devider.height + 1

    return leftWeightTextGroup
  }

  increaseWeight(increaseWeight) {
    this.weight += increaseWeight
    this.weightText.text = this.weight
  }
}
