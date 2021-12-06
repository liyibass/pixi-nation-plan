import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { WeightCard } from './WeightCard'

const TIMER_WIDTH = 69
const TOP_PADDING = 31

// const TOP_PADDING = 0
export class Conveyor {
  constructor(getChoosedWeightCard) {
    this.container = new PIXI.Container()
    this.getChoosedWeightCard = getChoosedWeightCard

    this.width = Globals.getSeesawGameStageDimention().width - TIMER_WIDTH
    this.container.x = TIMER_WIDTH
    this.container.y = TOP_PADDING

    this.gameStage = this.container.parent

    this.firstWeightCard = null
    this.lastWeightCard = null
    this.weightCardCount = 0
    this.createConveyor()

    // this.container.pivot.x = this.container.width / 2
    // this.container.pivot.y = this.colorBarHeight

    // setInterval(() => {
    //   this.container.angle++
    // }, 100)
  }

  createConveyor() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.addNewWeightCard()
      }, i * 1000)
    }
  }

  addNewWeightCard() {
    const { name, weight } = this.getRandomWeight()
    const weightCard = new WeightCard(
      weight,
      name,
      this.weightCardHandler.bind(this)
    )

    // linkList
    const prevCard = this.lastWeightCard
    if (prevCard) {
      prevCard.nextCard = weightCard
    }
    weightCard.prevCard = prevCard

    // update first/last linkList card
    if (weightCard.prevCard === null) {
      this.firstWeightCard = weightCard
    }
    if (weightCard.nextCard === null) {
      this.lastWeightCard = weightCard
    }

    // display card
    this.container.addChild(weightCard.container)
    this.weightCardCount++
    weightCard.startPositionCard()
  }

  startConveyor() {
    this.conveyorTicker = new PIXI.Ticker()

    this.conveyorTicker.add(() => {})

    // this.conveyorTicker.start()
  }

  getRandomWeight() {
    const randomId = Math.floor(Math.random() * 8)

    switch (randomId) {
      case 0:
        return {
          name: 'weightAdult1',
          weight: 100,
        }
      case 1:
        return {
          name: 'weightAdult2',
          weight: 100,
        }
      case 2:
        return {
          name: 'weightChild1',
          weight: 50,
        }
      case 3:
        return {
          name: 'weightChild2',
          weight: 50,
        }
      case 4:
        return {
          name: 'weightElder1',
          weight: 150,
        }
      case 5:
        return {
          name: 'weightElder2',
          weight: 150,
        }
      case 6:
        return {
          name: 'weightBus',
          weight: 500,
        }
      case 7:
        return {
          name: 'weightShop',
          weight: 750,
        }
    }
  }

  weightCardHandler(removedWeightCard) {
    // remove selected card
    this.container.removeChild(removedWeightCard.container)
    this.weightCardCount--

    // align linkList
    if (removedWeightCard.prevCard) {
      removedWeightCard.prevCard.nextCard = removedWeightCard.nextCard
    }
    if (removedWeightCard.nextCard) {
      removedWeightCard.nextCard.prevCard = removedWeightCard.prevCard
    }

    // align rest cards
    this._alignRestCards(removedWeightCard)

    // pass selected card to parent
    this.getChoosedWeightCard(removedWeightCard)
  }

  _alignRestCards(removedWeightCard) {
    alignCard(removedWeightCard.nextCard)

    function alignCard(card) {
      if (!card) return

      card.shiftPosition()

      if (card.nextCard) {
        alignCard(card.nextCard)
      }
    }
  }

  _addNewWeightCard() {}
}
