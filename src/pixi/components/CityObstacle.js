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

  obstacleMonitor() {
    // this.obstacleMonitorTicker = new PIXI.Ticker()
    // this.obstacleMonitorTicker.add(() => {
    //   console.log(this.obstacleArray)
    //   if (!this.obstacleArray?.length) {
    //     this.obstacleMonitorTicker.stop()
    //     return
    //   }
    //   this.obstacleArray.forEach((obstacle) => {
    //     const { x } = this.container.toGlobal(obstacle.container.position)
    //     if (x >= 0 || x <= gameStageDimention.width) {
    //       this.obstacleHandler(obstacle)
    //     }
    //   })
    // })
    // this.obstacleMonitorTicker.start()
  }

  obstacleHandler() {}

  _createTaoyuan() {
    const CHIMNEY_COUNT = 6
    const CHIMNEY_DISTANCE = gameStageDimention.width
    // const CHIMNEY_DISTANCE = (gameStageDimention.width * 2) / 3
    for (let i = 0; i < CHIMNEY_COUNT; i++) {
      const chimney = new Chimney(i, this.collisionMonitor)
      chimney.container.y = gameStageDimention.height
      chimney.container.x =
        CHIMNEY_DISTANCE * i + Math.floor(Math.random() * 140 - 100)
      this.container.addChild(chimney.container)

      this.obstacleArray.push(chimney)

      chimney.startChimneyTicker()
    }
  }

  _createHsinchu() {}

  _createMiaoli() {}

  _createYunlin() {}

  _createKaohsiung() {}

  _createMountain() {}

  _createYilan() {}
}
