import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { WeightCard } from './WeightCard'

const TIMER_WIDTH = 69
const TOP_PADDING = 31
const TOTAL_CARD_COUNT = 10

// const TOP_PADDING = 0
export class Conveyor {
  constructor(getChoosedWeightCard) {
    this.container = new PIXI.Container()
    this.container.name = 'conveyor'
    this.getChoosedWeightCard = getChoosedWeightCard

    this.width = Globals.getSeesawGameStageDimention().width - TIMER_WIDTH
    this.container.x = TIMER_WIDTH
    this.container.y = TOP_PADDING

    this.gameStage = this.container.parent

    this.firstWeightCard = null
    this.lastWeightCard = null
    this.conveyorCardCount = 0
    this.showedCardCount = 0

    this.stop = false

    this.createConveyor()

    // this.container.pivot.x = this.container.width / 2
    // this.container.pivot.y = this.colorBarHeight

    // setInterval(() => {
    //   this.container.angle++
    // }, 100)
  }

  createConveyor() {
    // for (let i = 0; i < 8; i++) {
    //   this.addNewWeightCard()
    //   setTimeout(() => {
    //   }, i * 2000)
    // }
  }

  addNewWeightCard() {
    const { name, weight, load } = this.getRandomWeight()
    const weightCard = new WeightCard(
      weight,
      name,
      load,
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
    this.conveyorCardCount++
    this.showedCardCount++
    weightCard.startPositionCard()
  }

  startConveyor() {
    this.stop = false
    this._addWeightCardContinously()

    startPositionCard(this.firstWeightCard)

    function startPositionCard(card) {
      if (!card || !card?.positionTicker) return

      // for handling start after pause
      card.positionTicker.start()

      if (card.nextCard) {
        startPositionCard(card.nextCard)
      }
    }
  }

  stopConveyor() {
    this.stop = true
    clearTimeout(this.addNewCardTimeout)

    console.log(this.firstWeightCard)
    stopPositioningCard(this.firstWeightCard)

    function stopPositioningCard(card) {
      if (!card) return

      card.positionTicker.stop()

      if (card.nextCard) {
        stopPositioningCard(card.nextCard)
      }
    }
  }

  _addWeightCardContinously() {
    const createNewWeightCardTimeout = () => {
      this.addNewWeightCardTimeout = setTimeout(() => {
        if (this.stop) return

        if (
          this.conveyorCardCount < 7 &&
          this.showedCardCount < TOTAL_CARD_COUNT
        ) {
          this.addNewWeightCard()
        }

        createNewWeightCardTimeout()
      }, 2000)
    }

    createNewWeightCardTimeout()
  }

  getRandomWeight() {
    const randomId = Math.floor(Math.random() * 8)

    switch (randomId) {
      case 0:
        return {
          name: 'weightAdult1',
          weight: 100,
          load: 1,
        }
      case 1:
        return {
          name: 'weightAdult2',
          weight: 100,
          load: 1,
        }
      case 2:
        return {
          name: 'weightChild1',
          weight: 50,
          load: 1,
        }
      case 3:
        return {
          name: 'weightChild2',
          weight: 50,
          load: 1,
        }
      case 4:
        return {
          name: 'weightElder1',
          weight: 150,
          load: 1,
        }
      case 5:
        return {
          name: 'weightElder2',
          weight: 150,
          load: 1,
        }
      case 6:
        return {
          name: 'weightBus',
          weight: 500,
          load: 4,
        }
      case 7:
        return {
          name: 'weightShop',
          weight: 750,
          load: 4,
        }
    }
  }

  weightCardHandler(removedWeightCard) {
    if (removedWeightCard.isOnConveyor) {
      console.log('if in weightCardHandler')

      // align linkList
      if (removedWeightCard.prevCard) {
        removedWeightCard.prevCard.nextCard = removedWeightCard.nextCard
      } else if (removedWeightCard.nextCard) {
        this.firstWeightCard = removedWeightCard.nextCard
      } else {
        this.firstWeightCard = null
      }
      if (removedWeightCard.nextCard) {
        removedWeightCard.nextCard.prevCard = removedWeightCard.prevCard
      } else {
        this.lastWeightCard = removedWeightCard.prevCard
      }

      // align rest cards
      this._alignRestCards(removedWeightCard)

      // remove selected card
      this.container.removeChild(removedWeightCard.container)
      this.conveyorCardCount--

      // pass selected card to parent
      this.getChoosedWeightCard(removedWeightCard)
    } else {
      console.log('else in weightCardHandler')
      // pass selected card to parent
      this.getChoosedWeightCard(removedWeightCard)
    }
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
}
