import * as PIXI from 'pixi.js'
import { Candy } from '../components/Candy'
import { CandyHeader } from '../components/CandyHeader'

import { Globals } from '../script/Globals'
import { Status } from '../script/Status'
import { unlockCandy } from '../script/Utils'
import { Scene } from './Scene'
import { sound } from '@pixi/sound'

const gameStageDimention = Globals.getCandyGameStageDimention()
// const CANDY_WIDTH = gameStageDimention
const MAX_TYPE_COUNT = 4
const MAX_INVALID_FACTORY_COUNT = 2
const INVALID_FACTORY_CANDY_INDEX = 4
const DEAD_CANDY_INDEX = 5

export class CandyScene extends Scene {
  constructor(...args) {
    super(...args)
    this.gameLevel = Status.candy.gameLevel

    this.container.name = 'CandyScene'
    this.initMusic()

    this.invalidFactoryCount = 0

    this.grid = []

    // unlockCandy()
    this.pointArray = [
      { typeIndex: 0, count: 0, point: 100 },
      { typeIndex: 1, count: 0, point: 75 },
      { typeIndex: 2, count: 0, point: 50 },
      { typeIndex: 3, count: 0, point: 200 },
      { typeIndex: INVALID_FACTORY_CANDY_INDEX, count: 0, point: 200 },
    ]

    this.pointArrayRecord = Status?.candy?.pointArray?.length
      ? Status.candy.pointArray
      : [
          { typeIndex: 0, count: 0, point: 100 },
          { typeIndex: 1, count: 0, point: 75 },
          { typeIndex: 2, count: 0, point: 50 },
          { typeIndex: 3, count: 0, point: 200 },
          { typeIndex: INVALID_FACTORY_CANDY_INDEX, count: 0, point: 200 },
        ]

    this.isSwaping = false
    this.isHandlingLine = false
    this.isVanishing = false
    this.isFalling = false
    this.needToDeleteArray = []
    this.needToFallingQueue = []
    this.isGameStop = false

    this.createScene()
    this.startGameFlow()
  }

  initMusic() {
    sound.add('candy', Globals.resources['music_candy'])
  }

  playMusic() {
    sound.play('candy', {
      loop: true,
    })
  }

  stopMusic() {
    sound.stop('candy')
  }
  // ===== init system =====
  createScene() {
    this._createBackground(0x6f90ba)
    this._createItems()
    this._createGameStage()
    this.createCandyHeader()
    this._createDoctorSay()
    this._createHeader()
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
    await this.checkLineLoop()
  }

  createCandyHeader() {
    this.candyHeader = new CandyHeader(
      this.reCreateCandys.bind(this),
      this.gameOver.bind(this),
      this.gamePassed.bind(this),
      this.gameLevel,
      this.pointArray,
      this.pointArrayRecord
    )
    this.container.addChild(this.candyHeader.container)

    this.candyHeader.container.x = gameStageDimention.x
    this.candyHeader.container.y = Globals.gameStagePadding
  }

