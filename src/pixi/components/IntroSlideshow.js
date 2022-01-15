import * as PIXI from 'pixi.js'

import { Globals } from '../script/Globals'
const introSlideshowDimention = Globals.getIntroSlideshowDimention()

export class IntroSlideshow {
  constructor(resolve) {
    this.container = new PIXI.Container()
    this.container.name = 'IntroSlideshow'
    this.resolve = resolve

    this.currentFrame = 0
    this.createIntroSlideshow()
  }

  async createIntroSlideshow() {
    this._createBackground()

    this._createTextGroup()

    this.imageContainer = new PIXI.Container()
    this.imageContainer.name = 'imageContainer'
    this.container.addChild(this.imageContainer)
    this._createImage()
    this.updateSlideshow()

    this.activateListeners()
  }

  _createBackground() {
    this.backgroundContainer = new PIXI.Container()
    this.background = new PIXI.Graphics()
    this.background.beginFill(0x5f5f5f, 0.5)
    this.background.drawRect(0, 0, Globals.width, Globals.height)
    this.background.endFill()

    this.blackBackground = new PIXI.Graphics()
    this.blackBackground.beginFill(0x000000)
    this.blackBackground.drawRect(0, 0, Globals.width, Globals.height)
    this.blackBackground.endFill()
    this.blackBackground.alpha = 0

    this.backgroundContainer.addChild(this.background, this.blackBackground)

    this.container.addChild(this.backgroundContainer)
  }

  _changeBackgroundColor() {
    return new Promise((resolve) => {
      this.lightOutTicker = new PIXI.Ticker()

      this.lightOutTicker.add(() => {
        if (this.blackBackground.alpha < 1) {
          this.blackBackground.alpha += 0.02
        } else {
          this.lightOutTicker.stop()
          resolve()
        }
      })

      this.lightOutTicker.start()
    })
  }

  _addAllYellow() {
    this.yellow = new PIXI.Graphics()
    this.yellow.beginFill(0xf2de5b)
    this.yellow.drawRect(0, 0, Globals.width, Globals.height)
    this.yellow.endFill()
    this.yellow.alpha = 0

    this.container.addChild(this.yellow)

    return new Promise((resolve) => {
      this.lightOutTicker = new PIXI.Ticker()

      this.lightOutTicker.add(() => {
        if (this.yellow.alpha < 1) {
          this.yellow.alpha += 0.02
        } else {
          this.lightOutTicker.stop()
          resolve()
        }
      })

      this.lightOutTicker.start()
    })
  }

  // TextGroup
  _createTextGroup() {
    // init textGroup setting
    this.textGroup = new PIXI.Container()
    this.textGroup.name = 'textGroup'
    this.container.addChild(this.textGroup)

    this._createArrows()
    this._createText()
    this._createSkipButton()

    this.prevArrow.container.x = 0
    this.nextArrow.container.x = introSlideshowDimention.width
    this.prevArrow.container.y = this.wordingText.height / 2
    this.nextArrow.container.y = this.wordingText.height / 2

    this.wordingText.x =
      (introSlideshowDimention.width - this.wordingText.width) / 2

    this.skipButton.y = this.wordingText.height + 30
    this.skipButton.x =
      (introSlideshowDimention.width - this.skipButton.width) / 2

    // setup textGroup dimention
    this.textGroup.x = introSlideshowDimention.x
    this.textGroup.y =
      window.innerHeight / 2 + introSlideshowDimention.height / 3
  }

  _createArrows() {
    // create arrow
    this.prevArrow = new Arrow(0)
    this.nextArrow = new Arrow(1)

    this.textGroup.addChild(this.prevArrow.container, this.nextArrow.container)
  }

  _createText() {
    // create text
    const padding = 47
    const textWidth =
      introSlideshowDimention.width -
      this.prevArrow.arrowSprite.width -
      this.nextArrow.arrowSprite.width -
      padding * 2

    this.wordingText = new PIXI.Text(this._getCurrentText(), {
      fontSize: 14,
      fill: ['0xffffff'],
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: textWidth,
    })

    this.textGroup.addChild(this.wordingText)
  }

  _createSkipButton() {
    // skipButton
    this.skipButton = new PIXI.Graphics()
    this.skipButton.beginFill(0xc4c4c4)
    this.skipButton.drawRect(0, 0, 57, 20)
    this.skipButton.endFill()
    this.skipButton.buttonMode = true
    this.skipButton.interactive = true

    const skipWording = new PIXI.Text('跳過故事', {
      fill: ['0x5f5f5f'],
      fontSize: 12,
    })
    skipWording.x = (this.skipButton.width - skipWording.width) / 2
    skipWording.y = (this.skipButton.height - skipWording.height) / 2
    this.skipButton.addChild(skipWording)

    this.textGroup.addChild(this.skipButton)
  }

