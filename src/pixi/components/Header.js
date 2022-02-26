import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { clickUrl } from '../script/Utils'
const READR_WIDTH = 31
const DONATE_WIDTH = 22
const PADDING = 10
import { sound } from '@pixi/sound'

export class Header {
  constructor() {
    this.container = new PIXI.Container()

    this.container.name = 'header'
    this.createHeader()

    this.activeListener()
  }

  createHeader() {
    const readrTexture = new PIXI.Texture(Globals.resources['readr']?.texture)
    const donateTexture = new PIXI.Texture(Globals.resources['donate']?.texture)
    const volumeTexture = new PIXI.Texture(Globals.resources['volume']?.texture)

    this.readrSprite = new PIXI.Sprite(readrTexture)
    this.readrSprite.width = READR_WIDTH
    this.readrSprite.height = READR_WIDTH

    this.donateSprite = new PIXI.Sprite(donateTexture)
    this.donateSprite.width = DONATE_WIDTH
    this.donateSprite.height = DONATE_WIDTH

    this.volumeSprite = new PIXI.Sprite(volumeTexture)
    this.volumeSprite.width = DONATE_WIDTH
    this.volumeSprite.height = DONATE_WIDTH

    this.readrSprite.x = PADDING
    this.donateSprite.x = Globals.outerWidth - this.donateSprite.width - PADDING
    this.volumeSprite.x =
      Globals.outerWidth -
      this.donateSprite.width -
      PADDING -
      this.volumeSprite.width -
      PADDING
    this.readrSprite.y = PADDING
    this.donateSprite.y = PADDING
    this.volumeSprite.y = PADDING

    if (sound.volumeAll == 0) {
      this.volumeSprite.alpha = 0.6
    } else {
      this.volumeSprite.alpha = 1
    }

    this.container.addChild(
      // this.readrSprite,
      // this.donateSprite,
      this.volumeSprite
    )
  }

  activeListener() {
    this.readrSprite.buttonMode = true
    this.readrSprite.interactive = true
    this.donateSprite.buttonMode = true
    this.donateSprite.interactive = true
    this.volumeSprite.buttonMode = true
    this.volumeSprite.interactive = true

    this.readrSprite.addListener('pointerdown', () => {
      clickUrl('readr')
    })
    this.donateSprite.addListener('pointerdown', () => {
      clickUrl('donate')
    })
    this.volumeSprite.addListener('pointerdown', () => {
      if (sound.volumeAll == 0.7) {
        sound.volumeAll = 0
        this.volumeSprite.alpha = 0.6
      } else if (sound.volumeAll === 0) {
        sound.volumeAll = 0.7
        this.volumeSprite.alpha = 1
      }
    })
  }

  deactiveListener() {
    this.readrSprite.buttonMode = false
    this.readrSprite.interactive = false
    this.donateSprite.buttonMode = false
    this.donateSprite.interactive = false
    this.volumeSprite.buttonMode = false
    this.volumeSprite.interactive = false

    this.readrSprite.removeAllListeners()
    this.donateSprite.removeAllListeners()
    this.volumeSprite.removeAllListeners()
  }

  destoryHeader() {
    this.deactiveListener()
  }
}
