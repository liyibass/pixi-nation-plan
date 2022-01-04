import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const TAB_HEIGHT = 34
const TAB_WIDTH = 80

const cardDimention = Globals.getCardDimention()

// const CARD_MARGIN = 12
// const CARD_HEADER_HEIGHT = Math.floor(cardDimention.height * 0.32)
// const CARD_FOLDER_HEIGHT = Math.floor(cardDimention.height * 0.68)

export class CardTab {
  constructor(tabIndex, folderHeight) {
    this.container = new PIXI.Container()
    this.container.name = 'cardTab'
    this.tabIndex = tabIndex
    this.folderHeight = folderHeight

    this.createCardTab()
  }

  createCardTab() {
    // folder container init setting

    // this.container.x = CARD_MARGIN
    this.createPage()
    this.createTab()
  }

  createTab() {
    this.tabContainer = new PIXI.Container()

    const sideShadow = new PIXI.Graphics()
    sideShadow.beginFill(0x000000, 0.2)
    // +10 is for hiding bottom rounded rect curve
    sideShadow.drawRoundedRect(0, 0, TAB_WIDTH + 10, TAB_HEIGHT + 10, 10)
    sideShadow.endFill()
    sideShadow.filters = [new PIXI.filters.BlurFilter(5)]

    const tabShadow = new PIXI.Graphics()
    tabShadow.beginFill(0xa75d31)
    // +10 is for hiding bottom rounded rect curve
    tabShadow.drawRoundedRect(0, 0, TAB_WIDTH + 2, TAB_HEIGHT + 10, 10)
    tabShadow.endFill()

    this.tab = new PIXI.Graphics()
    this.tab.beginFill(getTabColor(this.tabIndex))
    this.tab.drawRoundedRect(0, 0, TAB_WIDTH, TAB_HEIGHT + 10, 10)
    this.tab.endFill()

    const poundSign = new PIXI.Text(`#`, {
      fill: ['0xffffff'],
      fontSize: 20,
    })
    this.tabWording = new PIXI.Text(`基本資料`, {
      fill: ['0xffffff'],
      fontSize: 14,
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: 28,
    })
    poundSign.x = 15
    poundSign.y = (TAB_HEIGHT - poundSign.height) / 2
    this.tabWording.x = 32
    this.tab.addChild(poundSign, this.tabWording)

    // mask
    const mask = new PIXI.Graphics()
    mask.beginFill(0x000000, 0.1)
    // +10 is for hiding bottom rounded rect curve
    mask.drawRect(0, 0, cardDimention.width, TAB_HEIGHT)
    mask.endFill()
    this.tabContainer.mask = mask
    mask.x = -5

    // put all component together
    this.tabContainer.addChild(mask, sideShadow, tabShadow, this.tab)
    this.container.addChild(this.tabContainer)

    // tab position
    this.tab.y = 1
    sideShadow.y = 1
    sideShadow.x = -6
    sideShadow.x = this.tabIndex * (TAB_WIDTH - 20)
    this.tab.x = this.tabIndex * (TAB_WIDTH - 20)
    tabShadow.x = this.tabIndex * (TAB_WIDTH - 20)

    this.tab.buttonMode = true
    this.tab.interactive = true

    this.tab.addListener('pointerdown', () => {
      console.log('tab choosed')
      const folder = this.container.parent

      folder.setChildIndex(this.container, folder.children.length - 1)
    })
  }

  createPage() {
    const page = new PIXI.Graphics()

    page.beginFill(getTabColor(this.tabIndex))
    page.drawRoundedRect(0, 0, cardDimention.width, this.folderHeight, 10)
    page.endFill()

    page.y = TAB_HEIGHT

    const shadow = new PIXI.Graphics()
    shadow.beginFill(0x000000, 0.1)
    shadow.drawRoundedRect(
      0,
      0,
      cardDimention.width + 10,
      this.folderHeight - TAB_HEIGHT + 2,
      20
    )
    shadow.endFill()
    shadow.filters = [new PIXI.filters.BlurFilter(7)]
    shadow.y = TAB_HEIGHT - 6

    this.container.addChild(shadow, page)
  }

  createFolderShadow() {}
}

function getTabColor(tabIndex) {
  if (tabIndex === 0) {
    return 0xcc8053
  } else {
    return 0xa75d31
  }
}