  activateListeners() {
    // position text group

    // this.content.x = (this.container.width - this.content.width) / 2

    this.prevArrow.container.addListener('pointerdown', () => {
      if (this.isFadeIn || this.currentFrame === 0) return

      this.currentFrame--
      this.updateSlideshow()
    })
    this.nextArrow.container.addListener('pointerdown', () => {
      if (this.isFadeIn || this.currentFrame === 6) return

      this.currentFrame++
      this.updateSlideshow()
    })
    this.skipButton.addListener('pointerdown', () => {
      this.exitSlideshow()
    })
  }

  deactivateListeners() {
    this.prevArrow.container.removeAllListeners()
    this.nextArrow.container.removeAllListeners()
    this.skipButton.removeAllListeners()
  }

  // image
  _createImage() {
    const texture = new PIXI.Texture(
      Globals.resources[`intro_${this.currentFrame}`]?.texture
    )
    const sprite = new PIXI.Sprite(texture)
    const ratio = sprite.height / sprite.width
    sprite.width = introSlideshowDimention.width
    sprite.height = introSlideshowDimention.width * ratio
    // sprite.y -= 40

    // sprite.pivot.set(0, sprite.height / 2)
    sprite.alpha = 0
    this.imageContainer.addChild(sprite)

    this.imageContainer.x = introSlideshowDimention.x
    sprite.y = (Globals.height - sprite.height) / 2

    if (this.currentFrame < 4) {
      sprite.y -= 70
    }
  }

  // util
  async updateSlideshow() {
    // update text

    // if (this.currentFrame === 3) {
    //   this.container.removeChild(this.textGroup)
    //   this.deactivateListeners()

    //   this.playRestAnimation()
    // }

    // updateImage
    // this._createImage()
    // await this._startFadeInTicker()

    switch (this.currentFrame) {
      case 0:
      case 1:
      case 2:
      case 3:
        this.wordingText.alpha = 1
        this.wordingText.text = this._getCurrentText()
        this.wordingText.x =
          (introSlideshowDimention.width - this.wordingText.width) / 2

        this._createImage()
        await this._startFadeInTicker()
        break

      case 4:
        this.wordingText.alpha = 0
        this.prevArrow.container.destroy()
        this.nextArrow.container.destroy()

        this.playRestAnimation()
        this._createImage()
        await this._startFadeInTicker()
        break

      case 5:
        this._createImage()
        await this._startFadeInTicker()
        break
      case 6:
        this._createImage()
        this._changeBackgroundColor()
        await this._startFadeInTicker()
        break

      case 7:
        await this._addAllYellow()

        break

      default:
        setTimeout(() => {
          this.exitSlideshow()
        }, 1000)
        break
    }
  }

  _startFadeInTicker() {
    return new Promise((resolve) => {
      const prevImage = this.imageContainer.children[0]
      const nextImage = this.imageContainer.children[1]

      this.fadeInTicker = new PIXI.Ticker()

      this.fadeInTicker.add(() => {
        if (nextImage.alpha < 1) {
          this.isFadeIn = true
          prevImage.alpha -= 0.02
          nextImage.alpha += 0.02
        } else {
          this.fadeInTicker.stop()
          prevImage.alpha = 0
          nextImage.alpha = 1
          this.isFadeIn = false
          this.imageContainer.removeChild(prevImage)
          resolve()
        }
      })

      this.fadeInTicker.start()
    })
  }

  _getCurrentText() {
    switch (this.currentFrame) {
      case 0:
        return '哎，來不及了啦，政府都開怪手來了，哪裡擋得住？'
      case 1:
        return '（此時，手機的通知響起）'
      case 2:
        return '差點忘了！今天oooo有新企劃活動，趕快點進去拿限定版道具～'

      case 3:
        return '嗯？'
      default:
        break
    }
  }

  playRestAnimation() {
    this.interval = setInterval(() => {
      this.currentFrame++
      this.updateSlideshow()

      if (this.currentFrame === 8) {
        clearInterval(this.interval)
      }
    }, 1600)

    this.interval
  }

  exitSlideshow() {
    console.log('END')

    this.container.removeAllListeners()
    this.deactivateListeners()
    this.fadeInTicker?.stop()
    this.lightOutTicker?.stop()

    this.container.destroy()

    this.resolve()
  }
}

class Arrow {
  // arrow's position center is region's cneter
  constructor(index = 0) {
    this.container = new PIXI.Container()
    this.container.buttonMode = true
    this.container.interactive = true
    this.direction = index === 0 ? 'left' : 'right'

    this.createActiveRegion()
    this.createArrow()
  }

  createActiveRegion() {
    const activeRegion = new PIXI.Graphics()
    activeRegion.beginFill(0xff0000, 1)
    activeRegion.drawCircle(0, 0, 100)
    activeRegion.endFill()
    activeRegion.alpha = 0
    this.container.addChild(activeRegion)

    this.container.buttonMode = true
    this.container.interactiveChildren = true
  }

  createArrow() {
    const arrowTexture = new PIXI.Texture(Globals.resources['arrow']?.texture)
    this.arrowSprite = new PIXI.Sprite(arrowTexture)
    this.container.addChild(this.arrowSprite)
    this.arrowSprite.anchor.set(0.5, 0.5)

    if (this.direction === 'right') {
      this.arrowSprite.scale.x = -1
    }
  }
}