  async createCandys() {
    this.isFalling = true
    this.grid = [[], [], [], [], [], [], [], []]
    const fallingCandysPromise = []

    const { randomNumber1, randomNumber2 } = generateTwoRandomNumber(
      this.rowCount
    )
    const { randomNumber1: randomNumber3, randomNumber2: randomNumber4 } =
      generateTwoRandomNumber(this.rowCount)

    for (let j = this.rowCount - 1; j >= 0; j--) {
      const rowArray = []
      // this.grid.unshift(rowArray)
      this.grid[j] = rowArray

      for (let i = 0; i < this.colCount; i++) {
        let typeIndex
        if (
          this.gameLevel === 2 &&
          ((i === randomNumber1 && j === randomNumber2) ||
            (i === randomNumber3 && j === randomNumber4))
        ) {
          typeIndex = INVALID_FACTORY_CANDY_INDEX
          this.invalidFactoryCount++
        } else {
          typeIndex = generateTypeIndex.bind(this)(i, j, rowArray)
        }

        const candy = this.createCandy(typeIndex, i, j)
        rowArray.push(candy)

        // start drop animation
        fallingCandysPromise.push(candy.startFallingCandy())
        await this._wait(20)
      }
    }

    await Promise.all(fallingCandysPromise)
    this.isFalling = false

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

      // this._logGrid()
      const excludeTypeIndex = [
        leftCandyTypeIndex,
        rightCandyTypeIndex,
        bottomCandyTypeIndex,
        topCandyTypeIndex,
      ]

      let genCount = 0
      while (excludeTypeIndex.length < 10) {
        const index = Math.floor(Math.random() * MAX_TYPE_COUNT)

        if (excludeTypeIndex.indexOf(index) === -1 || genCount > 20) {
          excludeTypeIndex.push(index)
          break
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
    if (
      this.isFalling ||
      this.isSwaping ||
      this.isHandlingLine ||
      this.isVanishing
    )
      return

    this.removeAllCandys()
    await this.createCandys()
    await this.checkLineLoop()
  }

  removeAllCandys() {
    for (let j = 0; j < this.rowCount; j++) {
      for (let i = 0; i < this.colCount; i++) {
        const candy = this.grid?.[j]?.[i]

        candy?.container?.destroy()
      }
    }
    this.candyBox.removeChildren()
    this.grid = []
  }

  async swapHandler(candy, direction) {
    if (this.isSwaping || this.isHandlingLine || this.isGameStop) return

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

    // check if this swap move has line
    // if so, complete swaping
    // if not, then redo swaping

    const { needToDelete, needToTurnVanish } = this.examineIfHasLine()
    this.needToDeleteArray = needToDelete
    this.needToTurnVanish = needToTurnVanish

    const interactiveWithDeadCandy =
      candy.typeIndex === DEAD_CANDY_INDEX ||
      opponentCandy.typeIndex === DEAD_CANDY_INDEX

    if (
      !interactiveWithDeadCandy &&
      (this.needToDeleteArray.length || this.needToTurnVanish.length)
    ) {
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
      // console.log('swap')
      // console.log('swap done :' + this.candyBox.children.length)

      this.candyHeader.decreaseStepCount()

      await this.checkLineLoop()
    } else {
      console.log('CANT SWAP')
      // redo swap candy's array location in grid
      switch (direction) {
        case 'right':
          this.grid[candy.j].splice(opponentCandy.i, 2, candy, opponentCandy)

          break

        case 'left':
          this.grid[candy.j].splice(
            opponentCandy.i - 1,
            2,
            opponentCandy,
            candy
          )

          break

        case 'down':
          this.grid[opponentCandy.j].splice(opponentCandy.i, 1, candy)
          this.grid[opponentCandy.j + 1].splice(
            opponentCandy.i,
            1,
            opponentCandy
          )

          break

        case 'up':
          this.grid[opponentCandy.j - 1].splice(
            opponentCandy.i,
            1,
            opponentCandy
          )
          this.grid[opponentCandy.j].splice(opponentCandy.i, 1, candy)

          break
      }

      // redo swap candy's i and j
      const { i: opI, j: opJ } = opponentCandy
      opponentCandy.i = candy.i
      opponentCandy.j = candy.j
      candy.i = opI
      candy.j = opJ

      // trigger their fail swap animation
      switch (direction) {
        case 'right':
          await Promise.all([
            candy.moveRightFailTicker(),
            // opponentCandy.moveLeftFailTicker(),
          ])
          break

        case 'left':
          await Promise.all([
            candy.moveLeftFailTicker(),
            // opponentCandy.moveRightFailTicker(),
          ])
          break

        case 'down':
          await Promise.all([
            candy.moveDownFailTicker(),
            // opponentCandy.moveUpFailTicker(),
          ])
          break

        case 'up':
          await Promise.all([
            candy.moveUpFailTicker(),
            // opponentCandy.moveDownFailTicker(),
          ])
          break
      }
    }

    this.isSwaping = false
  }

  // ================checkLineLoop===================

  async checkLineLoop() {
    if (this.isGameStop) return
    // =====================CHECK LINE LOOP======================

    const { needToDelete, needToTurnVanish } = this.examineIfHasLine()
    this.needToDeleteArray = needToDelete
    this.needToTurnVanish = needToTurnVanish

    this.vanishHandler()

    let isFirstTimeLineCheck = true
    while (
      this.needToDeleteArray.length > 0 ||
      this.needToTurnVanish.length > 0
    ) {
      if (this.isGameStop) return

      this.isHandlingLine = true
      await this.lineHandler()

      const scoredCandys = this.needToDeleteArray.concat(this.needToTurnVanish)

      await this.candyHeader.increaseScore(scoredCandys, isFirstTimeLineCheck)

      if (isFirstTimeLineCheck) {
        // this is for point counting
        isFirstTimeLineCheck = false
      }

      // clear
      this.needToDeleteArray = []
      this.needToTurnVanish = []
      this.needToFallingQueue = []

      const { needToDelete, needToTurnVanish } = this.examineIfHasLine()
      this.needToDeleteArray = needToDelete
      this.needToTurnVanish = needToTurnVanish
      // await this._wait(1000)
      this.isHandlingLine = false
    }
  }

  async lineHandler() {
    // =====================DELETE CANDY======================
    // console.log(this.needToDeleteArray)

    this.needToFallingQueue = []

    // start candy's vanish animation
    const vanishPromise = []
    for (let k = 0; k < this.needToDeleteArray.length; k++) {
      const candy = this.needToDeleteArray[k]
      vanishPromise.push(candy.vanish())
    }
    await Promise.all(vanishPromise)

    // remove candy from grid and candyBox
    for (let k = 0; k < this.needToDeleteArray.length; k++) {
      const candy = this.needToDeleteArray[k]
      const { i, j } = candy

      this.candyBox.removeChild(candy.container)

      this.grid[j][i] = null

      // get all candies above candy, move them into queue
      const aboveArray = feedAboveCandyToFallingQueue.bind(this)(candy)
      this.needToFallingQueue = this.needToFallingQueue.concat(aboveArray)
    }
    this.needToFallingQueue.sort((a, b) => {
      return b.j - a.j
    })

    // await this._wait(100)
    // =====================FALLING CANDY======================
    await this.fallingCandy(this.needToFallingQueue)

    // =====================ADD CANDY======================
    await this.addNewCandyIntoGrid()

    // =====================FIX ERROR======================
    if (this.candyBox.children.length !== this.rowCount * this.colCount) {
      this._logGrid()
      await this.fixError()
    }

    function feedAboveCandyToFallingQueue(candy) {
      const aboveCandyArray = []

      const { i, j } = candy
      let J = j - 1
      let topCandy

      while (J >= 0) {
        topCandy = this.grid[J]?.[i]

        if (
          topCandy !== null &&
          this.needToFallingQueue.indexOf(topCandy) === -1
        ) {
          aboveCandyArray.push(topCandy)
        }

        J--
      }
      return aboveCandyArray
    }
  }

  async vanishHandler() {
    console.log(this.needToTurnVanish)
    for (let index = 0; index < this.needToTurnVanish.length; index++) {
      const candy = this.needToTurnVanish[index]
      candy.typeIndex = DEAD_CANDY_INDEX
      candy.dead()
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
    // await this._wait(100)

    this.isFalling = false

    function getFallingDistance(candy) {
      const { i, j } = candy
      let fallingDistance = 0

      for (let J = j; J < this.colCount; J++) {
        const bottomGrid = this.grid[J + 1]?.[i]

        if (bottomGrid === null) {
          fallingDistance++
        }
      }

      return fallingDistance
    }
  }

  async addNewCandyIntoGrid() {
    let nullCount = 0
    const addCandyPromise = []

    const addedCandyArray = []

    // const { randomNumber1, randomNumber2 } = generateTwoRandomNumber()

    for (let i = 0; i < this.colCount; i++) {
      for (let j = this.rowCount - 1; j >= 0; j--) {
        const element = this.grid[j][i]
        if (element !== null) continue

        const { randomNumber1, randomNumber2 } = generateTwoRandomNumber(
          this.rowCount
        )
        let typeIndex
        if (
          this.gameLevel === 2 &&
          this.invalidFactoryCount < MAX_INVALID_FACTORY_COUNT &&
          i === randomNumber1 &&
          j === randomNumber2
        ) {
          typeIndex = INVALID_FACTORY_CANDY_INDEX
        } else {
          typeIndex = Math.floor(Math.random() * MAX_TYPE_COUNT)
        }

        const candy = this.createCandy(typeIndex, i, j)

        this.candyBox.addChild(candy.container)
        this.grid[j][i] = candy
        addedCandyArray.push(candy)
        addCandyPromise.push(candy.startFallingCandy())
      }
    }

    await Promise.all(addCandyPromise)

    // this._logGrid()

    addedCandyArray.forEach((candy) => {
      candy.startDragMonitor()
    })

    return nullCount
  }

  examineIfHasLine2() {
    const needToDelete = []
    const needToTurnVanish = []
    // this._logGrid()

    for (let j = 0; j < this.rowCount; j++) {
      // for (let j = 0; j < 3; j++) {
      for (let i = 0; i < this.colCount; i++) {
        const candy = this.grid[j][i]
        if (candy === null) continue
        if (candy.typeIndex === DEAD_CANDY_INDEX) continue

        // check right
        const { rightLineLength, hasInvalidFactoryX } =
          rightLineCheck.bind(this)(candy)
        const { bottomLineLength, hasInvalidFactoryY } =
          bottomLineCheck.bind(this)(candy)

        if (rightLineLength >= 3) {
          // console.log(candy)
          for (let k = 0; k < rightLineLength; k++) {
            if (hasInvalidFactoryX || hasInvalidFactoryY) {
              if (needToTurnVanish.indexOf(this.grid[j][i + k]) === -1) {
                needToTurnVanish.push(this.grid[j][i + k])
              }
            } else {
              if (needToDelete.indexOf(this.grid[j][i + k]) === -1) {
                needToDelete.push(this.grid[j][i + k])
              }
            }
          }
        }
        if (bottomLineLength >= 3) {
          for (let k = 0; k < bottomLineLength; k++) {
            if (hasInvalidFactoryX || hasInvalidFactoryY) {
              if (needToTurnVanish.indexOf(this.grid[j + k][i]) === -1) {
                needToTurnVanish.push(this.grid[j + k][i])
              }
            } else {
              if (needToDelete.indexOf(this.grid[j + k][i]) === -1) {
                needToDelete.push(this.grid[j + k][i])
              }
            }
          }
        }
      }
    }

    return { needToDelete, needToTurnVanish }

    function rightLineCheck(candy) {
      if (!candy || typeof candy?.typeIndex !== 'number') return 1
      if (candy.i > this.colCount - 2) return 1

      const { i, j } = candy
      let rightLineLength = 1
      let rightIndexOffset = 1
      let loopCount = 0
      let hasInvalidFactory = false
      const lineArray = []

      // let currentTypeIndex = candy.typeIndex
      let isWhileLoopOn = true

      while (isWhileLoopOn) {
        const rightCandy = this.grid[j]?.[i + rightIndexOffset]
        if (!rightCandy) break

        // (O) O
        if (candy.typeIndex === rightCandy?.typeIndex) {
          checkedAndContinuefindNext()
        } else if (rightCandy?.typeIndex === INVALID_FACTORY_CANDY_INDEX) {
          // (O) F
          // (O) O F
          checkedAndContinuefindNext()
        } else if (candy.typeIndex === INVALID_FACTORY_CANDY_INDEX) {
          // (F) O
          // (F) O O
          const thirdCandy = this.grid[j]?.[i + rightIndexOffset + 1]
          if (thirdCandy && thirdCandy?.typeIndex === rightCandy?.typeIndex) {
            checkedAndContinuefindNext()
          } else {
            isWhileLoopOn = false
          }
        } else {
          isWhileLoopOn = false
        }

        if (loopCount > 10) {
          console.log('infinite loop happended')
          break
        }
      }
      function checkedAndContinuefindNext() {
        rightLineLength++
        rightIndexOffset++
        loopCount++
        lineArray.push(candy)
      }

      // while (
      //   candy.typeIndex === this.grid[j]?.[i + rightIndexOffset]?.typeIndex
      // ) {
      //   rightLineLength++
      //   rightIndexOffset++
      //   loopCount++
      //   lineArray.push(candy)

      //   if (loopCount > 10) {
      //     console.log('infinite loop happended')
      //     break
      //   }
      // }

      console.log(lineArray)

      return { rightLineLength, hasInvalidFactoryX: hasInvalidFactory }
    }

    function bottomLineCheck(candy) {
      if (!candy || typeof candy?.typeIndex !== 'number') return 1
      const { i, j } = candy

      let bottomLineLength = 1
      let bottomIndexOffset = 1
      let loopCount = 0
      let hasInvalidFactory = false
      const lineArray = []

      while (
        candy.typeIndex === this.grid[j + bottomIndexOffset]?.[i]?.typeIndex
      ) {
        bottomLineLength++
        bottomIndexOffset++

        loopCount++
        lineArray.push(candy)

        if (loopCount > 10) {
          console.log('infinite loop happended')
          break
        }
      }
      // console.log(lineArray)

      lineArray.forEach((candy) => {
        if (candy.typeIndex === INVALID_FACTORY_CANDY_INDEX) {
          hasInvalidFactory = true
        }
      })

      return { bottomLineLength, hasInvalidFactoryY: hasInvalidFactory }
    }
  }

  examineIfHasLine() {
    const needToDeleteArray = []
    const needToTurnVanishArray = []

    for (let j = 0; j < this.rowCount; j++) {
      for (let i = 0; i < this.colCount; i++) {
        const candy = this.grid[j][i]
        if (candy === null) continue
        if (candy.typeIndex === DEAD_CANDY_INDEX) continue

        const {
          processedCandys: rightLineArray,
          hasInvalidFactory: xHasInvalidFactory,
        } = xAxisLineChecker.bind(this)(candy)

        const {
          processedCandys: downLineArray,
          hasInvalidFactory: yHasInvalidFactory,
        } = yAxisLineChecker.bind(this)(candy)

        if (rightLineArray.length < 3 && downLineArray.length < 3) continue

        for (let k = 0; k < rightLineArray.length; k++) {
          if (xHasInvalidFactory || yHasInvalidFactory) {
            if (needToTurnVanishArray.indexOf(this.grid[j][i + k]) === -1) {
              needToTurnVanishArray.push(this.grid[j][i + k])
            }
          } else {
            if (needToDeleteArray.indexOf(this.grid[j][i + k]) === -1) {
              needToDeleteArray.push(this.grid[j][i + k])
            }
          }
        }

        for (let k = 0; k < downLineArray.length; k++) {
          if (xHasInvalidFactory || yHasInvalidFactory) {
            if (needToTurnVanishArray.indexOf(this.grid[j + k][i]) === -1) {
              needToTurnVanishArray.push(this.grid[j + k][i])
            }
          } else {
            if (needToDeleteArray.indexOf(this.grid[j + k][i]) === -1) {
              needToDeleteArray.push(this.grid[j + k][i])
            }
          }
        }
      }
    }

    return {
      needToDelete: needToDeleteArray,
      needToTurnVanish: needToTurnVanishArray,
    }

    function getMoreLineCountFromRightEdge(wantedTypeIndex, rightEdgeCandy) {
      const { i, j } = rightEdgeCandy
      if (i >= this.colCount - 1 || j >= this.rowCount - 1) return []

      let isWhileLoopOn = true
      let count = 0
      const lineArray = []

      while (isWhileLoopOn) {
        const rightCandy = this.grid[j][i + count + 1]

        if (rightCandy?.typeIndex === wantedTypeIndex) {
          count++
          lineArray.push(rightCandy)
        } else {
          isWhileLoopOn = false
        }
      }

      return lineArray
    }
    function getMoreLineCountFromDownEdge(wantedTypeIndex, downEdgeCandy) {
      const { i, j } = downEdgeCandy
      if (i >= this.colCount - 1 || j >= this.rowCount - 1) return []

      let isWhileLoopOn = true
      let count = 0
      const lineArray = []

      while (isWhileLoopOn) {
        const downCandy = this.grid[j + count + 1]?.[i]

        if (downCandy?.typeIndex === wantedTypeIndex) {
          count++
          lineArray.push(downCandy)
        } else {
          isWhileLoopOn = false
        }
      }

      return lineArray
    }

    function xAxisLineChecker(candy) {
      const { i, j } = candy
      // right validation
      const rightSecondCandy = this.grid[j]?.[i + 1]
      const rightThirdCandy = this.grid[j]?.[i + 2]
      if (!rightSecondCandy || !rightThirdCandy)
        return { processedCandys: [], hasInvalidFactory: false }

      // validate line
      let processedCandys = [candy, rightSecondCandy, rightThirdCandy]
      let rightCount = 0
      let hasInvalidFactory = false
      // let currentTypeIndex
      // O O O
      if (
        candy.typeIndex === rightSecondCandy?.typeIndex &&
        candy.typeIndex === rightThirdCandy?.typeIndex
      ) {
        console.log('has normal line')
        rightCount = 3
        // currentTypeIndex = candy.typeIndex

        // check if has another matched candy
        let isWhileLoopOn = true
        while (isWhileLoopOn) {
          const nextCandy = this.grid[j]?.[i + rightCount]

          // OOOO
          if (candy.typeIndex === nextCandy?.typeIndex) {
            processedCandys.push(nextCandy)
            rightCount++
          } else if (nextCandy?.typeIndex === INVALID_FACTORY_CANDY_INDEX) {
            // OOOF
            processedCandys.push(nextCandy)
            rightCount++
            hasInvalidFactory = true
          }
          // OOOX
          else {
            isWhileLoopOn = false
          }
        }

        //  i += rightCount - 1
      } else if (
        candy.typeIndex === INVALID_FACTORY_CANDY_INDEX &&
        rightSecondCandy?.typeIndex === rightThirdCandy?.typeIndex
      ) {
        console.log('F O O')
        rightCount = 3
        hasInvalidFactory = true

        const { typeIndex } = rightThirdCandy
        const more = getMoreLineCountFromRightEdge.bind(this)(
          typeIndex,
          rightThirdCandy
        )

        if (more.length > 0) {
          processedCandys.push(...more)
          rightCount += more.length
        }
      } else if (
        rightSecondCandy?.typeIndex === INVALID_FACTORY_CANDY_INDEX &&
        candy.typeIndex === rightThirdCandy?.typeIndex
      ) {
        console.log('O F O')
        rightCount = 3
        hasInvalidFactory = true
        const { typeIndex } = rightThirdCandy
        const more = getMoreLineCountFromRightEdge.bind(this)(
          typeIndex,
          rightThirdCandy
        )

        if (more.length > 0) {
          processedCandys.push(...more)
          rightCount += more.length
        }
      } else if (
        rightThirdCandy?.typeIndex === INVALID_FACTORY_CANDY_INDEX &&
        candy.typeIndex === rightSecondCandy?.typeIndex
      ) {
        console.log('O O F')
        rightCount = 3
        hasInvalidFactory = true

        const typeIndex = candy.typeIndex
        const more = getMoreLineCountFromRightEdge.bind(this)(
          typeIndex,
          rightThirdCandy
        )

        if (more.length > 0) {
          processedCandys.push(...more)
          rightCount += more.length
        }
      }

      if (rightCount < 3) {
        return { processedCandys: [], hasInvalidFactory: false }
      } else {
        return { processedCandys, hasInvalidFactory }
      }
    }
    function yAxisLineChecker(candy) {
      const { i, j } = candy
      // right validation
      const downSecondCandy = this.grid[j + 1]?.[i]
      const downThirdCandy = this.grid[j + 2]?.[i]
      if (!downSecondCandy || !downThirdCandy)
        return { processedCandys: [], hasInvalidFactory: false }

      // validate line
      let processedCandys = [candy, downSecondCandy, downThirdCandy]
      let downCount = 0
      let hasInvalidFactory = false
      // let currentTypeIndex
      // O O O
      if (
        candy.typeIndex === downSecondCandy?.typeIndex &&
        candy.typeIndex === downThirdCandy?.typeIndex
      ) {
        console.log('has normal line')
        downCount = 3
        // currentTypeIndex = candy.typeIndex

        // check if has another matched candy
        let isWhileLoopOn = true
        while (isWhileLoopOn) {
          const nextCandy = this.grid[j + downCount]?.[i]

          // OOOO
          if (candy.typeIndex === nextCandy?.typeIndex) {
            processedCandys.push(nextCandy)
            downCount++
          } else if (nextCandy?.typeIndex === INVALID_FACTORY_CANDY_INDEX) {
            // OOOF
            processedCandys.push(nextCandy)
            downCount++
            hasInvalidFactory = true
          }
          // OOOX
          else {
            isWhileLoopOn = false
          }
        }

        //  i += rightCount - 1
      } else if (
        candy.typeIndex === INVALID_FACTORY_CANDY_INDEX &&
        downSecondCandy?.typeIndex === downThirdCandy?.typeIndex
      ) {
        console.log('F O O')
        downCount = 3
        hasInvalidFactory = true

        const { typeIndex } = downThirdCandy
        const more = getMoreLineCountFromDownEdge.bind(this)(
          typeIndex,
          downThirdCandy
        )

        if (more.length > 0) {
          processedCandys.push(...more)
          downCount += more.length
        }
      } else if (
        downSecondCandy?.typeIndex === INVALID_FACTORY_CANDY_INDEX &&
        candy.typeIndex === downThirdCandy?.typeIndex
      ) {
        console.log('O F O')
        downCount = 3
        hasInvalidFactory = true
        const { typeIndex } = downThirdCandy
        const more = getMoreLineCountFromDownEdge.bind(this)(
          typeIndex,
          downThirdCandy
        )

        if (more.length > 0) {
          processedCandys.push(...more)
          downCount += more.length
        }
      } else if (
        downThirdCandy?.typeIndex === INVALID_FACTORY_CANDY_INDEX &&
        candy.typeIndex === downSecondCandy?.typeIndex
      ) {
        console.log('O O F')
        downCount = 3
        hasInvalidFactory = true

        const typeIndex = candy.typeIndex
        const more = getMoreLineCountFromDownEdge.bind(this)(
          typeIndex,
          downThirdCandy
        )

        if (more.length > 0) {
          processedCandys.push(...more)
          downCount += more.length
        }
      }

      if (downCount < 3) {
        return { processedCandys: [], hasInvalidFactory: false }
      } else {
        return { processedCandys, hasInvalidFactory }
      }
    }
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
    this._logGrid()
    console.error('fixError')
    this.candyBox.removeChildren()
    for (let j = this.rowCount - 1; j >= 0; j--) {
      for (let i = 0; i < this.colCount; i++) {
        const candy = this.grid[j][i]
        this.candyBox.addChild(candy.container)
      }
    }
  }

  // ===== game flow =====
  async startGameFlow() {
    console.log('startGameFlow')
    this.playMusic()

    await this._wait(500)
    this.pointArray = [
      { typeIndex: 0, count: 0, point: 100 },
      { typeIndex: 1, count: 0, point: 75 },
      { typeIndex: 2, count: 0, point: 50 },
      { typeIndex: 3, count: 0, point: 200 },
      { typeIndex: INVALID_FACTORY_CANDY_INDEX, count: 0, point: 200 },
    ]

    switch (this.gameLevel) {
      case 0:
        this.gameLevel0_0()
        break

      case 1:
        this.gameLevel1()
        break

      case 2:
        this.gameLevel2()
        break

      case 3:
        this.gameLevel--
        this.gameLevel2()
        break
    }
  }

  async gameLevel0_0() {
    await this.doctorSay.newSay(
      '蓋一個村莊最重要的就是找資源啦！我需要你幫忙蒐集素材。'
    )
    await this.doctorSay.newSay(
      '綠色方塊代表農業區，紅色方塊代表工業區，白色方塊代表住商區，黃色方塊代表鄉村區，藍色方塊代表國土保育區。每一個資源都有不同的分數。'
    )
    await this.doctorSay.newSay(
      '遊戲方式很簡單，只要讓 3 個以上相同的方塊連在一起，就可以獲得這個素材了！'
    )
    await this.doctorSay.newSay(
      '為了蓋出理想的村莊，你還可以善用「重新整理」鍵，搜集自己最喜歡的方塊類型，建設理想中的田園城市，或是工業大城！'
    )

    const chosen = await this.doctorSay.chooseSay(
      '只要幫我收集到每一關需要的分數，你想怎麼蓋都可以！',
      {
        text: '準備好了',
        color: '0x000000',
        bgColor: '0xFF8B29',
        value: 'play',
      },
      {
        text: '我不想玩',
        color: '0x000000',
        bgColor: '0xc4c4c4',
        value: 'menu',
      }
    )

    if (chosen === 'play') {
      // this.createPoisonInterval('fauset')
      this.gameLevel0_1()
    } else {
      await this.shareGame()
      this.backToMenuFromBegining()
    }
  }

  async gameLevel0_1() {
    await this.doctorSay.newSay('萬事起頭難，要建立一個村莊很不容易啊！')
    await this.doctorSay.newSay(
      '我可以給你小小的提示，對一座剛發展的村莊來說，均衡是很重要的，少了哪個區塊，對未來都不是好事～'
    )
    await this.startGame()
    await this.initGame()
  }

  async gameLevel1() {
    await this.doctorSay.newSay('你的村莊越來越有規模了，資源也變多啦～')
    await this.doctorSay.newSay('哎，你有注意到愈來愈多人想搬進來嗎？')
    await this.doctorSay.newSay(
      '想讓城市發展得更興旺的話，工業區、住宅區跟商業區很重要呢，你會做出怎樣的選擇呢？'
    )
    await this.startGame()
    await this.initGame()
  }

  async gameLevel2() {
    await this.doctorSay.newSay('你的村莊發展得很快！')
    await this.doctorSay.newSay(
      '不過成長得太迅速也不是好事哦，像違章工廠就悄悄長出來了。'
    )
    await this.doctorSay.newSay(
      '如果工廠繼續增加的話，雖然能提高城市的收入，但環境就會被污染，長不出其他的方塊了。'
    )
    await this.doctorSay.newSay(
      '當然，你也可以選擇忽略違章工廠，收集其他的素材來達到目標分數，你該怎麼辦呢？'
    )
    await this.startGame()
    await this.initGame()
  }

  // ===== start game =====
  async startGame() {
    await super.startGame()

    const groundGroupTopY =
      this.groundGroup.container.y - this.groundGroup.container.height / 2
    const gameStageBottomY = gameStageDimention.y + gameStageDimention.height

    this.menuButtons.container.y =
      groundGroupTopY + (gameStageBottomY - groundGroupTopY) / 2

    this.isGameStop = false

    this.candyHeader.activeCandyHeader()
    this._startSceneTicker()
  }

  _startSceneTicker() {
    this.sceneTicker = new PIXI.Ticker()

    this.sceneTicker.add(async () => {})

    this.sceneTicker.start()
  }

  // ===== game pause =====
  _pauseAllGameActivity() {
    this.isGameStop = true

    this.candyHeader.deactiveCandyHeader()
  }

  _resumeAllGameActivity() {
    this.isGameStop = false

    this.candyHeader.activeCandyHeader()
  }

  // ===== game over =====

  async failGameHint() {
    this.playFailMusic()
    super.failGameHint()

    // switch (this.gameLevel) {
    //   case 1:
    //     await this.doctorSay.newSay(
    //       '雖然缺水的問題處理得不順利，但整體表現還算不錯！'
    //     )
    //     await this.doctorSay.newSay(
    //       '恭喜你獲得臺東縣的限定卡，可以看到這裡的垃圾問題多麽嚴重，以及縣政府打算如何處理。'
    //     )
    //     await this.doctorSay.newSay(
    //       '你同時也解開了其他擁有垃圾問題的縣市，可以點選有此困擾的縣市，看各地政府如何因應。'
    //     )
    //     break
    // }
  }

  async failGameChooseHandler(chosen) {
    this.stopFailMusic()
    switch (chosen) {
      case 'restart':
        this.container.removeChild(this.gameFail.container)
        this.playMusic()
        this.resetGameSetting()
        this.initGame()
        this.startGame()
        break

      case 'menu':
        this.container.removeChild(this.gameFail.container)
        await this.shareGame()
        this.backToMenu(true)
        break
    }
  }

  // ===== game pass =====

  async successGameHint() {
    this.playSuccessMusic()

    super.successGameHint()
    this.gameLevel++

    // save
    Status.candy.gameLevel++
    if (this.gameLevel !== 3) {
      this.pointArray.forEach((candyType, index) => {
        this.pointArrayRecord[index].count += candyType.count
      })

      Status.candy.pointArray = this.pointArrayRecord
    }
    console.log(Status.candy.pointArray)

    if (this.gameLevel === 3) {
      // get the largest
      let largest = this.pointArray[0]
      this.pointArray.forEach((candyType) => {
        if (candyType.count > largest) {
          largest = candyType
        }
      })
      console.log(largest)

      switch (largest.typeIndex) {
        case 0:
          await this.doctorSay.newSay(
            '從你的選擇看來，你認為一個村莊最重要的資源就是農地了，'
          )
          await this.doctorSay.newSay(
            '和宜蘭縣、雲林縣一樣，把農業視為是重點發展方向，或是在境內規劃了很多宜維護農地。田園城市是你的夢想！'
          )

          break

        case 1:
          await this.doctorSay.newSay(
            '從你的選擇看來，你認為一個村莊最重要的資源就是住商中心了，'
          )
          await this.doctorSay.newSay(
            '和新竹縣、彰化縣一樣，目標是讓更多人搬進來，活絡當地的商業發展。'
          )
          break

        case 2:
          await this.doctorSay.newSay(
            '從你的選擇看來，你認為一個村莊最重要的資產就是自然資源了，'
          )
          await this.doctorSay.newSay(
            '和南投縣、臺東縣一樣，劃設出許多的國土保育地區，保護自然資源。兼顧發展與保育是你的夢想！'
          )
          break

        case 3:
          await this.doctorSay.newSay(
            '從你的選擇看來，你認為一個村莊最重要的資源就是工業區了，'
          )
          await this.doctorSay.newSay(
            '和桃園市、高雄市一樣，把二級產業視為是重點發展方向，或是在境內規劃了很多產業園區。製造業中心是你的夢想！'
          )

          break
        case 4:
          await this.doctorSay.newSay('哎呀！你好像蠻喜歡蓋違章工廠，')
          await this.doctorSay.newSay(
            '雖然可以賺比較多的分數，但代價就是周遭的土地可能不能再使用哦！像是彰化縣就曾經有大量農地受到重金屬污染無法再耕作，三思而後行啊！'
          )

          break
      }

      unlockCandy()
    }
  }

  async successGameChooseHandler(chosen) {
    this.stopSuccessMusic()

    switch (chosen) {
      case 'nextLevel':
        this.container.removeChild(this.gameSuccess.container)

        this.resetGameSetting()
        this.startGameFlow()
        break

      default:
      case 'menu':
        if (this.gameLevel === 3) {
          await this.doctorSay.newSay(
            '下面這些村莊也遭遇到類似的問題，好好閱讀他們的經驗，相信會對你有所幫助！'
          )
        }

        this.container.removeChild(this.gameSuccess.container)
        this.backToMenu(true)
        break
    }
  }

  resetGameSetting() {
    console.log('resetGameSetting')
    // super.removeKeyboardListener()
    super.resetGameSetting()
    this.removeAllCandys()
    this.candyHeader.pointArray = this.pointArray
    this.candyHeader.resetCandyHeader(this.gameLevel)
    this.grid = []
  }

  _logGrid() {
    console.log('==========================')
    for (let j = 0; j < this.rowCount; j++) {
      const row = []
      for (let i = 0; i < this.colCount; i++) {
        // row.push(getColor(this.grid[j][i]?.typeIndex))
        row.push(this.grid[j]?.[i]?.typeIndex)
      }
      // console.log(this.grid[j])
      console.log(row)
    }
  }

  destroyScene() {
    this.candyHeader.destoryCandyHeader()
  }
}

function generateTwoRandomNumber(maxNumber) {
  let randomNumber1 = Math.floor(Math.random() * maxNumber)
  let randomNumber2

  do {
    randomNumber2 = Math.floor(Math.random() * maxNumber)
  } while (randomNumber1 === randomNumber2)

  return {
    randomNumber1,
    randomNumber2,
  }
}
