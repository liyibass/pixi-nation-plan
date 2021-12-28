import * as PIXI from 'pixi.js'
import { Candy } from '../components/Candy'
import { CandyHeader } from '../components/CandyHeader'

import { Globals } from '../script/Globals'
import { Scene } from './Scene'

const gameStageDimention = Globals.getCandyGameStageDimention()
// const CANDY_WIDTH = gameStageDimention

export class CandyScene extends Scene {
  constructor() {
    super()

    this.container.name = 'CandyScene'

    this.grid = []
    this.isSwaping = false
    this.isHandlingLine = false
    this.needToDeleteArray = []
    this.needToFallingQueue = []

    this.createScene()
    this.startGameFlow()
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0x6f90ba)
    this._createItems()
    this._createGameStage()
    this.createCandyHeader()
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
    this.candyBox = new PIXI.Graphics()
    const frameLineWeight = 1
    this.candyBox.lineStyle(frameLineWeight, 0xdddddd, 0)
    // this.candyBox.beginFill(0x00000)
    this.candyBox.beginFill(0x232c5b)

    /*
     * NOTE: We use this.candyBox(which is a Graphics) to bump up outer container
     * the drawing process down below MUST start at 0,0
     * (Graphics and drawRect is NOT in same level)
     */
    this.candyBox.drawRoundedRect(
      0,
      0,
      this.gameStageWidth,
      this.gameStageHeight,
      20
    )
    this.candyBox.endFill()

    // add to container
    this.gameStage.addChild(this.candyBox)
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

  createCandyHeader() {
    this.candyHeader = new CandyHeader(this.reCreateCandys.bind(this))
    this.container.addChild(this.candyHeader.container)
    console.log(this.candyHeader)

    this.candyHeader.container.x = gameStageDimention.x
    this.candyHeader.container.y = 16
  }

