import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
const controllerPosition = Globals.getSnakeControllerPosition()
const CONTROLLER_WIDTH = 75
const BUTTON_WIDTH = CONTROLLER_WIDTH / 3

export class SnakeController {
  constructor(moveDirection) {
    this.moveDirection = moveDirection
    this.container = new PIXI.Container()

    this.container.width = CONTROLLER_WIDTH
    this.container.height = CONTROLLER_WIDTH
    this.container.x = controllerPosition.x
    this.container.y = controllerPosition.y

    this.activeRegionArray = []
    this.createController()
  }

  createController() {
    for (let i = 0; i < CONTROLLER_WIDTH; i++) {
      const button = new PIXI.Graphics()
      button.beginFill(0xffffff)
      button.drawRect(0, 0, BUTTON_WIDTH, BUTTON_WIDTH)
      button.endFill()

      const activeRegion = new PIXI.Graphics()
      activeRegion.beginFill(0xff0000, 1)
      activeRegion.drawCircle(0, 0, BUTTON_WIDTH + 2)
      activeRegion.endFill()
      activeRegion.alpha = 0

      const buttonDirection = getButtonPosition(i)
      activeRegion.buttonDirection = buttonDirection

      switch (buttonDirection) {
        case 'up':
          button.x = CONTROLLER_WIDTH / 3
          button.y = 0
          activeRegion.x = CONTROLLER_WIDTH / 3 + BUTTON_WIDTH / 2
          activeRegion.y = 0
          break

        case 'right':
          button.x = (CONTROLLER_WIDTH * 2) / 3
          button.y = CONTROLLER_WIDTH / 3
          activeRegion.x = CONTROLLER_WIDTH
          activeRegion.y = CONTROLLER_WIDTH / 2

          break
        case 'down':
          button.x = CONTROLLER_WIDTH / 3
          button.y = (CONTROLLER_WIDTH * 2) / 3
          activeRegion.x = CONTROLLER_WIDTH / 3 + BUTTON_WIDTH / 2
          activeRegion.y = CONTROLLER_WIDTH
          break
        case 'left':
          button.x = 0
          button.y = CONTROLLER_WIDTH / 3
          activeRegion.x = 0
          activeRegion.y = CONTROLLER_WIDTH / 2
          break

        case 'center':
        default:
          button.x = CONTROLLER_WIDTH / 3
          button.y = CONTROLLER_WIDTH / 3
          activeRegion.visible = false
          break
      }

      if (buttonDirection !== 'center') {
        this.activeRegionArray.push(activeRegion)
      }

      this.container.addChild(button, activeRegion)
    }
  }

  activeListener() {
    this.activeRegionArray.forEach((activeRegion) => {
      activeRegion.interactive = true
      activeRegion.buttonMode = true
      activeRegion.addListener('pointerdown', () => {
        const direction = activeRegion.buttonDirection

        switch (direction) {
          case 'down':
            if (
              this.moveDirection[this.moveDirection.length - 1] === 'up' ||
              this.moveDirection[this.moveDirection.length - 1] === 'down'
              // this.snakeArray[0].direction === 'up'
            ) {
              break
            }

            this.moveDirection.push('down')
            break
          case 'right':
            if (
              this.moveDirection[this.moveDirection.length - 1] === 'left' ||
              this.moveDirection[this.moveDirection.length - 1] === 'right'
              // this.snakeArray[0].direction === 'left'
            ) {
              break
            }

            this.moveDirection.push('right')

            break
          case 'up':
            if (
              this.moveDirection[this.moveDirection.length - 1] === 'down' ||
              this.moveDirection[this.moveDirection.length - 1] === 'up'
              // this.snakeArray[0].direction === 'down'
            ) {
              break
            }

            this.moveDirection.push('up')

            break
          case 'left':
            if (
              this.moveDirection[this.moveDirection.length - 1] === 'right' ||
              this.moveDirection[this.moveDirection.length - 1] === 'left'
              // this.snakeArray[0].direction === 'right'
            ) {
              break
            }

            this.moveDirection.push('left')

            break
        }
      })
    })
  }

  deactiveListener() {
    this.activeRegionArray.forEach((activeRegion) => {
      activeRegion.interactive = false
      activeRegion.buttonMode = false
      activeRegion.removeAllListeners()
    })
  }
}

function getButtonPosition(i) {
  switch (i) {
    case 0:
      return 'up'

    case 1:
      return 'right'
    case 2:
      return 'down'
    case 3:
      return 'left'
    default:
      return 'center'
  }
}
