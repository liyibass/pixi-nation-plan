import * as PIXI from 'pixi.js'
import { Chimney } from './Chimney'
import { Globals } from '../script/Globals'
import { Car } from './Car'
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
    const SOLAR_BAORD_WIDTH = 74
    const SOLAR_BAORD_DISTANCE = (gameStageDimention.width * 4) / 5
    const SOLAR_BOARD_COUNT =
      Math.floor(1000 / (SOLAR_BAORD_DISTANCE - SOLAR_BAORD_WIDTH)) + 2

    // const CHIMNEY_DISTANCE = gameStageDimention.width / 3

    for (let i = 0; i < SOLAR_BOARD_COUNT; i++) {
      const solarBoard = new Water(i, this.collisionMonitor)
      solarBoard.container.y =
        gameStageDimention.height + solarBoard.container.height
      // solarBoard.container.y =
      //   gameStageDimention.height + solarBoard.container.height
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

  _createKaohsiung() {}

  _createMountain() {}

  _createYilan() {}
}
