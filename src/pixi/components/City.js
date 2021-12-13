import { CityBackground } from './CityBackground'
import { CityBoard } from './CityBoard'
import { Globals } from '../script/Globals'
const gameStageDimention = Globals.getSeesawGameStageDimention()

export class City {
  constructor(currentCityIndex = 0) {
    this.cityName = this._getCityName(currentCityIndex)

    this.cityBackground = this.createCityBackground()
    this.cityBoard = this.createBoard()
  }

  createBoard() {
    const board = new CityBoard(this.cityName)

    board.container.x = 0 + board.container.width / 2
    board.container.y = gameStageDimention.height

    if (this.cityName === 'Mountain') {
      board.container.alpha = 0
    }

    return board
  }

  createCityBackground() {
    const background = new CityBackground(this.cityName)

    return background
  }

  _getCityName(currentCityIndex) {
    switch (currentCityIndex) {
      case 0:
        return 'Taoyuan'
      case 1:
        return 'Hsinchu'
      case 2:
        return 'Miaoli'
      case 3:
        return 'Yunlin'
      case 4:
        return 'Kaohsiung'
      case 5:
        return 'Mountain'
      case 6:
        return 'Yilan'
    }
  }
}
