import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const CARD_PADDING = 10
const CARD_HEIGHT = 70
const MIN_SPRITE_WIDTH = 30

const TIMER_WIDTH = 69
const TOP_PADDING = 31
const SPEED = 3

const {
  width: GAMESTAGE_WIDTH,
  height: GAMESTAGE_HEIGHT,
  x: GAMESTAGE_X,
  y: GAMESTAGE_Y,
} = Globals.getSeesawGameStageDimention()

export class WeightCard {
  constructor(weight = 100, name = 'weightAdult', load = 1, weightCardHandler) {
    this.container = new PIXI.Container()
    this.container.name = 'weightCard'
    this.name = name
    this.weight = weight
    this.load = load
    this.weightCardHandler = weightCardHandler
    // linkList
    this.nextCard = null
    this.prevCard = null

    this.width = this._getWeightWidth()
    this.height = CARD_HEIGHT
    this.isDragging = false

    // card position which card need bo be in
    this.targetX
    this.targetY

    // primary card's position data, need to set them first, then set container.x/y
    this.x
    this.y

    this.isOnConveyor = true

    this.createWeightCard()

    this.createDraggableBehavior()

    this.seesawSide = ''
  }

  createWeightCard() {
    // create every component we nedded
    this.createFrame()
    const weightSprite = this.createWeightIcon()
    const weightText = this.createWeightText()

    // position components in card
    weightText.y = this.height - weightText.height
    weightSprite.y = this.height - weightText.height - 5 - weightSprite.height

    // set card container's init position
    this.container.pivot.set(this.width / 2, this.height / 2)
    this.x = GAMESTAGE_WIDTH
    this.y = TOP_PADDING
    this.container.x = this.x
    this.container.y = this.y

    // add all component into card container
    this.container.addChild(weightSprite, weightText)
  }

  _getWeightWidth() {
    switch (this.name) {
      case 'weightBus':
        return 90 + CARD_PADDING * 2

      case 'weightShop':
        return 60 + CARD_PADDING * 2

      default:
        return MIN_SPRITE_WIDTH + CARD_PADDING * 2
    }
  }

  startPositionCard() {
    // remove ongoing ticker if existed
    if (this.positionTicker?.started) {
      this.positionTicker.destroy()
      this.positionTicker = null
    }

    // calculate targetX
    const frontCardsWidth = this._getPrevCardsWidth(this.prevCard)
    this.targetX = this._getXValue(frontCardsWidth)

    // if container.x > targetX, then move card
    this.positionTicker = new PIXI.Ticker()

    this.positionTicker.add(() => {
      if (this.x > this.targetX) {
        this.x -= SPEED

        if (!this.isDragging) {
          this.container.x = this.x
        }
      } else {
        this.positionTicker.destroy()
        this.positionTicker = null
      }
    })

    this.positionTicker.start()
  }

  _getPrevCardsWidth(prevCard) {
    if (!prevCard) return 0

    let accumulator = 0
    accumulator = getPrevCardWidth(prevCard)
    return accumulator

    function getPrevCardWidth(currentCard) {
      if (currentCard.prevCard) {
        return currentCard.width + getPrevCardWidth(currentCard.prevCard)
      } else {
        return currentCard.width
      }
    }
  }

  _getXValue(x) {
    return this.width / 2 + x
  }

  createFrame() {
    const frame = new PIXI.Graphics()
    frame.beginFill(0xaaaaaa, 0.1)
    frame.drawRect(0, 0, this.width, this.height)
    frame.endFill()
    this.container.addChild(frame)
  }

  createWeightIcon() {
    const weightTexture = Globals.resources[this.name]?.texture
    const weightSprite = new PIXI.Sprite(weightTexture)

    weightSprite.anchor.set(0.5, 0)
    weightSprite.x = this.width / 2
    return weightSprite
  }

  createWeightText() {
    this.weightText = new PIXI.Text(`${this.weight}`, {
      fill: [0xffffff],
      fontSize: 14,
    })
    this.weightText.anchor.set(0.5, 0)
    this.weightText.x = this.width / 2

    return this.weightText
  }

  createDraggableBehavior() {
    this.container.interactive = true
    this.container.buttonMode = true

    this.container.on('pointerdown', this.onTouchStart.bind(this))
    this.container.on('pointermove', this.onTouchMove.bind(this))
    this.container.on('pointerup', this.onTouchLeave.bind(this))
  }

  onTouchStart() {
    // console.log('OnTouchStart')
    // set the dragging state for this sprite
    this.isDragging = true

    this.weightText.alpha = 1

    if (this.isOnConveyor) {
      // remember the position of the mouse cursor
      this._rememberOriginalPosition()

      // set card's zIndex to top
      this.container.parent.setChildIndex(
        this.container,
        this.container.parent.children.length - 1
      )
    } else {
      // we put card on board before
      // however while board is rotating, card's position will be chaos
      // so need to set card's parent to seesawGroup temporary
      const seesawBoard = this.seesawBoardRef.container
      const seesawGroup = this.seesawGroupRef.container
      seesawBoard.removeChild(this.container)
      seesawGroup.addChild(this.container)

      // remember the position of the mouse cursor
      this._rememberOriginalPosition()

      // set card's zIndex to top
      this.container.parent.setChildIndex(
        this.container,
        this.container.parent.children.length - 1
      )
    }
  }

