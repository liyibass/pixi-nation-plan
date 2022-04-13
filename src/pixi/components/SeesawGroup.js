import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

import { SeesawPivot } from '../components/SeesawPivot'
import { SeesawBoard } from '../components/SeesawBoard'
import { SeesawButton } from '../components/SeesawButton'
const TIMER_WIDTH = 69
const LIMIT = 17

const { width } = Globals.getSeesawGameStageDimention()

export class SeesawGroup {
  constructor(gameLevel = 0) {
    this.container = new PIXI.Container()
    this.container.name = 'seesawGroup'
    this.gameLevel = gameLevel
    this.conveyor

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

    this.cardCountOnBoard = 0
  }

  createSeesaw() {
    this.board = new SeesawBoard()
    this.pivot = new SeesawPivot(this.gameLevel)
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

  addNewWeightCardToBoard(weightCard, side = 'left') {
    console.log('addNewWeightCardToBoard')
    // add seesaw ref into card
    weightCard.seesawGroupRef = this
    weightCard.seesawBoardRef = this.board

    // clean linkList
    weightCard.prevCard = null
    weightCard.nextCard = null

    weightCard.isOnConveyor = false

    // display card
    this.board.container.addChild(weightCard.container)

    switch (side) {
      default:
      case 'left':
        weightCard.seesawSide = 'left'
        this._addToLeft(weightCard)
        this.leftTotalWeight += weightCard.weight
        this.leftLoad += weightCard.load
        break

      case 'right':
        weightCard.seesawSide = 'right'
        this._addToRight(weightCard)
        this.rightTotalWeight += weightCard.weight
        this.rightLoad += weightCard.load
        break
    }

    // hide card's weight text
    weightCard.weightText.alpha = 0

    // update left/right weight text
    this.board.setLeftWeight(this.leftTotalWeight)
    this.board.setRightWeight(this.rightTotalWeight)
    this.board.setLeftLoad(this.leftLoad)
    this.board.setRightLoad(this.rightLoad)

    this.rotateBoard()
  }

  getChoosedWeightCard(weightCard) {
    // block rest cards

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

    // put card onto seesaw
    if (weightCard.isOnConveyor) {
      // card is from conveyor to seesaw
      weightCard.isOnConveyor = false
      console.log('getChoosedWeightCard')
      this.cardCountOnBoard++

      // display card
      this.board.container.addChild(weightCard.container)

      // put card onto board,and calculate each side's weight
      if (weightCard.container.x + TIMER_WIDTH < width / 2) {
        weightCard.seesawSide = 'left'
        this._addToLeft(weightCard)
        this.leftTotalWeight += weightCard.weight
        this.leftLoad += weightCard.load
      } else {
        weightCard.seesawSide = 'right'
        this._addToRight(weightCard)
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
        this._addToLeft(weightCard)

        if (weightCard.seesawSide === 'right') {
          weightCard.seesawSide = 'left'
          this.leftTotalWeight += weightCard.weight
          this.rightTotalWeight -= weightCard.weight
          this.leftLoad += weightCard.load
          this.rightLoad -= weightCard.load
        }
      } else {
        this._addToRight(weightCard)

        if (weightCard.seesawSide === 'left') {
          weightCard.seesawSide = 'right'
          this.rightTotalWeight += weightCard.weight
          this.leftTotalWeight -= weightCard.weight
          this.leftLoad -= weightCard.load
          this.rightLoad += weightCard.load
        }
      }

      // update left/right weight text
      this.board.setLeftWeight(this.leftTotalWeight)
      this.board.setRightWeight(this.rightTotalWeight)
      this.board.setLeftLoad(this.leftLoad)
      this.board.setRightLoad(this.rightLoad)
    }

    // hide card's weight text
    weightCard.weightText.alpha = 0

    this.rotateBoard()
  }

  _addToLeft(weightCard) {
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

    weightCard.container.x = width / 4 + Math.floor(Math.random() * 8 - 4) * 15
    weightCard.container.y = -20
  }

  _addToRight(weightCard) {
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

  rotateBoard() {
    if (this.seesawRotateTicker?.started) {
      this.seesawRotateTicker.stop()
    }

    this.seesawRotateTicker = new PIXI.Ticker()

    this.seesawRotateTicker.add(() => {
      const difference = this.rightTotalWeight - this.leftTotalWeight

      const speed = Math.abs(0.01)

      if (difference > 0) {
        this.seesawRotateTicker.start()
        if (this.board.container.angle < LIMIT) {
          this.board.container.angle += speed
        } else {
          this.seesawRotateTicker.stop()
          console.log('warning!')
          this.rightButton.warning()
          this.setDeathCountDown()
        }
      } else if (difference < 0) {
        this.seesawRotateTicker.start()
        if (this.board.container.angle > -LIMIT) {
          this.board.container.angle -= speed
        } else {
          this.seesawRotateTicker.stop()
          console.log('warning!')
          this.leftButton.warning()
          this.setDeathCountDown()
        }
      } else if (
        difference === 0 &&
        Math.abs(this.board.container.angle) <= 2
      ) {
        if (this.gameLevel === 0 && this.conveyor?.cardCount < 9) {
          console.log("it's now game level 0")
          console.log(this.conveyor?.cardCount)
        }

        this.board.container.angle = 0
        this.seesawRotateTicker.stop()
        this.setClearCountDown()
      } else if (difference === 0 && this.board.container.angle > 0) {
        this.seesawRotateTicker.start()
        this.board.container.angle -= 0.05
      } else if (difference === 0 && this.board.container.angle < 0) {
        this.seesawRotateTicker.start()
        this.board.container.angle += 0.05
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
        if (this.gameLevel === 0 && this.cardCountOnBoard < 9) {
          clearInterval(this.clearCountDown)
        } else {
          this.isClear = true
          console.log('CLEAR')
        }
      } else {
        clearInterval(this.clearCountDown)
      }
    }, 2000)
  }

  clearClearCountDown() {
    clearInterval(this.clearCountDown)
  }
}
