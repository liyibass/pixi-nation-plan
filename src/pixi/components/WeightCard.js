import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const CARD_PADDING = 10
const MIN_SPRITE_WIDTH = 30

const TIMER_WIDTH = 69
const TOP_PADDING = 31

const { width: GAMESTAGE_WIDTH, height: GAMESTAGE_HEIGHT } =
  Globals.getSeesawGameStageDimention()

export class WeightCard {
  constructor(weight = 100, name = 'weightAdult', weightCardHandler) {
    this.container = new PIXI.Container()
    this.container.name = 'weightCard'
    this.weight = weight
    this.name = name
    this.weightCardHandler = weightCardHandler
    // linkList
    this.nextCard = null
    this.prevCard = null

    this.width = this._getWeightWidth()
    this.height = 70
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
    }

    // calculate targetX
    const frontCardsWidth = this._getPrevCardsWidth(this.prevCard)
    this.targetX = this._getXValue(frontCardsWidth)

    // if container.x > targetX, then move card
    this.positionTicker = new PIXI.Ticker()

    this.positionTicker.add(() => {
      if (this.x > this.targetX) {
        this.x -= 1

        if (!this.isDragging) {
          this.container.x = this.x
        }
      } else {
        this.positionTicker.destroy()
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
  }

  onTouchStart() {
    // set the dragging state for this sprite
    this.isDragging = !this.isDragging

    if (this.isOnConveyor) {
      if (this.isDragging) {
        // remember the position of the mouse cursor
        this._rememberOriginalPosition()

        // set card's zIndex to top
        this.container.parent.setChildIndex(
          this.container,
          this.container.parent.children.length - 1
        )
      } else {
        // reset card's zIndex
        this.container.parent.setChildIndex(this.container, 0)

        const { x, y } = this.container
        const { x: originalX, y: originalY } = this.originalPosition

        if (x !== originalX && y !== originalY && y > originalY + 60) {
          this._dropWeightCardToSeesaw(this)
        } else {
          this._resetToOriginalPosition()
        }
      }
    } else {
      // we put card on board before
      // however while board is rotating, card's position will be chaos
      // so need to set card's parent to seesawGroup temporary
      const seesawBoard = this.seesawBoardRef.container
      const seesawGroup = this.seesawGroupRef.container

      if (this.isDragging) {
        // remember the position of the mouse cursor
        this._rememberOriginalPosition()

        // set card's zIndex to top
        this.container.parent.setChildIndex(
          this.container,
          this.container.parent.children.length - 1
        )

        seesawBoard.removeChild(this.container)
        seesawGroup.addChild(this.container)
      } else {
        const { x, y } = this.container
        const { x: originalX, y: originalY } = this.originalPosition

        // console.log(`${x},${y}`)
        // console.log(`${originalX},${originalY}`)

        if (x !== originalX && y !== originalY) {
          console.log('drop card in seesaw')
          this._dropWeightCardToSeesaw(this)
        } else {
          this._resetToOriginalPosition()
        }

        seesawGroup.removeChild(this.container)
        seesawBoard.addChild(this.container)
      }
    }
  }

  onTouchMove(event) {
    if (!this.isDragging) return

    if (this.isOnConveyor) {
      const { x, y } = this._getPositionRelativeToGameStage(event)

      if (x - this.container.width / 2 < 0) {
        this.container.x = 0 - TIMER_WIDTH + this.container.width / 2
      } else if (x + this.container.width / 2 > GAMESTAGE_WIDTH) {
        this.container.x =
          GAMESTAGE_HEIGHT - TIMER_WIDTH - this.container.width / 2
      } else if (y - this.container.height / 2 < 0) {
        this.container.y = 0 - TOP_PADDING + this.container.height / 2
      } else if (y + this.container.height / 2 > GAMESTAGE_HEIGHT) {
        this.container.y =
          GAMESTAGE_WIDTH - TOP_PADDING - this.container.width / 2
      } else {
        // 3. apply the rusulting offset
        this.container.x = x - TIMER_WIDTH
        this.container.y = y - TOP_PADDING
      }
    } else {
      const { x, y } = this._getPositionRelativeToSeesawGroup(event)

      this.container.x = x
      this.container.y = y
    }
  }

  _rememberOriginalPosition() {
    if (this.positionTicker.started) {
      this.originalPosition = {
        x: this.container.x,
        y: this.container.y,
      }
    } else {
      this.originalPosition = {
        x: this.x,
        y: this.y,
      }
    }
  }

  _resetToOriginalPosition() {
    if (!this.positionTicker.started) {
      // this.container.x = this.x
      // this.container.y = this.y
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
        20,
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
