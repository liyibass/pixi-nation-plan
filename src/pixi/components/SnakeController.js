import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'

const CONTROLLER_WIDTH = 75
export class SnakeController {
  constructor(controllerPosition) {
    this.container = new PIXI.Container()
    this.container.width = CONTROLLER_WIDTH
    this.container.height = CONTROLLER_WIDTH
    this.container.x = controllerPosition.x
    this.container.y = controllerPosition.y
    this.createController()
  }

  createController() {
    for (let i = 0; i < CONTROLLER_WIDTH; i++) {
      const button = new PIXI.Graphics()
      button.beginFill(0xffffff)
      button.drawRect(0, 0, 25, 25)
      button.endFill()

      const buttonDirection = getButtonPosition(i)

      switch (buttonDirection) {
        case 'up':
          button.x = CONTROLLER_WIDTH / 3
          button.y = 0
          break

        case 'right':
          button.x = (CONTROLLER_WIDTH * 2) / 3
          button.y = CONTROLLER_WIDTH / 3
          break
        case 'down':
          button.x = CONTROLLER_WIDTH / 3
          button.y = (CONTROLLER_WIDTH * 2) / 3
          break
        case 'left':
          button.x = 0
          button.y = CONTROLLER_WIDTH / 3
          break

        case 'center':
        default:
          button.x = CONTROLLER_WIDTH / 3
          button.y = CONTROLLER_WIDTH / 3
          break
      }

      this.container.addChild(button)
    }
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
