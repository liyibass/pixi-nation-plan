import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { WeightCard } from './WeightCard'

const TIMER_WIDTH = 69
const TOP_PADDING = 31
export class Conveyor {
  constructor() {
    this.container = new PIXI.Container()

    this.width = Globals.getSeesawGameStageDimention().width - TIMER_WIDTH
    this.container.x = TIMER_WIDTH
    this.container.y = TOP_PADDING

    this.createConveyor()
    this.createMask()

    // this.container.pivot.x = this.container.width / 2
    // this.container.pivot.y = this.colorBarHeight

    // setInterval(() => {
    //   this.container.angle++
    // }, 100)
  }

  createConveyor() {
    for (let i = 0; i < 10; i++) {
      const { name, weight } = this.getRandomWeight()
      const weightCard = new WeightCard(weight, name)
      weightCard.container.x = this.container.width

      this.container.addChild(weightCard.container)
    }
  }

  createMask() {
    const mask = new PIXI.Graphics()
    mask.beginFill(0xffffff)
    mask.drawRect(0, 0, this.width, 70)

    this.container.mask = mask
    this.container.addChild(mask)
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
}
