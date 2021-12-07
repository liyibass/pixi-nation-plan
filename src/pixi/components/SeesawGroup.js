import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

import { SeesawPivot } from '../components/SeesawPivot'
import { SeesawBoard } from '../components/SeesawBoard'
const TIMER_WIDTH = 69

export class SeesawGroup {
  constructor() {
    this.container = new PIXI.Container()
    this.container.name = 'seesawGroup'
    this.createSeesaw()
    this.setPosition()

    this.leftSideFirstCard = null
    this.leftSideLastCard = null
    this.rightSideFirstCard = null
    this.rightSideLastCard = null
  }

  createSeesaw() {
    this.board = new SeesawBoard()
    this.board.container.x = this.board.width / 2

    this.pivot = new SeesawPivot()
    this.pivot.container.x = this.board.container.width / 2

    this.container.addChild(this.board.container, this.pivot.container)

    // const frame = new PIXI.Graphics()
    // // frame.beginFill(0xaaaaaa, 0.1)
    // frame.beginFill(0xffffff)
    // frame.drawRect(0, 0, this.container.width, this.container.height)
    // frame.endFill()
    // this.container.addChild(frame)
  }

  setPosition() {
    this.container.pivot.x = this.container.width / 2
    // this.container.pivot.y = 0
    this.container.pivot.y = this.pivot.container.height
  }

  getChoosedWeightCard(weightCard) {
    console.log('DROP')
    console.log(this)
    console.log(weightCard)

    // clean linkList
    weightCard.prevCard = null
    weightCard.nextCard = null

    if (weightCard.positionTicker && weightCard.positionTicker?.started) {
      weightCard.positionTicker.destroy()
    }
    const { width } = Globals.getSeesawGameStageDimention()

    // put card onto seesaw
    if (weightCard.isOnConveyor) {
      weightCard.isOnConveyor = false

      if (weightCard.container.x + TIMER_WIDTH < width / 2) {
        addToLeft.bind(this)()
      } else {
        addToRight.bind(this)()
      }
    } else {
      if (weightCard.container.x < width / 2) {
        addToLeft.bind(this)()
      } else {
        addToRight.bind(this)()
      }
    }

    // display card
    this.container.addChild(weightCard.container)

    function addToLeft() {
      // linkList
      const prevCard = this.leftSideLastCard
      if (prevCard) {
        prevCard.nextCard = weightCard
      }
      weightCard.prevCard = prevCard

      // update first/last linkList card
      if (weightCard.prevCard === null) {
        this.leftSideFirstCard = weightCard
      }
      if (weightCard.nextCard === null) {
        this.leftSideLastCard = weightCard
      }

      weightCard.container.x =
        width / 4 + Math.floor(Math.random() * 8 - 4) * 15
      weightCard.container.y = -20
    }

    function addToRight() {
      // linkList
      const prevCard = this.rightSideLastCard
      if (prevCard) {
        prevCard.nextCard = weightCard
      }
      weightCard.prevCard = prevCard
      // update first/last linkList card
      if (weightCard.prevCard === null) {
        this.rightSideLastCard = weightCard
      }
      if (weightCard.nextCard === null) {
        this.rightSideLastCard = weightCard
      }

      weightCard.container.x =
        (width * 3) / 4 + Math.floor(Math.random() * 8 - 4) * 20
      weightCard.container.y = -20
    }
  }
}
