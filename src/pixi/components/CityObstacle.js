import * as PIXI from 'pixi.js'
import { Chimney } from './Chimney'
import { Globals } from '../script/Globals'
import { Car } from './Car'
import { House } from './House'
import { SolarBoard } from './SolarBoard'
import { Water } from './Water'
import { Rock } from './Rock'
import { FinishLine } from './FinishLine'

const gameStageDimention = Globals.getRunGameStageDimention()

export class CityObstacle {
  constructor(
    cityName,
    obstacleWidth,
    collisionMonitor,
    player,
    obstacleCallbackArray
  ) {
    this.cityName = cityName
    this.obstacleWidth = obstacleWidth
    this.collisionMonitor = collisionMonitor
    ;(this.player = player),
      (this.obstacleCallbackArray = obstacleCallbackArray)

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
    const CHIMNEY_WIDTH = 30
    const CHIMNEY_DISTANCE = window.innerWidth > 500 ? 700 : 500
    const CHIMNEY_UNIT = CHIMNEY_DISTANCE + CHIMNEY_WIDTH
    const CHIMNEY_COUNT = Math.floor(this.obstacleWidth / CHIMNEY_UNIT)

    // const CHIMNEY_DISTANCE = gameStageDimention.width / 3

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

      chimney.getObstacleTickerCallback(this.obstacleCallbackArray)
    }
  }

  _createHsinchu() {
    // const CAR_WIDTH = 90
    // const CHIMNEY_DISTANCE = gameStageDimention.width / 3
    const CAR_WIDTH = 50
    const CAR_DISTANCE = 200
    const CAR_UNIT = CAR_DISTANCE + CAR_WIDTH
    const CAR_COUNT = Math.floor(this.obstacleWidth / CAR_UNIT)

    let totalWidth = 0
    for (let i = 0; i < CAR_COUNT; i++) {
      const car = new Car(i, this.collisionMonitor)

      const interval = i % 2 === 1 ? CAR_DISTANCE + Math.random() * 50 : 0

      car.container.x = totalWidth + interval
      car.container.y = gameStageDimention.height

      this.obstacleArray.push(car)
      this.container.addChild(car.container)

      totalWidth +=
        interval === 0
          ? car.container.width * 2
          : car.container.width + interval

      car.getObstacleTickerCallback(this.obstacleCallbackArray)
    }
  }

  _createMiaoli() {
    const SOLAR_BOARD_WIDTH = 50
    const SOLAR_BOARD_DISTANCE = 250
    const SOLAR_BOARD_UNIT = SOLAR_BOARD_DISTANCE + SOLAR_BOARD_WIDTH
    const SOLAR_BOARD_COUNT =
      Math.floor(this.obstacleWidth / SOLAR_BOARD_UNIT) + 1

    // const CHIMNEY_DISTANCE = gameStageDimention.width / 3
    let totalWidth = 0
    for (let i = 0; i < SOLAR_BOARD_COUNT; i++) {
      const solarBoard = new SolarBoard(i, this.collisionMonitor)

      const interval =
        i % 2 === 1 ? SOLAR_BOARD_DISTANCE + Math.random() * 50 : 0
      solarBoard.container.x = totalWidth + interval
      solarBoard.container.y = gameStageDimention.height

      this.obstacleArray.push(solarBoard)
      this.container.addChild(solarBoard.container)
      totalWidth +=
        interval === 0
          ? solarBoard.container.width * 2
          : solarBoard.container.width + interval

      solarBoard.getObstacleTickerCallback(this.obstacleCallbackArray)
    }
  }

  _createYunlin() {
    const WATER_WIDTH = 300
    const WATER_DISTANCE = 200
    const WATER_UNIT = WATER_DISTANCE + WATER_WIDTH
    const WATER_COUNT = Math.floor(this.obstacleWidth / WATER_UNIT)

    // const CHIMNEY_DISTANCE = gameStageDimention.width / 3

    let waterContainerWidth = 0
    for (let i = 1; i <= WATER_COUNT; i++) {
      const water = new Water(i + 200, this.collisionMonitor, this.player)
      water.container.y = gameStageDimention.height + water.container.height
      // solarBoard.container.y =
      //   gameStageDimention.height + solarBoard.container.height

      water.container.x =
        waterContainerWidth +
        water.container.width / 2 +
        (i === 1 ? 0 : WATER_DISTANCE)
      waterContainerWidth += water.container.width + WATER_DISTANCE

      this.obstacleArray.push(water)
      this.container.addChild(water.container)

      water.getObstacleTickerCallback(this.obstacleCallbackArray)

      // add obstacle floating on the water

      for (let j = 1; j <= water.waterWidthLevel; j++) {
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
          (water.container.width / (water.waterWidthLevel + 1)) * j +
          (Math.random() * 40 - 20)

        this.obstacleArray.push(floatingObstacle)
        this.container.addChild(floatingObstacle.container)

        floatingObstacle.getObstacleTickerCallback(this.obstacleCallbackArray)
      }

      this.container.setChildIndex(
        water.container,
        this.container.children.length - 1
      )
    }
  }

  _createKaohsiung() {}

  _createMountain() {
    const ROCK_COUNT = 6
    const ROCK_INTERVAL = Math.floor(this.obstacleWidth / ROCK_COUNT)

    for (let i = 0; i < ROCK_COUNT; i++) {
      const rock = new Rock(i, this.collisionMonitor, this.obstacleWidth)

      rock.container.x = ROCK_INTERVAL * i + Math.floor(Math.random() * 40 - 20)
      rock.container.y = Math.floor(Math.random() * gameStageDimention.height)

      this.obstacleArray.push(rock)

      this.container.addChild(rock.container)

      rock.getObstacleTickerCallback(this.obstacleCallbackArray)
    }
  }

  _createYilan() {
    const chimney = new Chimney(300)
    chimney.container.y = gameStageDimention.height
    chimney.container.width = this.obstacleWidth
    chimney.container.alpha = 0
    chimney.chimneySprite.pivot.x = 0

    this.obstacleArray.push(chimney)
    this.container.addChild(chimney.container)

    const finishLine = new FinishLine(1000, this.collisionMonitor)
    finishLine.container.alpha = 0

    finishLine.container.x = this.container.width + gameStageDimention.width / 4
    finishLine.container.y = gameStageDimention.height

    this.container.addChild(finishLine.container)
    this.obstacleArray.push(finishLine)

    finishLine.getObstacleTickerCallback(this.obstacleCallbackArray)
  }
}
