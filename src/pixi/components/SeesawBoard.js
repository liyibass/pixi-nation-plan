import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'
const TEXT_WIDTH = 16

export class SeesawBoard {
  constructor(weight = 0, maxWeight = 32) {
    this.container = new PIXI.Container()
    this.weight = weight
    this.maxWeight = maxWeight

    this.width = Globals.getSeesawGameStageDimention().width
    this.colorBarLength = Math.floor(this.width / 9)
    this.colorBarHeight = Math.floor((this.colorBarLength * 6.63) / 37.45)

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
      const filledColot = i === 4 ? 0x9e523e : i % 2 === 0 ? 0x3b6bd5 : 0x0e427f
      colorBar.beginFill(filledColot)

      colorBar.drawRect(0, 0, this.colorBarLength, this.colorBarHeight)
      colorBar.endFill()

      colorBar.x = i * this.colorBarLength
      this.container.addChild(colorBar)
    }
  }

  createWeightScale() {
    const weightScaleGroup = new PIXI.Container()

    // half circle
    const degreeScaleTexture = Globals.resources['degreeScale']?.texture
    const degreeScaleSprite = new PIXI.Sprite(degreeScaleTexture)

    const scale = this.colorBarLength / 37
    degreeScaleSprite.width *= scale
    degreeScaleSprite.height *= scale
    weightScaleGroup.addChild(degreeScaleSprite)

    const weightTextGroup = this.createWeightText()
    weightScaleGroup.addChild(weightTextGroup)
    weightTextGroup.x = (weightScaleGroup.width - weightTextGroup.width) / 2
    weightTextGroup.y =
      (degreeScaleSprite.height +
        this.colorBarHeight -
        weightTextGroup.height) /
        2 +
      1

    weightScaleGroup.x = (this.width - weightScaleGroup.width) / 2
    weightScaleGroup.y = -degreeScaleSprite.height

    this.container.addChild(weightScaleGroup)
  }

  createWeightText() {
    const weightTextGroup = new PIXI.Container()

    this.weightText = new PIXI.Text(`${this.weight}`, {
      fill: [0xffffff],
      fontSize: 10,
    })
    this.maxWeightText = new PIXI.Text(`${this.maxWeight}`, {
      fill: [0xffffff],
      fontSize: 10,
    })

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

    weightTextGroup.addChild(this.weightText, devider, this.maxWeightText)

    this.weightText.x = (TEXT_WIDTH - this.weightText.width) / 2
    devider.y = this.weightText.height + 1

    this.maxWeightText.x = (TEXT_WIDTH - this.maxWeightText.width) / 2
    this.maxWeightText.y = devider.y + devider.height + 1

    return weightTextGroup
  }

  increaseWeight(increaseWeight) {
    this.weight += increaseWeight
    this.weightText.text = this.weight
  }
}
