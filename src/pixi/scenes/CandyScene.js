import * as PIXI from 'pixi.js'
import { Candy } from '../components/Candy'

import { Globals } from '../script/Globals'
import { Scene } from './Scene'

// const gameStageDimention = Globals.getCandyGameStageDimention()
// const CANDY_WIDTH = gameStageDimention

export class CandyScene extends Scene {
  constructor() {
    super()

    this.container.name = 'CandyScene'

    this.grid = []
    this.isSwaping = false

    this.createScene()
    this.startGameFlow()
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0x6f90ba)
    this._createItems()
    this._createGameStage()
    this._createDoctorSay()
  }

  _createGameStage() {
    // get gameStage dimention
    const gameStageDimention = Globals.getCandyGameStageDimention()

    this.gameStageX = gameStageDimention.x
    this.gameStageY = gameStageDimention.y
    this.gameStageWidth = gameStageDimention.width
    this.gameStageHeight = gameStageDimention.height
    this.colCount = gameStageDimention.colCount
    this.rowCount = gameStageDimention.rowCount

    this.gameStage = new PIXI.Container()
    this.gameStage.name = 'gameStage'

    // create a color region
    const gameStageFrame = new PIXI.Graphics()
    const frameLineWeight = 1
    gameStageFrame.lineStyle(frameLineWeight, 0xdddddd, 0)
    // gameStageFrame.beginFill(0x00000)
    gameStageFrame.beginFill(0x232c5b)

    /*
     * NOTE: We use gameStageFrame(which is a Graphics) to bump up outer container
     * the drawing process down below MUST start at 0,0
     * (Graphics and drawRect is NOT in same level)
     */
    gameStageFrame.drawRoundedRect(
      0,
      0,
      this.gameStageWidth,
      this.gameStageHeight,
      20
    )
    gameStageFrame.endFill()

    // add to container
    this.gameStage.addChild(gameStageFrame)
    this.container.addChild(this.gameStage)

    // set up gameStage's position
    this.gameStage.x = this.gameStageX
    this.gameStage.y = this.gameStageY
  }

  // ===== init game =====
  async initGame() {
    console.log('initGame')
    await this.createCandys()
  }

  async createCandys() {
    for (let j = this.colCount - 1; j >= 0; j--) {
      const rowArray = []
      this.grid.unshift(rowArray)
      for (let i = 0; i < this.colCount; i++) {
        const candy = this.createCandy(i, j)
        rowArray.push(candy)

        // start drop animation
        candy.dropCandyTicker()
        await this._wait(20)
      }
    }

    for (let j = this.colCount - 1; j >= 0; j--) {
      for (let i = 0; i < this.colCount; i++) {
        const candy = this.grid[j][i]
        candy.startDragMonitor()

        // // setup linkList
        // const leftCandy = i === 0 ? null : this.grid[j][i - 1]
        // const rightCandy = i === this.colCount - 1 ? null : this.grid[j][i + 1]
        // const topCandy = j === 0 ? null : this.grid[j - 1][i]
        // const bottomCandy = j === this.rowCount - 1 ? null : this.grid[j + 1][i]

        // candy.leftCandy = leftCandy
        // candy.rightCandy = rightCandy
        // candy.topCandy = topCandy
        // candy.bottomCandy = bottomCandy
      }
    }
  }

  createCandy(i, j) {
    const typeIndex = Math.floor(Math.random() * 4)
    const candy = new Candy(typeIndex, i, j, this.swapHandler.bind(this))
    this.gameStage.addChild(candy.container)

    return candy
  }

  async swapHandler(candy, direction) {
    if (this.isSwaping) return

    this.isSwaping = true

    // find opponent candy
    let opponentCandy = this._getOpponentCandy(candy, direction)
    if (!opponentCandy) return

    // swap candy's array location in grid, also trigger their swap animation
    switch (direction) {
      case 'right':
        this.grid[candy.j].splice(candy.i, 2, opponentCandy, candy)
        candy.moveRightTicker()
        opponentCandy.moveLeftTicker()
        break

      case 'left':
        this.grid[candy.j].splice(candy.i - 1, 2, candy, opponentCandy)
        candy.moveLeftTicker()
        opponentCandy.moveRightTicker()
        break

      case 'down':
        this.grid[candy.j].splice(candy.i, 1, opponentCandy)
        this.grid[candy.j + 1].splice(candy.i, 1, candy)
        candy.moveDownTicker()
        opponentCandy.moveUpTicker()
        break

      case 'up':
        this.grid[candy.j - 1].splice(candy.i, 1, candy)
        this.grid[candy.j].splice(candy.i, 1, opponentCandy)
        candy.moveUpTicker()
        opponentCandy.moveDownTicker()
        break
    }

    // swap candy's i and j
    const { i: opI, j: opJ } = opponentCandy
    opponentCandy.i = candy.i
    opponentCandy.j = candy.j
    candy.i = opI
    candy.j = opJ

    // execute swap animation
    console.log('swap')
    this.isSwaping = false

    // get lined candy
    let needToDeleteArray = this.examineIfHasLine()
    // let needToFallingHeap = []
    console.log(needToDeleteArray)

    // for (let k = 0; k < needToDeleteArray.length; k++) {
    //   // remove candy from grid
    //   const candy = needToDeleteArray[k]
    //   const { i, j } = candy
    //   this.grid[i][j].isDelete = true

    //   candy.container.alpha = 0.2

    //   // get all candies above candy
    //   feedAboveCandyToFallingHeap.bind(this)(candy)
    //   // console.log(needToFallingHeap)
    // }
    // console.log(needToFallingHeap)

    // // falling all pending candy
    //   for (let k = needToFallingHeap.length - 1; k >= 0; k--) {
    //     const candy = needToFallingHeap.pop()

    //     let fallingDistance = 0
    //     getFallingDistance.bind(this)(candy, fallingDistance)

    //     this.grid[candy.j + fallingDistance][candy.i] = candy
    //     this.grid[candy.j][candy.i].isDelete = true
    //     // console.log(this.grid[candy.j + 1][candy.i])
    //     candy.j++
    //     candy.dropCandyTicker()
    //   }

    //   needToDeleteArray = []
    //   needToFallingHeap = []

    //   function feedAboveCandyToFallingHeap(candy) {
    //     console.log(needToFallingHeap)
    //     const { i, j } = candy

    //     if (j > 0) {
    //       const topCandy = this.grid[j - 1][i]
    //       if (needToFallingHeap.indexOf(topCandy) === -1) {
    //         needToFallingHeap.push(topCandy)
    //       }

    //       feedAboveCandyToFallingHeap.bind(this)(topCandy)
    //     }
    //   }

    //   function getFallingDistance(candy, fallingDistance) {
    //     const { i, j } = candy
    //     const bottomCandy = this.grid[j + 1][i]

    //     if (bottomCandy.isDelete) {
    //       fallingDistance++
    //       getFallingDistance.bind(this)(bottomCandy, fallingDistance)
    //     }
    //   }
    // }
  }

  examineIfHasLine() {
    let lineCount = 1
    const needToDelete = []

    // for (let j = 0; j < this.colCount; j++) {
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < this.rowCount; i++) {
        if (i >= this.colCount - 2) continue

        const candy = this.grid[j][i]
        if (candy.isDelete) continue

        // check right
        const hasRightLine = rightLineCheck.bind(this)(candy)

        if (hasRightLine >= 3) {
          for (let k = 0; k < hasRightLine; k++) {
            needToDelete.push(this.grid[j][i + k])
          }

          // skip examining lined candy
          i += hasRightLine - 1
        }
        lineCount = 1
      }
    }

    function rightLineCheck(candy) {
      const { i, j } = candy

      const rightCandy = this.grid[j][i + 1]

      if (candy.typeIndex === rightCandy?.typeIndex) {
        lineCount++
        return rightLineCheck.bind(this)(rightCandy)
      } else {
        return lineCount
      }
    }

    // function bottomLineCheck(candy) {
    //   const { i, j } = candy
    //   if (j >= this.rowCount - 2) return lineCount

    //   const bottomCandy = this.grid[j + 1][i]

    //   if (candy.typeIndex === bottomCandy?.typeIndex) {
    //     lineCount++
    //     return bottomLineCheck.bind(this)(bottomCandy)
    //   } else {
    //     return lineCount
    //   }
    // }

    return needToDelete
  }

  _getOpponentCandy(candy, direction) {
    let opponentCandy

    switch (direction) {
      case 'right':
        if (candy.i === this.colCount - 1) {
          this.isSwaping = false
          return null
        }

        opponentCandy = this.grid[candy.j][candy.i + 1]
        break

      case 'left':
        if (candy.i === 0) {
          this.isSwaping = false
          return null
        }
        opponentCandy = this.grid[candy.j][candy.i - 1]
        break

      case 'down':
        if (candy.j === this.rowCount - 1) {
          this.isSwaping = false
          return null
        }
        opponentCandy = this.grid[candy.j + 1][candy.i]
        break

      case 'up':
        if (candy.j === 0) {
          this.isSwaping = false
          return null
        }
        opponentCandy = this.grid[candy.j - 1][candy.i]
        break
    }

    return opponentCandy
  }

  // ===== game flow =====
  async startGameFlow() {
    console.log('startGameFlow')

    await this._wait(500)

    switch (this.gameLevel) {
      case 0:
        this.gameLevel0()
        break

      case 1:
        this.gameLevel1()
        break

      case 2:
        this.gameLevel2()
        break

      default:
        break
    }
  }

  async gameLevel0() {
    this.initGame()

    this.startGame()
  }

  async gameLevel1() {
    this.initGame()
    await this.doctorSay.newSay('level 2!')
    this.startGame()
  }

  async gameLevel2() {
    this.initGame()

    await this.doctorSay.newSay('final level!')
    this.startGame()
  }

  // ===== start game =====
  async startGame() {
    await super.startGame()

    this._startSceneTicker()
  }

  _startSceneTicker() {
    this.sceneTicker = new PIXI.Ticker()

    this.sceneTicker.add(async () => {})

    this.sceneTicker.start()
  }

  // ===== game pause =====
  _pauseAllGameActivity() {}

  _resumeAllGameActivity() {}

  // ===== game over =====

  async failGameHint() {
    super.failGameHint()

    switch (this.gameLevel) {
      case 1:
        await this.doctorSay.newSay(
          '雖然缺水的問題處理得不順利，但整體表現還算不錯！'
        )
        await this.doctorSay.newSay(
          '恭喜你獲得臺東縣的限定卡，可以看到這裡的垃圾問題多麽嚴重，以及縣政府打算如何處理。'
        )
        await this.doctorSay.newSay(
          '你同時也解開了其他擁有垃圾問題的縣市，可以點選有此困擾的縣市，看各地政府如何因應。'
        )
        break
    }
  }

  // ===== game pass =====

  async successGameHint() {
    super.successGameHint()

    if (this.gameLevel === 1) {
      await this.doctorSay.newSay('沒想到你這麼優秀，我真是找對人了！')
      await this.doctorSay.newSay(
        '先恭喜你獲得臺東縣的限定卡，可以看到這裡的垃圾問題多麽嚴重，以及縣政府打算怎麼處理。'
      )

      await this.doctorSay.newSay(
        '你同時也解開了其他擁有垃圾問題的縣市，可以點選有此困擾的縣市，看各地政府如何因應。'
      )
      await this.doctorSay.newSay(
        '因為你也順利解決了缺水的問題，可以點選有此困擾的縣市，看各地政府如何因應。'
      )
    }
  }

  resetGameSetting() {
    console.log('resetGameSetting')
    // super.removeKeyboardListener()
    super.resetGameSetting()
  }
}
