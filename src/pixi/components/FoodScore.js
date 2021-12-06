import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

export class FoodScore {
  constructor(poisonType) {
    this.poisonType = poisonType
    this.score = {
      fauset: 0,
      incinerator: 0,
    }
    this.passScore = {
      fauset: 1,
      incinerator: 1,
    }
    this.container = new PIXI.Container()
    this.initPosition()
    this.createFoodScore()
  }

  initPosition() {
    const { x, y } = Globals.getGameStageDimention()

    this.container.x = x
    this.container.y = y - 33
  }

  createFoodScore() {
    this.incineratorScoreGroup = this.createScoreGroup(this.poisonType)

    this.container.addChild(this.incineratorScoreGroup)
  }

  createScoreGroup(poisonType) {
    const scoreContainer = new PIXI.Container()

    const texture = Globals.resources[poisonType].texture

    const sprite = new PIXI.Sprite(texture)
    sprite.width = 25
    sprite.height = 25

    const poisonScore = new PIXI.Text(
      `${this.score[poisonType]} / ${this.passScore[poisonType]}`,
      {
        fontSize: 16,

        fill: [0xffffff],
      }
    )

    this[`${poisonType}ScoreText`] = poisonScore
    console.log(`${poisonType}ScoreText`)
    console.log(this[`${poisonType}ScoreText`])
    scoreContainer.addChild(sprite, poisonScore)
    poisonScore.x = 25 + 8
    poisonScore.y = scoreContainer.height / 2 - poisonScore.height / 2
    return scoreContainer
  }

  eatPoisonAndVerifyIfPassedGame(poisonType) {
    console.log(poisonType)
    console.log(this)
    this.score[poisonType] += 1
    this.updateScoreWord(poisonType)

    return this.score[poisonType] === this.passScore[poisonType]
  }

  updateScoreWord(poisonType) {
    this[
      `${poisonType}ScoreText`
    ].text = `${this.score[poisonType]} / ${this.passScore[poisonType]}`
  }
}