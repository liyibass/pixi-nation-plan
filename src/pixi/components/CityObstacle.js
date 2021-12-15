import * as PIXI from 'pixi.js'
import { Chimney } from './Chimney'
import { Globals } from '../script/Globals'
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

      // case 'Hsinchu':
      //   this._createHsinchu()
      //   break

      // case 'Miaoli':
      //   this._createMiaoli()
      //   break

      // case 'Yunlin':
      //   this._createYunlin()
      //   break

      // case 'Kaohsiung':
      //   this._createKaohsiung()
      //   break

      // case 'Mountain':
      //   this._createMountain()
      //   break

      // case 'Yilan':
      //   this._createYilan()
      //   break

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

  _createHsinchu() {}

  _createMiaoli() {}

  _createYunlin() {}

  _createKaohsiung() {}

  _createMountain() {}

  _createYilan() {}
}
