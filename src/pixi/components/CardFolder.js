import * as PIXI from 'pixi.js'
import { CardTab } from './CardTab'
import { Globals } from '../script/Globals'
import { Status } from '../script/Status'

const cardDimention = Globals.getCardDimention()
const TAB_HEIGHT = 34

export class CardFolder {
  constructor(
    cityIndex,
    cityData,
    folderHeight,
    isInfoCard = false,
    chooseGameHandler
  ) {
    this.container = new PIXI.Container()
    this.container.name = 'cardFolder'
    this.cityIndex = cityIndex
    this.cityData = cityData
    this.folderHeight = folderHeight
    this.isInfoCard = isInfoCard
    this.chooseGameHandler = chooseGameHandler

    this.tabArray = []

    this.createCardTabs()
  }

  createCardTabs() {
    for (let i = this.cityData.tabs.length - 1; i >= 0; i--) {
      const tab = new CardTab(
        i,
        this.cityData.tabs[i],
        this.folderHeight,
        this,
        this.isInfoCard,
        this.chooseGameHandler
      )
      this.tabArray.push(tab)
      this.container.addChild(tab.container)

      if (i === 0) {
        tab.scrollTicker?.start?.()
      }
    }

    if (!this.isInfoCard && Status.isNeedTutorial === false) {
      this.activeListener()
    }
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

  updateCity(newCityData) {
    // remove prev tabs ticker
    this.tabArray.forEach((tab) => {
      tab.scrollTicker?.stop?.()
    })

    this.cityIndex = newCityData.cityIndex
    this.cityData = newCityData
    this.tabArray = []
    this.container.removeChildren()
    this.createCardTabs()
  }

  stopAllProcess() {
    this.tabArray.forEach((tab) => {
      // stop scroll ticker
      tab.scrollTicker?.stop?.()

      // stop tab click listener
      tab.stopAllProcess()
    })
  }

  activeListener() {
    console.log('activeListener')
    this.tabArray.forEach((tab) => {
      tab.activeListener()
    })
  }
  deactiveListener() {
    this.tabArray.forEach((tab) => {
      tab.deactiveListener()
    })
  }
}
