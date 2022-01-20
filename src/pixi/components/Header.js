import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { clickUrl } from '../script/Utils'
const READR_WIDTH = 31
const DONATE_WIDTH = 22
const PADDING = 10

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

    this.readrSprite = new PIXI.Sprite(readrTexture)
    this.readrSprite.width = READR_WIDTH
    this.readrSprite.height = READR_WIDTH

    this.donateSprite = new PIXI.Sprite(donateTexture)
    this.donateSprite.width = DONATE_WIDTH
    this.donateSprite.height = DONATE_WIDTH

    this.readrSprite.x = PADDING
    this.donateSprite.x = Globals.outerWidth - this.donateSprite.width - PADDING
    this.readrSprite.y = PADDING
    this.donateSprite.y = PADDING

    this.container.addChild(this.readrSprite, this.donateSprite)
  }

  activeListener() {
    this.readrSprite.buttonMode = true
    this.readrSprite.interactive = true
    this.donateSprite.buttonMode = true
    this.donateSprite.interactive = true

    this.readrSprite.addListener('pointerdown', () => {
      clickUrl('readr')
    })
    this.donateSprite.addListener('pointerdown', () => {
      clickUrl('donate')
    })
  }

  deactiveListener() {
    this.readrSprite.buttonMode = false
    this.readrSprite.interactive = false
    this.donateSprite.buttonMode = false
    this.donateSprite.interactive = false

    this.readrSprite.removeAllListeners()
    this.donateSprite.removeAllListeners()
  }

  destoryHeader() {
    this.deactiveListener()
  }
}
