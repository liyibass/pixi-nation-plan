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

    this.weightCardArray = []
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
        this.addNewWeightCard(i)
      }, i * 1000)
    }
  }

  addNewWeightCard(index) {
    const { name, weight } = this.getRandomWeight()
    const weightCard = new WeightCard(
      weight,
      name,
      index,
      this.weightCardArray,
      this.weightCardHandler.bind(this)
    )
    // weightCard.positionCard(this.weightCardArray)

    this.container.addChild(weightCard.container)
    this.weightCardArray.push(weightCard)
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
    this.weightCardArray.splice(removedWeightCard.index, 1)

    // align rest cards
    this._moveWeightCardAlign(removedWeightCard)

    // pass selected card to parent
    this.getChoosedWeightCard(removedWeightCard)
  }

  _moveWeightCardAlign(removedWeightCard) {
    const nextWeightCardIndex = removedWeightCard.index

    // update rest card's index
    for (let i = nextWeightCardIndex; i < this.weightCardArray.length; i++) {
      const nextCard = this.weightCardArray[i]
      nextCard.index -= 1
      nextCard.shiftPosition()
    }
  }

  _addNewWeightCard() {}
}
