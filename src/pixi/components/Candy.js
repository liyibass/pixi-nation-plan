import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
const gameStageDimention = Globals.getCandyGameStageDimention()
const CANDY_WIDTH = gameStageDimention.candyWidth
const SWAP_SPEED = 4

const INVALID_FACTORY_CANDY_INDEX = 4
const DEAD_CANDY_INDEX = 5
export class Candy {
  constructor(typeIndex = 0, i = 0, j = 0, swapHandler = () => {}) {
    this.typeIndex = typeIndex
    this.j = j
    this.i = i
    this.swapHandler = swapHandler
    this.candyPoint = getCandyPoint(typeIndex)

    this.container = new PIXI.Container()
    this.container.name = 'candy'

    this.oldPosition = null
    this.newPosition = null
    // this.container.buttonMode = true
    // this.container.interactive = true

    this.createCandy()
    this.candyInitPosition()
    // this.startFallingCandy()

    // this.topCandy = null
    // this.bottomCandy = null
    // this.leftCandy = null
    // this.rightCandy = null
    // this.isDelete = false

    if (this.typeIndex === INVALID_FACTORY_CANDY_INDEX) {
      console.log('YOYO')
      this.blinkInvalidFactoryCandy()
    }
  }

  createCandy() {
    // console.log(this.index)

    const candyBackground = new PIXI.Graphics()
    candyBackground.beginFill(0x232c5b)
    candyBackground.drawRoundedRect(0, 0, CANDY_WIDTH, CANDY_WIDTH, 20)
    this.container.addChild(candyBackground)

    const candyTexture = new PIXI.Texture(
      Globals.resources[`b${this.typeIndex}`]?.texture
    )
    const candySprite = new PIXI.Sprite(candyTexture)

    candySprite.width = CANDY_WIDTH
    candySprite.height = CANDY_WIDTH

    this.candyIconContainer = new PIXI.Container()
    this.candyIconContainer.addChild(candySprite)
    this.container.addChild(this.candyIconContainer)
  }

  async dead() {
    if (this.typeIndex !== DEAD_CANDY_INDEX) return
    this.updateCandyTexture(DEAD_CANDY_INDEX - 1)
    this.candyPoint = getCandyPoint(this.typeIndex)
    this.blinkTicker?.stop?.()
    this.stopDragMonitor()

    await this.vanish()
  }

  updateCandyTexture(index) {
    this.candyIconContainer.removeChildren()

    const candyTexture = new PIXI.Texture(
      Globals.resources[`b${index}`]?.texture
    )
    const candySprite = new PIXI.Sprite(candyTexture)

    candySprite.width = CANDY_WIDTH
    candySprite.height = CANDY_WIDTH
    candySprite.alpha = 0.5

    this.candyIconContainer.addChild(candySprite)
  }

  candyInitPosition() {
    // console.log(`${this.i * CANDY_WIDTH}, ${this.j * CANDY_WIDTH}`)
    this.container.x = this.i * CANDY_WIDTH
    this.container.y = -CANDY_WIDTH
    // this.container.y =
    //   -(gameStageDimention.rowCount - (this.i + 1)) * CANDY_WIDTH
  }

  startFallingCandy() {
    this.candyDropTicker = new PIXI.Ticker()
    const v0 = 0
    const g = 0.5
    let time = 0
    let dropDistance = 0

    if (this.container.y < 0) {
      this.container.alpha = 0
    }

    const initY = this.container.y

    return new Promise((resolve) => {
      this.candyDropTicker.add((delta) => {
        if (this.container.alpha < 1) {
          this.container.alpha += 0.08
        } else {
          this.container.alpha = 1
        }

        if (this.container.y < this.j * CANDY_WIDTH) {
          dropDistance = initY + v0 * time + 0.5 * g * Math.pow(time, 2)

          // prevent over droping
          if (dropDistance > this.j * CANDY_WIDTH) {
            this.container.y = this.j * CANDY_WIDTH
          } else {
            this.container.y = dropDistance
          }
          time += delta
        } else {
          // const v = Math.floor(Math.sqrt(v0 + 2 * g * dropDistance))
          // console.log(v)
          this.candyDropTicker.stop()
          this.container.y = this.j * CANDY_WIDTH

          resolve()
        }
      })

      this.candyDropTicker.start()
    })
  }

