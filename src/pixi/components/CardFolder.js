import * as PIXI from 'pixi.js'
import { CardTab } from './CardTab'
import { Globals } from '../script/Globals'

const cardDimention = Globals.getCardDimention()
const TAB_HEIGHT = 34
// const CARD_MARGIN = 12
// const CARD_HEADER_HEIGHT = Math.floor(cardDimention.height * 0.32)
// const CARD_FOLDER_HEIGHT = Math.floor(cardDimention.height * 0.68)

export class CardFolder {
  constructor(folderHeight) {
    this.container = new PIXI.Container()
    this.container.name = 'cardFolder'
    this.folderHeight = folderHeight

    this.createCardFolder()
    // this.createFolderMask()
  }

  createCardFolder() {
    for (let i = 3; i >= 0; i--) {
      const tab = new CardTab(i, this.folderHeight)
      this.container.addChild(tab.container)
    }
    // folder container init setting
    // this.container.x = CARD_MARGIN
  }

  createFolderMask() {
    const mask = new PIXI.Graphics()
    mask.beginFill(0xbb6347)
    // +10 is for hiding bottom rounded rect curve
    mask.drawRoundedRect(
      0,
      0,
      cardDimention.width,
      this.folderHeight + TAB_HEIGHT,
      10
    )
    mask.endFill()

    this.container.mask = mask
    this.container.addChild(mask)
    mask.zIndex = 0
  }
}
