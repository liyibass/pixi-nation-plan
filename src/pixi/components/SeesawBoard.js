import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
// import { Globals } from '../script/Globals'
const TEXT_WIDTH = 16

export class SeesawBoard {
  constructor() {
    this.container = new PIXI.Container()

    this.leftLoad = 0
    this.leftMaxLoad = 16
    this.rightLoad = 0
    this.rightMaxLoad = 16

    this.leftWeight = 0
    this.rightWeight = 0

    this.width = Globals.getSeesawGameStageDimention().width
    this.colorBarLength = Math.floor(this.width / 9)
    this.colorBarHeight = 15

    this.createBoard()
    this.createWeightText()
    this.createWeightScale()

    this.container.pivot.x = this.container.width / 2
    this.container.pivot.y = this.colorBarHeight

    this.isDead = false

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

  createWeightText() {
    // add weight text
    this.leftWeightText = new PIXI.Text(this.leftWeight, {
      fill: [0xffffff],
      fontSize: 14,
      align: 'center',
    })
    this.rightWeightText = new PIXI.Text(this.rightWeight, {
      fill: [0xffffff],
      fontSize: 14,
      align: 'center',
    })

    this.leftWeightText.x =
      (this.colorBarLength - this.leftWeightText.width) / 2
    this.leftWeightText.y =
      (this.colorBarHeight - this.leftWeightText.height) / 2

    this.rightWeightText.x =
      this.width - (this.colorBarLength + this.rightWeightText.width) / 2
    this.rightWeightText.y =
      (this.colorBarHeight - this.rightWeightText.height) / 2

    this.container.addChild(this.leftWeightText, this.rightWeightText)
  }

  createWeightScale() {
    const weightScaleGroup = new PIXI.Container()

    //  circle
    const degreeScaleTexture = Globals.resources['seesawCircle']?.texture
    const degreeScaleSprite = new PIXI.Sprite(degreeScaleTexture)

    const scale = this.colorBarLength / 37
    degreeScaleSprite.width *= scale
    degreeScaleSprite.height *= scale
    weightScaleGroup.addChild(degreeScaleSprite)

    // text
    const leftLoadTextGroup = this.createLoadText('left')
    weightScaleGroup.addChild(leftLoadTextGroup)
    const rightLoadTextGroup = this.createLoadText('right')
    weightScaleGroup.addChild(rightLoadTextGroup)

    leftLoadTextGroup.x =
      (weightScaleGroup.width - leftLoadTextGroup.width) / 2 - 11
    leftLoadTextGroup.y =
      (degreeScaleSprite.height - rightLoadTextGroup.height) / 2
    rightLoadTextGroup.x =
      (weightScaleGroup.width - rightLoadTextGroup.width) / 2 + 11
    rightLoadTextGroup.y =
      (degreeScaleSprite.height - rightLoadTextGroup.height) / 2

    weightScaleGroup.x = (this.width - weightScaleGroup.width) / 2
    weightScaleGroup.y = -degreeScaleSprite.height / 2 + this.colorBarHeight / 2

    this.container.addChild(weightScaleGroup)
  }

  createLoadText(side) {
    const leftLoadTextGroup = new PIXI.Container()

    this[`${side}LoadTextContainer`] = new PIXI.Text(`${this[`${side}Load`]}`, {
      fill: [0xffffff],
      fontSize: 10,
    })
    this[`${side}MaxLoadTextContainer`] = new PIXI.Text(
      `${this[`${side}MaxLoad`]}`,
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

    leftLoadTextGroup.addChild(
      this[`${side}LoadTextContainer`],
      devider,
      this[`${side}MaxLoadTextContainer`]
    )

    this[`${side}LoadTextContainer`].x =
      (TEXT_WIDTH - this[`${side}LoadTextContainer`].width) / 2
    devider.y = this[`${side}LoadTextContainer`].height + 1

    this[`${side}MaxLoadTextContainer`].x =
      (TEXT_WIDTH - this[`${side}MaxLoadTextContainer`].width) / 2
    this[`${side}MaxLoadTextContainer`].y = devider.y + devider.height + 1

    return leftLoadTextGroup
  }

  setLeftWeight(newWeight) {
    this.leftWeight = newWeight
    this.leftWeightText.text = this.leftWeight

    this.leftWeightText.x =
      (this.colorBarLength - this.leftWeightText.width) / 2
  }
  setRightWeight(newWeight) {
    this.rightWeight = newWeight
    this.rightWeightText.text = this.rightWeight

    this.rightWeightText.x =
      this.width - (this.colorBarLength + this.rightWeightText.width) / 2
  }
  setLeftLoad(newLoad) {
    this.leftLoad = newLoad > this.leftMaxLoad ? this.rightMaxLoad : newLoad

    this.leftLoadTextContainer.text = this.leftLoad
    this.leftLoadTextContainer.x =
      (TEXT_WIDTH - this.leftLoadTextContainer.width) / 2
  }
  setRightLoad(newLoad) {
    this.rightLoad = newLoad > this.rightMaxLoad ? this.rightMaxLoad : newLoad

    this.rightLoadTextContainer.text = this.rightLoad
    this.rightLoadTextContainer.x =
      (TEXT_WIDTH - this.rightLoadTextContainer.width) / 2
  }
}