  startDragMonitor() {
    this.container.interactive = true
    this.container.buttonMode = true

    // let startPoint = null
    // let currentPoint = null

    this.container
      .on('mousedown', this.onDragStart.bind(this))
      .on('touchstart', this.onDragStart.bind(this))
      // events for drag end
      .on('mouseup', this.onDragEnd.bind(this))
      .on('mouseupoutside', this.onDragEnd.bind(this))
      .on('touchend', this.onDragEnd.bind(this))
      .on('touchendoutside', this.onDragEnd.bind(this))
      // events for drag move
      .on('mousemove', this.onDragMove.bind(this))
      .on('touchmove', this.onDragMove.bind(this))
  }

  stopDragMonitor() {
    this.container.interactive = false
    this.container.buttonMode = false
    this.container.removeAllListeners()
  }

  onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data
    this.container.alpha = 0.5
    this.dragging = true
    this.oldPosition = this.data.getLocalPosition(this.container.parent)
  }

  onDragEnd() {
    this.container.alpha = 1
    this.dragging = false

    if (this.oldPosition && this.newPosition) {
      const direction = this.getDragDirection()

      this.swapHandler(this, direction)
    }

    // set the interaction data to null
    this.data = null
    this.oldPosition = null
    this.newPosition = null
  }

  onDragMove() {
    if (this.dragging) {
      this.newPosition = this.data.getLocalPosition(this.container.parent)
    }
  }

  getDragDirection() {
    const deltaX = this.newPosition.x - this.oldPosition.x
    const deltaY = this.newPosition.y - this.oldPosition.y

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // left or right drag
      return deltaX > 0 ? 'right' : 'left'
    } else {
      // up or down drag
      return deltaY > 0 ? 'down' : 'up'
    }
  }

  moveRightTicker() {
    this.swapTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.swapTicker.add(() => {
        if (this.container.x < this.i * CANDY_WIDTH) {
          this.container.x += SWAP_SPEED
        } else {
          this.container.x = this.i * CANDY_WIDTH
          this.swapTicker.stop()

          resolve()
        }
      })
      this.swapTicker.start()
    })
  }
  moveLeftTicker() {
    this.swapTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.swapTicker.add(() => {
        if (this.container.x > this.i * CANDY_WIDTH) {
          this.container.x -= SWAP_SPEED
        } else {
          this.container.x = this.i * CANDY_WIDTH
          this.swapTicker.stop()

          resolve()
        }
      })
      this.swapTicker.start()
    })
  }
  moveDownTicker() {
    this.swapTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.swapTicker.add(() => {
        if (this.container.y < this.j * CANDY_WIDTH) {
          this.container.y += SWAP_SPEED
        } else {
          this.container.y = this.j * CANDY_WIDTH
          this.swapTicker.stop()

          resolve()
        }
      })
      this.swapTicker.start()
    })
  }
  moveUpTicker() {
    this.swapTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      this.swapTicker.add(() => {
        if (this.container.y > this.j * CANDY_WIDTH) {
          this.container.y -= SWAP_SPEED
        } else {
          this.container.y = this.j * CANDY_WIDTH
          this.swapTicker.stop()

          resolve()
        }
      })
      this.swapTicker.start()
    })
  }

  moveRightFailTicker() {
    this.swapTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      let isBlocked = false
      this.swapTicker.add(() => {
        if (!isBlocked && this.container.x < (this.i + 0.2) * CANDY_WIDTH) {
          this.container.x += SWAP_SPEED

          if (this.container.x >= (this.i + 0.2) * CANDY_WIDTH) {
            isBlocked = true
          }
        } else if (isBlocked && this.container.x > this.i * CANDY_WIDTH) {
          this.container.x -= SWAP_SPEED
        } else {
          this.container.x = this.i * CANDY_WIDTH
          this.swapTicker.stop()

          resolve()
        }
      })
      this.swapTicker.start()
    })
  }
  moveLeftFailTicker() {
    this.swapTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      let isBlocked = false
      this.swapTicker.add(() => {
        if (!isBlocked && this.container.x > (this.i - 0.2) * CANDY_WIDTH) {
          this.container.x -= SWAP_SPEED

          if (this.container.x <= (this.i - 0.2) * CANDY_WIDTH) {
            isBlocked = true
          }
        } else if (isBlocked && this.container.x > this.i * CANDY_WIDTH) {
          this.container.x += SWAP_SPEED
        } else {
          this.container.x = this.i * CANDY_WIDTH
          this.swapTicker.stop()

          resolve()
        }
      })
      this.swapTicker.start()
    })
  }
  moveDownFailTicker() {
    this.swapTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      let isBlocked = false
      this.swapTicker.add(() => {
        if (!isBlocked && this.container.y < (this.j + 0.2) * CANDY_WIDTH) {
          this.container.y += SWAP_SPEED

          if (this.container.y >= this.j * CANDY_WIDTH) {
            isBlocked = true
          }
        } else if (isBlocked && this.container.y < this.j * CANDY_WIDTH) {
          this.container.y -= SWAP_SPEED
        } else {
          this.container.y = this.j * CANDY_WIDTH
          this.swapTicker.stop()

          resolve()
        }
      })
      this.swapTicker.start()
    })
  }
  moveUpFailTicker() {
    this.swapTicker = new PIXI.Ticker()

    return new Promise((resolve) => {
      let isBlocked = false
      this.swapTicker.add(() => {
        if (!isBlocked && this.container.y > (this.j - 0.2) * CANDY_WIDTH) {
          this.container.y -= SWAP_SPEED

          if (this.container.y <= (this.j - 0.2) * CANDY_WIDTH) {
            isBlocked = true
          }
        } else if (isBlocked && this.container.y > this.j * CANDY_WIDTH) {
          this.container.y += SWAP_SPEED
        } else {
          this.container.y = this.j * CANDY_WIDTH
          this.swapTicker.stop()

          resolve()
        }
      })
      this.swapTicker.start()
    })
  }

  vanish() {
    const pointText = new PIXI.Text(this.candyPoint, {
      fontSize: CANDY_WIDTH / 4,
      fill: 0xffffff,
      fontWeight: 'bold',
    })
    pointText.alpha = 0
    pointText.x = (CANDY_WIDTH - pointText.width) / 2
    pointText.y = (CANDY_WIDTH - pointText.height) / 2
    this.container.addChild(pointText)

    const opacityValue = this.typeIndex === DEAD_CANDY_INDEX ? 0.5 : 0

    this.vanishTicker = new PIXI.Ticker()
    let scale = 1

    const smokeTexture = new PIXI.Texture(Globals.resources['smoke'].texture)
    const smokeSprite = new PIXI.Sprite(smokeTexture)
    smokeSprite.width = this.candyIconContainer.width * 0.8
    smokeSprite.height = this.candyIconContainer.height * 0.8
    smokeSprite.anchor.set(0.5, 0.5)
    smokeSprite.x = this.candyIconContainer.width / 2
    smokeSprite.y = this.candyIconContainer.height / 2
    smokeSprite.alpha = 0
    this.candyIconContainer.addChild(smokeSprite)

    return new Promise((resolve) => {
      this.vanishTicker.add(() => {
        if (this.candyIconContainer.alpha > opacityValue) {
          if (smokeSprite.alpha < 1) {
            smokeSprite.alpha += 0.1
            smokeSprite.width += 1
            smokeSprite.height += 1
            smokeSprite.angle += 4
          }
          this.candyIconContainer.alpha -= 0.04
          pointText.alpha += 0.06
          scale += 0.02
          // this.candyIconContainer.scale.set(scale)
          pointText.scale.set(scale)
        } else if (pointText.alpha > 0) {
          pointText.alpha -= 0.1
          smokeSprite.alpha -= 0.1
        } else if (smokeSprite.alpha > 0) {
          smokeSprite.alpha -= 0.1
        } else {
          this.vanishTicker.stop()
          this.blinkTicker?.stop?.()
          resolve()
        }
      })

      this.vanishTicker.start()
    })
  }

  blinkInvalidFactoryCandy() {
    if (this.typeIndex !== INVALID_FACTORY_CANDY_INDEX) return

    this.blinkTicker = new PIXI.Ticker()

    let status = 'dark'
    this.blinkTicker.add(() => {
      if (status === 'dark') {
        this.candyIconContainer.alpha -= 0.02

        if (this.candyIconContainer.alpha < 0.5) {
          status = 'light'
        }
      } else {
        this.candyIconContainer.alpha += 0.02

        if (this.candyIconContainer.alpha > 1) {
          status = 'dark'
        }
      }
    })

    this.blinkTicker.start()
  }
}

function getCandyPoint(candyIndex) {
  switch (candyIndex) {
    case 0:
      return 100
    case 1:
      return 75
    case 2:
      return 50
    case 3:
      return 200
    case 4:
    case 5:
      return 200
  }
}