  onTouchMove(event) {
    // console.log('onTouchMove')
    if (!this.isDragging) return

    if (this.isOnConveyor) {
      const { x, y } = this._getPositionRelativeToGameStage(event)
      const leftBoundary = 0 - TIMER_WIDTH + this.container.width / 2
      const rightBoundary =
        GAMESTAGE_WIDTH - TIMER_WIDTH - this.container.width / 2
      const topBoundary = 0 - TOP_PADDING + this.container.height / 2
      const bottomBoundary =
        GAMESTAGE_HEIGHT - TOP_PADDING - this.container.width / 2

      if (x - this.container.width / 2 < 0) {
        this.container.x = leftBoundary
      } else if (x + this.container.width / 2 > GAMESTAGE_WIDTH) {
        this.container.x = rightBoundary
      } else if (y - this.container.height / 2 < 0) {
        this.container.y = topBoundary
      } else if (y + this.container.height / 2 > GAMESTAGE_HEIGHT) {
        this.container.y = bottomBoundary
      } else {
        // 3. apply the rusulting offset
        this.container.x = x - TIMER_WIDTH
        this.container.y = y - TOP_PADDING
      }

      this.container.x = x - TIMER_WIDTH
      this.container.y = y - TOP_PADDING

      // check if out of boundary
      const { x: pointerX, y: pointerY } = event.data.global

      if (
        pointerX < 0 ||
        pointerX > window.innerWidth ||
        pointerY < 0 ||
        pointerY > window.innerHeight ||
        pointerX < GAMESTAGE_X ||
        pointerX > GAMESTAGE_X + GAMESTAGE_WIDTH ||
        pointerY < GAMESTAGE_Y + TOP_PADDING ||
        pointerY > GAMESTAGE_Y + TOP_PADDING + GAMESTAGE_HEIGHT
      ) {
        console.log('YOYO')
        this.isDragging = false
        this.onTouchLeave()
      }
    } else {
      const { x, y } = this._getPositionRelativeToSeesawGroup(event)

      this.container.x = x
      this.container.y = y
    }
  }

  onTouchLeave() {
    // console.log('===onTouchLeave')

    this.isDragging = false

    if (this.isOnConveyor) {
      // reset card's zIndex
      this.container.parent.setChildIndex(this.container, 0)

      const { x, y } = this.container

      // console.log(this.originalPosition)
      if (!this.originalPosition) {
        return
      }
      const { x: originalX, y: originalY } = this.originalPosition

      if (x !== originalX && y !== originalY && y > originalY + 60) {
        this._dropWeightCardToSeesaw(this)
      } else {
        this._resetToOriginalPosition()
      }
    } else {
      // we put card on board before
      // however while board is rotating, card's position will be chaos
      // so need to set card's parent to seesawGroup temporary
      const seesawBoard = this.seesawBoardRef.container
      const seesawGroup = this.seesawGroupRef.container
      seesawBoard.removeChild(this.container)
      seesawGroup.addChild(this.container)

      seesawGroup.removeChild(this.container)
      seesawBoard.addChild(this.container)

      // const { x, y } = this.container
      // console.log(this.originalPosition)
      // const { x: originalX, y: originalY } = this.originalPosition

      this._dropWeightCardToSeesaw(this)
      // if (x !== originalX || y !== originalY) {
      //   console.log('drop card in seesaw')
      //   this._dropWeightCardToSeesaw(this)
      // } else {
      //   console.log('_resetToOriginalPosition')
      //   this._resetToOriginalPosition()
      // }
    }
  }

  _rememberOriginalPosition() {
    if (this.positionTicker?.started) {
      this.originalPosition = {
        x: this.container.x,
        y: this.container.y,
      }
    } else {
      this.originalPosition = {
        x: this.container.x,
        y: this.container.y,
      }
    }
  }

  _resetToOriginalPosition() {
    if (!this.positionTicker?.started) {
      this.container.x = this.x
      this.container.y = this.y
    } else {
      this.container.x = this.originalPosition.x
      this.container.y = this.originalPosition.y
    }
  }

  _getPositionRelativeToGameStage(event) {
    const relativeParent = this.container.parent.parent

    return {
      x: event.data.global.x - relativeParent.x,
      y: event.data.global.y - relativeParent.y,
    }
  }

  _getPositionRelativeToSeesawGroup(event) {
    const seesawGameStageDimention = Globals.getSeesawGameStageDimention()

    return {
      x: event.data.global.x - seesawGameStageDimention.x,
      y:
        event.data.global.y -
        seesawGameStageDimention.y -
        seesawGameStageDimention.height +
        Globals.SEESAW_HEIGHT -
        60,
    }
  }

  _leftOrRight(event) {
    const { x } = event.data.global

    return x < Globals.width / 2 ? 'left' : 'right'
  }

  _dropWeightCardToSeesaw(weightCard) {
    this.weightCardHandler(weightCard)
  }

  shiftPosition() {
    this.startPositionCard()
  }
}