  async createCandys() {
    for (let j = this.rowCount - 1; j >= 0; j--) {
      const rowArray = []
      this.grid.unshift(rowArray)
      for (let i = 0; i < this.colCount; i++) {
        const typeIndex = generateTypeIndex.bind(this)(i, j, rowArray)

        const candy = this.createCandy(typeIndex, i, j)
        rowArray.push(candy)

        // start drop animation
        candy.startFallingCandy()
        await this._wait(20)
      }
    }

    for (let j = this.rowCount - 1; j >= 0; j--) {
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

    // generate typeIndex which different with near 2 candy's typeIndex
    function generateTypeIndex(i, j, rowArray) {
      const leftCandyTypeIndex =
        i - 2 >= 0 ? rowArray?.[i - 2]?.typeIndex : null
      const rightCandyTypeIndex =
        i + 2 <= this.colCount - 1 ? rowArray?.[i + 2]?.typeIndex : null
      const bottomCandyTypeIndex =
        j + 2 <= this.rowCount - 1 ? this.grid[j + 2]?.[i]?.typeIndex : null
      const topCandyTypeIndex =
        j - 2 >= 0 ? this.grid[j + 2]?.[i]?.typeIndex : null

      const excludeTypeIndex = [
        leftCandyTypeIndex,
        rightCandyTypeIndex,
        bottomCandyTypeIndex,
        topCandyTypeIndex,
      ]

      let genCount = 0
      while (excludeTypeIndex.length < 5) {
        const index = Math.floor(Math.random() * 4)

        if (excludeTypeIndex.indexOf(index) === -1 || genCount > 20) {
          excludeTypeIndex.push(index)
        } else {
          genCount++
        }
      }

      return excludeTypeIndex[excludeTypeIndex.length - 1]
    }
  }

  createCandy(typeIndex, i, j) {
    const candy = new Candy(typeIndex, i, j, this.swapHandler.bind(this))
    this.candyBox.addChild(candy.container)

    return candy
  }

  async reCreateCandys() {
    for (let j = this.rowCount - 1; j >= 0; j--) {
      for (let i = 0; i < this.colCount; i++) {
        const candy = this.grid[j][i]

        candy.container.destroy()
      }
    }
    this.candyBox.removeChildren()

    await this.createCandys()
  }

  async swapHandler(candy, direction) {
    if (this.isSwaping || this.isHandlingLine) return

    this.isSwaping = true

    // find opponent candy
    let opponentCandy = this._getOpponentCandy(candy, direction)
    if (!opponentCandy) return

    // swap candy's array location in grid
    switch (direction) {
      case 'right':
        this.grid[candy.j].splice(candy.i, 2, opponentCandy, candy)

        break

      case 'left':
        this.grid[candy.j].splice(candy.i - 1, 2, candy, opponentCandy)

        break

      case 'down':
        this.grid[candy.j].splice(candy.i, 1, opponentCandy)
        this.grid[candy.j + 1].splice(candy.i, 1, candy)

        break

      case 'up':
        this.grid[candy.j - 1].splice(candy.i, 1, candy)
        this.grid[candy.j].splice(candy.i, 1, opponentCandy)

        break
    }

    // swap candy's i and j
    const { i: opI, j: opJ } = opponentCandy
    opponentCandy.i = candy.i
    opponentCandy.j = candy.j
    candy.i = opI
    candy.j = opJ

    // trigger their swap animation
    switch (direction) {
      case 'right':
        await Promise.all([
          candy.moveRightTicker(),
          opponentCandy.moveLeftTicker(),
        ])
        break

      case 'left':
        await Promise.all([
          candy.moveLeftTicker(),
          opponentCandy.moveRightTicker(),
        ])
        break

      case 'down':
        await Promise.all([
          candy.moveDownTicker(),
          opponentCandy.moveUpTicker(),
        ])
        break

      case 'up':
        await Promise.all([
          candy.moveUpTicker(),
          opponentCandy.moveDownTicker(),
        ])
        break
    }
    console.log('swap')
    console.log('swap done :' + this.candyBox.children.length)
    this.isSwaping = false
    this.candyHeader.decreaseStepCount()

    // =====================CHECK LINE LOOP======================
    this.needToDeleteArray = this.examineIfHasLine()

    while (this.needToDeleteArray.length > 0) {
      this.isHandlingLine = true
      await this.lineHandler()
      await this.candyHeader.increaseScore(this.needToDeleteArray)

      // clear
      this.needToDeleteArray = []
      this.needToFallingQueue = []

      this.needToDeleteArray = this.examineIfHasLine()
      await this._wait(200)
      this.isHandlingLine = false
    }
    // this._logGrid()
  }

  async lineHandler() {
    console.log('lineHandler :' + this.candyBox.children.length)
    // console.log(this.needToDeleteArray)

    // =====================DELETE CANDY======================
    // remove candy from grid and candyBox
    this.needToFallingQueue = []
    const vanishPromise = []
    for (let k = 0; k < this.needToDeleteArray.length; k++) {
      const candy = this.needToDeleteArray[k]
      const { i, j } = candy
      this.grid[j][i] = null
      vanishPromise.push(candy.vanish(this.candyBox))

      // get all candies above candy, move them into queue
      const aboveArray = feedAboveCandyToFallingQueue.bind(this)(candy)
      this.needToFallingQueue = this.needToFallingQueue.concat(aboveArray)
    }

    await Promise.all(vanishPromise)
    console.log(
      `delete ${vanishPromise.length} candy, rest : ${this.candyBox.children.length}`
    )

    // =====================FALLING CANDY======================
    await this.fallingCandy(this.needToFallingQueue)
    console.log(
      `falling candy count : ${this.needToFallingQueue.length}, rest : ${this.candyBox.children.length}`
    )

    // =====================ADD CANDY======================
    const addedCandyCount = await this.addNewCandyIntoGrid()
    console.log(
      `add ${addedCandyCount} candy, total : ${this.candyBox.children.length}`
    )

    // =====================FIX ERROR======================
    if (this.candyBox.children.length !== this.rowCount * this.colCount) {
      await this.fixError()
    }

    // this._logGrid()

    function feedAboveCandyToFallingQueue(candy) {
      const aboveCandyArray = []

      const { i, j } = candy
      let J = j
      let topCandy = this.grid[J - 1]?.[i]

      while (J > 0) {
        if (topCandy && this.needToFallingQueue.indexOf(topCandy) === -1) {
          if (this.needToDeleteArray.indexOf(topCandy) !== -1) {
            console.log('======ERROR!!!!=======')
            console.log(topCandy)
            continue
          }
          aboveCandyArray.push(topCandy)
        }

        J--
        topCandy = this.grid[J - 1]?.[i]
      }
      return aboveCandyArray
    }
  }

  async fallingCandy(needToFallingQueue) {
    this.isFalling = true
    // falling all pending candy
    const fallingPromise = []
    // console.log(needToFallingQueue)
    for (let k = 0; k < needToFallingQueue.length; k++) {
      const candy = needToFallingQueue[k]
      // console.log(`${candy.j},${candy.i}`)

      let fallingDistance = getFallingDistance.bind(this)(candy)

      this.grid[candy.j + fallingDistance][candy.i] = candy
      this.grid[candy.j][candy.i] = null
      candy.j += fallingDistance

      fallingPromise.push(candy.startFallingCandy())
    }

    await Promise.all(fallingPromise)

    this.isFalling = false

    function getFallingDistance(candy) {
      const { i, j } = candy
      let fallingDistance = 0

      for (let J = j; J < this.colCount - 1; J++) {
        const bottomGrid = this.grid[J + 1][i]

        if (bottomGrid === null) {
          fallingDistance++
        }
      }

      return fallingDistance
    }
  }

  async addNewCandyIntoGrid() {
    let nullCount = 0
    for (let j = this.rowCount - 1; j >= 0; j--) {
      const rowArray = []
      for (let i = 0; i < this.colCount; i++) {
        if (this.grid[j][i] === null) {
          const typeIndex = Math.floor(Math.random() * 4)

          const candy = this.createCandy(typeIndex, i, j)
          this.candyBox.addChild(candy.container)
          this.grid[j][i] = candy
          rowArray.push(candy)
          nullCount++
          candy.startFallingCandy()
          candy.startDragMonitor()
        }
      }

      // await this._wait(20 * j)

      // for (let k = 0; k < addedCandyArray.length; k++) {
      //   const candy = addedCandyArray[k]
      //   candy.startFallingCandy()
      //   candy.startDragMonitor()
      // }
    }
    return nullCount
  }

  examineIfHasLine() {
    const needToDelete = []

    for (let j = 0; j < this.colCount; j++) {
      // for (let j = 0; j < 3; j++) {
      for (let i = 0; i < this.rowCount; i++) {
        if (i >= this.colCount - 2) continue

        const candy = this.grid[j][i]
        if (candy === null) continue
        // if (candy.isDelete) continue

        // check right
        const rightLineLength = rightLineCheck.bind(this)(candy)
        // console.log(rightLineLength)

        if (rightLineLength >= 3) {
          // console.log(candy)
          for (let k = 0; k < rightLineLength; k++) {
            this.grid[j][i + k].isDelete = true
            if (needToDelete.indexOf(this.grid[j][i + k]) === -1) {
              needToDelete.push(this.grid[j][i + k])
            }
          }

          const lineEndTop = this.grid[j + 1]?.[i + rightLineLength]
          const lineEndBottom = this.grid[j - 1]?.[i + rightLineLength]
          if (
            lineEndTop &&
            lineEndTop.typeIndex === this.grid[j]?.[i]?.typeIndex
          ) {
            console.log('has more candy need for deleting(top)')
          }

          if (
            lineEndBottom &&
            lineEndBottom.typeIndex === this.grid[j]?.[i]?.typeIndex
          ) {
            console.log('has more candy need for deleting(bottom)')
          }

          // skip examining lined candy
          i += rightLineLength - 1
        }
      }
    }

    function rightLineCheck(candy) {
      const { i, j } = candy
      let rightLineLength = 1
      let rightIndexOffset = 1

      while (
        typeof candy?.typeIndex === 'number' &&
        this.grid[j]?.[i + rightIndexOffset]?.typeIndex === candy.typeIndex
      ) {
        rightLineLength++
        rightIndexOffset++
      }

      return rightLineLength
    }

    // function bottomLineCheck(candy) {
    //   const { i, j } = candy
    //   if (j >= this.rowCount - 2) return lineCandyCount

    //   const bottomCandy = this.grid[j + 1][i]

    //   if (candy.typeIndex === bottomCandy?.typeIndex) {
    //     lineCandyCount++
    //     return bottomLineCheck.bind(this)(bottomCandy)
    //   } else {
    //     return lineCandyCount
    //   }
    // }

    return needToDelete
  }

  _getOpponentCandy(candy, direction) {
    let opponentCandy

    switch (direction) {
      case 'right':
        if (
          candy.i === this.colCount - 1 ||
          !this.grid[candy.j]?.[candy.i + 1]
        ) {
          this.isSwaping = false
          return null
        }

        opponentCandy = this.grid[candy.j][candy.i + 1]
        break

      case 'left':
        if (candy.i === 0 || !this.grid[candy.j]?.[candy.i - 1]) {
          this.isSwaping = false
          return null
        }
        opponentCandy = this.grid[candy.j][candy.i - 1]
        break

      case 'down':
        if (
          candy.j === this.rowCount - 1 ||
          !this.grid[candy.j + 1]?.[candy.i]
        ) {
          this.isSwaping = false
          return null
        }
        opponentCandy = this.grid[candy.j + 1][candy.i]
        break

      case 'up':
        if (candy.j === 0 || !this.grid[candy.j - 1]?.[candy.i]) {
          this.isSwaping = false
          return null
        }
        opponentCandy = this.grid[candy.j - 1][candy.i]
        break
    }

    return opponentCandy
  }

  fixError() {
    console.error('fixError')
    this.candyBox.removeChildren()
    for (let j = this.rowCount - 1; j >= 0; j--) {
      for (let i = 0; i < this.colCount; i++) {
        const candy = this.grid[j][i]
        this.candyBox.addChild(candy)
      }
    }
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

  _logGrid() {
    console.log('==========================')
    for (let j = 0; j < this.rowCount; j++) {
      console.log(this.grid[j])
      //  for (let i = 0; i < this.colCount; i++) {

      //  }
    }
    console.log('==========================')
  }
}
