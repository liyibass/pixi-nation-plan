import * as PIXI from 'pixi.js'
import { Chimney } from './Chimney'
import { Globals } from '../script/Globals'
import { Car } from './Car'
import { House } from './House'
import { SolarBoard } from './SolarBoard'
import { Water } from './Water'

const gameStageDimention = Globals.getRunGameStageDimention()

export class CityObstacle {
  constructor(cityName, obstacleWidth, collisionMonitor) {
    this.cityName = cityName
    this.obstacleWidth = obstacleWidth
    this.collisionMonitor = collisionMonitor

    this.container = new PIXI.Container()
    this.container.name = `cityObstacle-${this.cityName}`
    this.obstacleArray = []

    this.createCityObstacle()
  }

  createCityObstacle() {
    switch (this.cityName) {
      case 'Taoyuan':
        this._createTaoyuan()
        break

      case 'Hsinchu':
        this._createHsinchu()
        break

      case 'Miaoli':
        this._createMiaoli()
        break

      case 'Yunlin':
        this._createYunlin()
        break

      case 'Kaohsiung':
        this._createKaohsiung()
        break

      case 'Mountain':
        this._createMountain()
        break

      case 'Yilan':
        this._createYilan()
        break

      default:
        this._createTaoyuan()
        break
    }
  }

  obstacleHandler() {}

  _createTaoyuan() {
    const CHIMNEY_COUNT = 6
    // const CHIMNEY_DISTANCE = gameStageDimention.width / 3
    const CHIMNEY_DISTANCE = (gameStageDimention.width * 2) / 3

    for (let i = 0; i < CHIMNEY_COUNT; i++) {
      const chimney = new Chimney(i, this.collisionMonitor)
      chimney.container.y = gameStageDimention.height
      chimney.container.x =
        CHIMNEY_DISTANCE * i +
        Math.floor(
          (Math.random() * CHIMNEY_DISTANCE) / 2 - CHIMNEY_DISTANCE / 4
        )

      this.obstacleArray.push(chimney)

      this.container.addChild(chimney.container)

      chimney.startObstacleTicker()
    }
  }

  _createHsinchu() {
    // const CAR_WIDTH = 90
    // const CHIMNEY_DISTANCE = gameStageDimention.width / 3
    const CAR_DISTANCE = (gameStageDimention.width * 3) / 5
    const CAR_COUNT =
      Math.floor((gameStageDimention.width * 2) / CAR_DISTANCE) * 2

    for (let i = 0; i < CAR_COUNT; i++) {
      const car = new Car(i, this.collisionMonitor)
      car.container.y = gameStageDimention.height
      car.container.x =
        CAR_DISTANCE * i - Math.floor((Math.random() * CAR_DISTANCE) / 2)
      this.obstacleArray.push(car)

      this.container.addChild(car.container)
      car.startObstacleTicker()
    }
  }

  _createMiaoli() {
    const SOLAR_BAORD_WIDTH = 74
    const SOLAR_BAORD_DISTANCE = (gameStageDimention.width * 4) / 5
    const SOLAR_BOARD_COUNT =
      Math.floor(1000 / (SOLAR_BAORD_DISTANCE - SOLAR_BAORD_WIDTH)) + 2

    // const CHIMNEY_DISTANCE = gameStageDimention.width / 3

    for (let i = 0; i < SOLAR_BOARD_COUNT; i++) {
      const solarBoard = new SolarBoard(i, this.collisionMonitor)
      solarBoard.container.y = gameStageDimention.height
      solarBoard.container.x =
        SOLAR_BAORD_DISTANCE * i +
        Math.floor(
          (Math.random() * SOLAR_BAORD_DISTANCE) / 2 - SOLAR_BAORD_DISTANCE / 4
        )

      this.obstacleArray.push(solarBoard)

      this.container.addChild(solarBoard.container)
      solarBoard.startObstacleTicker()
    }
  }

  _createYunlin() {
    const WATER_WIDTH = 74
    const WATER_DISTANCE = (gameStageDimention.width * 3) / 5
    const WATER_COUNT = Math.floor(1000 / (WATER_DISTANCE - WATER_WIDTH)) + 2

    // const CHIMNEY_DISTANCE = gameStageDimention.width / 3

    for (let i = 1; i <= WATER_COUNT; i++) {
      const water = new Water(i + 200, this.collisionMonitor)
      water.container.y = gameStageDimention.height + water.container.height
      // solarBoard.container.y =
      //   gameStageDimention.height + solarBoard.container.height
      water.container.x = WATER_DISTANCE * (i - 1) + WATER_DISTANCE / 5
      Math.floor((Math.random() * WATER_DISTANCE) / 4)

      this.obstacleArray.push(water)
      this.container.addChild(water.container)
      // water.startObstacleTicker()

      // add obstacle floating on the water

      for (let j = 1; j <= water.waterWidthLevel; j++) {
        // let floatingObstacle = {}
        // switch (j % 2) {
        //   case 0:
        //     floatingObstacle = new House(j, this.collisionMonitor)
        //     break

        //   default:
        //   case 1:
        //     floatingObstacle = new Car(j, this.collisionMonitor)
        //     break
        // }

        // floatingObstacle.container.y = gameStageDimention.height
        // floatingObstacle.container.x = water.container.x

        // this.obstacleArray.push(floatingObstacle)
        // this.container.addChild(floatingObstacle.container)
        // floatingObstacle.startObstacleTicker()

        const floatingObstacle =
          j % 2 === 0
            ? new Car(i * 10 + j, this.collisionMonitor, true)
            : new House(i * 10 + j, this.collisionMonitor)

        floatingObstacle.container.y =
          floatingObstacle.obstacleName === 'house'
            ? gameStageDimention.height
            : gameStageDimention.height + 15
        floatingObstacle.container.x =
          water.container.x -
          water.container.width / 2 +
          (water.container.width / (water.waterWidthLevel + 1)) * j

        this.obstacleArray.push(floatingObstacle)
        this.container.addChild(floatingObstacle.container)
        floatingObstacle.startObstacleTicker()
      }

      this.container.setChildIndex(
        water.container,
        this.container.children.length - 1
      )
    }

    // const CAR_DISTANCE = (gameStageDimention.width * 3) / 5
    // const CAR_COUNT =
    //   Math.floor((gameStageDimention.width * 2) / CAR_DISTANCE) * 2

    // for (let i = 0; i < CAR_COUNT; i++) {
    //   const car = new Car(i, this.collisionMonitor)
    //   car.container.y = gameStageDimention.height
    //   car.container.x =
    //     CAR_DISTANCE * i - Math.floor((Math.random() * CAR_DISTANCE) / 2)
    //   this.obstacleArray.push(car)

    //   this.container.addChild(car.container)
    //   car.startObstacleTicker()
    // }
  }

  _createYunlinX() {
    // const CAR_WIDTH = 90
    // const CHIMNEY_DISTANCE = gameStageDimention.width / 3
    const CAR_DISTANCE = (gameStageDimention.width * 1) / 5
    const CAR_COUNT =
      Math.floor((gameStageDimention.width * 2) / CAR_DISTANCE) * 2

    for (let i = 0; i < CAR_COUNT; i++) {
      const car = new Car(i, this.collisionMonitor)
      car.container.y = gameStageDimention.height
      car.container.x = CAR_DISTANCE * i
      this.obstacleArray.push(car)

      this.container.addChild(car.container)
      car.startObstacleTicker()
    }
  }

  _createKaohsiung() {}

  _createMountain() {}

  _createYilan() {}
}
