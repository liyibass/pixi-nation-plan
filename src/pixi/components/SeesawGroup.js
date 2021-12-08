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

    this.leftTotalWeight = 0
    this.rightTotalWeight = 0

    this.tick = 0
    this.prevTick = 0
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
    Globals.SEESAW_HEIGHT = this.container.height
  }

  getChoosedWeightCard(weightCard) {
    console.log('DROP')
    console.log(weightCard)

    // add seesaw ref into card
    weightCard.seesawGroupRef = this
    weightCard.seesawBoardRef = this.board

    // clean linkList
    weightCard.prevCard = null
    weightCard.nextCard = null

    // clear card's position ticker
    if (weightCard.positionTicker && weightCard.positionTicker?.started) {
      weightCard.positionTicker.destroy()
    }
    const { width } = Globals.getSeesawGameStageDimention()

    // put card onto seesaw
    if (weightCard.isOnConveyor) {
      // card is from conveyor to seesaw
      weightCard.isOnConveyor = false

      // display card
      this.board.container.addChild(weightCard.container)

      // put card onto board,and calculate each side's weight
      if (weightCard.container.x + TIMER_WIDTH < width / 2) {
        weightCard.seesawSide = 'left'
        addToLeft.bind(this)()
        this.leftTotalWeight += weightCard.weight
      } else {
        weightCard.seesawSide = 'right'
        addToRight.bind(this)()
        this.rightTotalWeight += weightCard.weight
      }

      // update left/right weight text
      this.board.setLeftWeight(this.leftTotalWeight)
      this.board.setRightWeight(this.rightTotalWeight)
    } else {
      // card is from seesaw's another side,and re calculate each side's weight
      if (weightCard.container.x < width / 2) {
        addToLeft.bind(this)()

        if (weightCard.seesawSide === 'right') {
          weightCard.seesawSide = 'left'
          this.leftTotalWeight += weightCard.weight
          this.rightTotalWeight -= weightCard.weight
        }
      } else {
        addToRight.bind(this)()

        if (weightCard.seesawSide === 'left') {
          weightCard.seesawSide = 'right'
          this.rightTotalWeight += weightCard.weight
          this.leftTotalWeight -= weightCard.weight
        }
      }
      console.log(weightCard.seesawSide)
      console.log(this.leftTotalWeight)
      console.log(this.rightTotalWeight)

      // update left/right weight text
      this.board.setLeftWeight(this.leftTotalWeight)
      this.board.setRightWeight(this.rightTotalWeight)
    }

    // hide card's weight text
    weightCard.weightText.alpha = 0

    this.rotateBoard()

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

  rotateBoard() {
    if (this.seesawRotateTicker?.started) {
      this.seesawRotateTicker.destroy()
    }

    this.seesawRotateTicker = new PIXI.Ticker()

    this.seesawRotateTicker.add(() => {
      const difference = this.rightTotalWeight - this.leftTotalWeight
      const speed = Math.abs(Math.floor(difference / 50))
      // console.log(this.leftTotalWeight)
      // console.log(this.rightTotalWeight)
      // console.log(direction)
      // console.log(targetAngle)

      if (difference > 0) {
        this.seesawRotateTicker.start()
        if (this.board.container.angle < 20) {
          this.board.container.angle += 0.01 * speed
        } else {
          console.log('warning!')
          this.seesawRotateTicker.destroy()
        }
      } else if (difference < 0) {
        this.seesawRotateTicker.start()
        if (this.board.container.angle > -20) {
          this.board.container.angle -= 0.01 * speed
        } else {
          console.log('warning!')
          this.seesawRotateTicker.destroy()
        }
      } else if (difference === 0 && this.board.container.angle > 0) {
        this.seesawRotateTicker.start()
        this.board.container.angle -= 0.02
      } else if (difference === 0 && this.board.container.angle < 0) {
        this.seesawRotateTicker.start()
        this.board.container.angle += 0.02
      } else {
        // this.board.container.angle = 0
        this.seesawRotateTicker.destroy()
      }
    })

    this.seesawRotateTicker.start()
  }
}
