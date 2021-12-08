import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

import { SeesawPivot } from '../components/SeesawPivot'
import { SeesawBoard } from '../components/SeesawBoard'
import { SeesawButton } from '../components/SeesawButton'
const TIMER_WIDTH = 69
const LIMIT = 17

export class SeesawGroup {
  constructor() {
    this.container = new PIXI.Container()
    this.container.name = 'seesawGroup'
    this.createSeesaw()
    this.createSeesawButton()
    this.setPosition()

    this.leftSideFirstCard = null
    this.leftSideLastCard = null
    this.rightSideFirstCard = null
    this.rightSideLastCard = null

    this.leftTotalWeight = 0
    this.rightTotalWeight = 0

    this.leftLoad = 0
    this.rightLoad = 0

    this.tick = 0
    this.prevTick = 0

    this.isDead = false
    this.isClear = false
  }

  createSeesaw() {
    this.board = new SeesawBoard()
    this.pivot = new SeesawPivot()
    this.container.addChild(this.board.container, this.pivot.container)

    this.board.container.x = this.container.width / 2
    this.pivot.container.x = this.board.container.width / 2
  }

  createSeesawButton() {
    this.leftButton = new SeesawButton()
    this.rightButton = new SeesawButton()
    this.container.addChild(
      this.leftButton.container,
      this.rightButton.container
    )
    this.leftButton.container.x = 0
    this.leftButton.container.y = this.pivot.container.height

    this.rightButton.container.x = this.board.container.width
    this.rightButton.container.y = this.pivot.container.height
  }

  setPosition() {
    this.container.pivot.x = this.container.width / 2
    // this.container.pivot.y = 0
    this.container.pivot.y = this.pivot.container.height
    Globals.SEESAW_HEIGHT = this.container.height
  }

  getChoosedWeightCard(weightCard) {
    // console.log('DROP')
    // console.log(weightCard)

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
        this.leftLoad += weightCard.load
      } else {
        weightCard.seesawSide = 'right'
        addToRight.bind(this)()
        this.rightTotalWeight += weightCard.weight
        this.rightLoad += weightCard.load
      }

      // update left/right weight text
      this.board.setLeftWeight(this.leftTotalWeight)
      this.board.setRightWeight(this.rightTotalWeight)
      this.board.setLeftLoad(this.leftLoad)
      this.board.setRightLoad(this.rightLoad)
    } else {
      // card is from seesaw's another side,and re calculate each side's weight
      if (weightCard.container.x < width / 2) {
        addToLeft.bind(this)()

        if (weightCard.seesawSide === 'right') {
          weightCard.seesawSide = 'left'
          this.leftTotalWeight += weightCard.weight
          this.rightTotalWeight -= weightCard.weight
          this.leftLoad += weightCard.load
          this.rightLoad -= weightCard.load
        }
      } else {
        addToRight.bind(this)()

        if (weightCard.seesawSide === 'left') {
          weightCard.seesawSide = 'right'
          this.rightTotalWeight += weightCard.weight
          this.leftTotalWeight -= weightCard.weight
          this.leftLoad -= weightCard.load
          this.rightLoad += weightCard.load
        }
      }
      console.log(weightCard.seesawSide)
      console.log(this.leftTotalWeight)
      console.log(this.rightTotalWeight)

      // update left/right weight text
      this.board.setLeftWeight(this.leftTotalWeight)
      this.board.setRightWeight(this.rightTotalWeight)
      this.board.setLeftLoad(this.leftLoad)
      this.board.setRightLoad(this.rightLoad)
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
      this.seesawRotateTicker.stop()
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
        if (this.board.container.angle < LIMIT) {
          this.board.container.angle += 0.01 * speed
        } else {
          this.seesawRotateTicker.stop()
          console.log('warning!')
          this.rightButton.warning()
          this.setDeathCountDown()
        }
      } else if (difference < 0) {
        this.seesawRotateTicker.start()
        if (this.board.container.angle > -LIMIT) {
          this.board.container.angle -= 0.01 * speed
        } else {
          this.seesawRotateTicker.stop()
          console.log('warning!')
          this.leftButton.warning()
          this.setDeathCountDown()
        }
      } else if (
        difference === 0 &&
        Math.abs(this.board.container.angle) <= 0.02
      ) {
        this.board.container.angle = 0
        this.seesawRotateTicker.stop()
        this.setClearCountDown()
      } else if (difference === 0 && this.board.container.angle > 0) {
        this.seesawRotateTicker.start()
        this.board.container.angle -= 0.02
      } else if (difference === 0 && this.board.container.angle < 0) {
        this.seesawRotateTicker.start()
        this.board.container.angle += 0.02
      }

      if (
        this.board.container.angle < LIMIT &&
        this.board.container.angle > -LIMIT &&
        (this.leftButton.isWarning || this.rightButton.isWarning)
      ) {
        this.leftButton.unWarning()
        this.rightButton.unWarning()
      }
    })

    this.seesawRotateTicker.start()
  }

  stopSeesawGroup() {
    if (this.seesawRotateTicker) {
      this.seesawRotateTicker.stop()
    }
  }

  startSeesawGroup() {
    if (this.seesawRotateTicker) {
      this.seesawRotateTicker.start()
    }
  }

  setDeathCountDown() {
    this.deathCountDown = setTimeout(() => {
      if (
        this.board.container.angle >= LIMIT ||
        this.board.container.angle <= -LIMIT
      ) {
        this.isDead = true
      } else {
        clearInterval(this.deathCountDown)
      }
    }, 6000)
  }

  clearDeathCountDown() {
    clearInterval(this.deathCountDown)
  }

  setClearCountDown() {
    this.clearCountDown = setTimeout(() => {
      if (
        this.leftTotalWeight > 0 &&
        this.leftTotalWeight === this.rightTotalWeight
      ) {
        this.isClear = true
        console.log('CLEAR')
      } else {
        clearInterval(this.clearCountDown)
      }
    }, 6000)
  }
}
