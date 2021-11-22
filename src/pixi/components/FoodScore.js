import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class FoodScore {
  constructor() {
    this.container = new PIXI.Container()
    this.createFoodScore()

    this.score = {
      fauset: 0,
      incinerator: 0,
    }
    this.liyi = 'Y^OYO'
  }

  createFoodScore() {
    const incineratorScoreGroup = this.createScoreGroup('incinerator')
    const fausetScoreGroup = this.createScoreGroup('fauset')

    this.container.addChild(fausetScoreGroup, incineratorScoreGroup)
  }

  createScoreGroup(poisonName) {
    const scoreContainer = new PIXI.Container()

    const poisonTexture = Globals.resources[poisonName].texture

    const poisonSprite = new PIXI.Sprite(poisonTexture)
    console.log(this)
    const poisonScore = new PIXI.Text(this.score[poisonName], {
      fontSize: 16,
      fill: [0xffffff],
    })

    scoreContainer.addChild(poisonSprite, poisonScore)
    return scoreContainer
  }
}
