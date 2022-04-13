import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { WeightCard } from './WeightCard'

const TIMER_WIDTH = 69
const TOP_PADDING = 31
const TOTAL_CARD_COUNT = 32

// const TOP_PADDING = 0
export class Conveyor {
  constructor(getChoosedWeightCard, gameLevel) {
    this.container = new PIXI.Container()
    this.container.name = 'conveyor'
    this.getChoosedWeightCard = getChoosedWeightCard
    this.cardCount = 0
    this.gameLevel = gameLevel

    this.width = Globals.getSeesawGameStageDimention().width
    this.container.x = TIMER_WIDTH
    this.container.y = TOP_PADDING

    this.gameStage = this.container.parent

    this.firstWeightCard = null
    this.lastWeightCard = null
    this.conveyorCardCount = 0
    this.showedCardCount = 0

    this.stop = false

    this.conveyorOrderArray = []
    this.createConveyor()
    this.handleConveyorOrderArray()
  }

  createConveyor() {
    // for (let i = 0; i < 8; i++) {
    //   this.addNewWeightCard()
    //   setTimeout(() => {
    //   }, i * 2000)
    // }

    // create mask
    const mask = new PIXI.Graphics()
    mask.beginFill(0xff0000)
    mask.drawRect(0, 0, this.width, window.innerHeight)
    mask.endFill()
    mask.x = -TIMER_WIDTH
    this.container.addChild(mask)
    this.container.mask = mask
  }

  handleConveyorOrderArray() {
    if (this.gameLevel === 0) {
      this.conveyorOrderArray = [0, 1, 0, 2, 3, 2, 4, 5, 4]
    }
  }

  // TODO:
  addNewWeightCard(cardType) {
    const { name, weight, load } = this.getCertainOrRandomWeightCard(cardType)
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

  startConveyor(gameLevel) {
    this.stop = false
    this._addWeightCardContinously(gameLevel)

    startPositionCard(this.firstWeightCard)

    function startPositionCard(card) {
      try {
        if (!card) return

        // for handling start after pause
        if (card?.positionTicker) {
          card.positionTicker.start()
        }

        if (card.nextCard) {
          startPositionCard(card.nextCard)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  stopConveyor() {
    this.stop = true
    clearTimeout(this.addNewCardTimeout)

    stopPositioningCard(this.firstWeightCard)

    function stopPositioningCard(card) {
      if (!card) return

      if (card?.positionTicker) {
        card.positionTicker.stop()
      }

      if (card.nextCard) {
        stopPositioningCard(card.nextCard)
      }
    }
  }

  _addWeightCardContinously(gameLevel) {
    if (gameLevel === 2) {
      this.addNewWeightCard(6)
    }

    const createNewWeightCardTimeout = () => {
      this.addNewWeightCardTimeout = setTimeout(() => {
        if (this.stop) return

        if (
          this.conveyorCardCount < 7 &&
          this.showedCardCount < TOTAL_CARD_COUNT
        ) {
          if (this.gameLevel === 0) {
            const nextCardType = this.conveyorOrderArray.shift()

            if (typeof nextCardType !== 'number' && !nextCardType) return

            this.addNewWeightCard()
            this.cardCount++
          } else {
            this.addNewWeightCard()
            this.cardCount++
          }
        }

        // level 0 only has 9 card total
        if (!(gameLevel === 0 && this.cardCount === 9)) {
          createNewWeightCardTimeout()
        }
      }, 2000)
    }

    createNewWeightCardTimeout()
  }

  getCertainOrRandomWeightCard(cardType) {
    const randomId = cardType || Math.floor(Math.random() * 5)

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
