import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

const TAB_HEIGHT = 34
const TAB_WIDTH = 80
const CONTENT_PADDING = 12

const cardDimention = Globals.getCardDimention()

export class CardTab {
  constructor(tabIndex, tabData, folderHeight, cardFolder, isInfoCard = false) {
    this.container = new PIXI.Container()
    this.container.name = 'cardTab'
    this.tabIndex = tabIndex
    this.tabData = tabData
    this.container.tabIndex = this.tabIndex
    this.folderHeight = folderHeight
    this.cardFolder = cardFolder
    this.isInfoCard = isInfoCard

    this.isScrolling = false

    this.createCardTab()
    this.startScrollTicker()
  }

  createCardTab() {
    // folder container init setting

    // this.container.x = CARD_MARGIN
    this.createPage()
    this.createTab()
    this.insertTabData()
    this.lockHandler()
  }

  createPage() {
    this.page = new PIXI.Graphics()
    this.page.name = 'page'

    this.page.beginFill(getTabColor.bind(this)(this.tabIndex))
    this.page.drawRoundedRect(0, 0, cardDimention.width, this.folderHeight, 10)
    this.page.endFill()

    this.page.y = TAB_HEIGHT

    // page shadow
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

    this.container.addChild(shadow, this.page)

    // scrollable this.content part
    this.scrollPart = new PIXI.Container()
    this.scrollPart.name = 'scrollPart'

    this.scrollPart.buttonMode = true
    this.scrollPart.interactive = true

    // assing position and record its inner width/height
    this.scrollPart.x = CONTENT_PADDING
    this.scrollPart.y = CONTENT_PADDING
    this.scrollPartWidth = cardDimention.width - CONTENT_PADDING * 2
    this.scrollPartHeight = this.folderHeight - CONTENT_PADDING * 2

    // mask for scroll function
    const mask = new PIXI.Graphics()
    mask.name = 'mask'
    mask.beginFill(0x000000)
    mask.drawRect(0, 0, this.scrollPartWidth, this.scrollPartHeight)
    mask.endFill()

    this.scrollPart.mask = mask
    this.scrollPart.addChild(mask)

    this.page.addChild(this.scrollPart)
  }

  createTab() {
    if (this.isInfoCard) return

    this.tabContainer = new PIXI.Container()

    const sideShadow = new PIXI.Graphics()
    sideShadow.beginFill(0x000000, 0.2)
    // +10 is for hiding bottom rounded rect curve
    sideShadow.drawRoundedRect(0, 0, TAB_WIDTH + 12, TAB_HEIGHT + 10, 10)
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
    this.tabWording = new PIXI.Text(`${this.tabData.tabTitle}`, {
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
    // sideShadow.x = -6
    sideShadow.x = this.tabIndex * (TAB_WIDTH - 20) - 6
    this.tab.x = this.tabIndex * (TAB_WIDTH - 20)
    tabShadow.x = this.tabIndex * (TAB_WIDTH - 20)

    this.tab.buttonMode = true
    this.tab.interactive = true

    this.tab.addListener('pointerdown', () => {
      this.updateTabOrder()
    })
  }

  insertTabData() {
    this.content = new PIXI.Container()
    this.content.name = 'content'

    this.scrollPart.addChild(this.content)

    let contentHeight = 0
    const style = new PIXI.TextStyle({
      fill: ['0xffffff'],
      fontSize: 18,
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: cardDimention.width - CONTENT_PADDING * 2,
    })

    // feed paragraph
    for (let i = 0; i < this.tabData.tabContent.length; i++) {
      const paragraph = this.tabData.tabContent[i]

      const paragraphText = new PIXI.Text(paragraph, style)
      paragraphText.y = contentHeight
      contentHeight += paragraphText.height + CONTENT_PADDING

      this.content.addChild(paragraphText)

      // if paragraph is not last one, add white division line
      if (i < this.tabData.tabContent.length - 1) {
        const line = new PIXI.Graphics()
        line.beginFill(0xffffff)
        line.drawRect(0, 0, this.scrollPartWidth, 2)
        line.endFill()

        line.y = contentHeight
        this.content.addChild(line)

        contentHeight += line.height + CONTENT_PADDING
      }
    }

    // handle scroll function

    this.scrollPart.addListener('pointerdown', (e) => {
      this.isScrolling = true
      this.initPositionY = e.data.global.y
      this.content.vy = 0
    })
    this.scrollPart.addListener('pointerup', () => {
      this.isScrolling = false
      this.initPositionY = null
      this.content.vy = 0
    })
    this.scrollPart.addListener('pointermove', (e) => {
      if (this.isScrolling) {
        const currentPositionY = e.data.global.y

        const scrollSpeed = Math.floor(
          Math.abs(currentPositionY - this.initPositionY) / 25
        )

        // console.log(currentPosition)
        // console.log(this.initPositionY)
        if (currentPositionY > this.initPositionY) {
          this.scrollDirection = 'up'
          this.content.vy = scrollSpeed
        } else {
          this.scrollDirection = 'down'
          this.content.vy = -scrollSpeed
        }
      }
    })
  }

  startScrollTicker() {
    // if content is shorter than page, then no need to prepare scrollTicker
    const maxScrollDistance = this.content.height - this.scrollPartHeight
    if (maxScrollDistance < 0) return

    this.scrollTicker = new PIXI.Ticker()
    this.scrollTicker.add(() => {
      if (!this.isScrolling) return

      if (this.content.y > 0) {
        this.content.y = 0
        this.isScrolling = false
        this.initPositionY = null
        this.content.vy = 0
      } else if (this.content.y < -maxScrollDistance) {
        this.content.y = -maxScrollDistance
        this.isScrolling = false
        this.initPositionY = null
        this.content.vy = 0
      }

      this.content.y += this.content.vy
    })
  }

  lockHandler() {
    if (this.tabData.isLocked) {
      // lock graphics
      this.content.filters = [new PIXI.filters.BlurFilter(5)]
    }
  }

  updateTabOrder() {
    // set selected tab to top
    this.cardFolder.container.setChildIndex(
      this.container,
      this.cardFolder.tabArray.length - 1
    )

    // set rest tabs in order
    const exclusiveTabs = []
    this.cardFolder.tabArray.forEach((tab) => {
      if (tab.tabIndex !== this.tabIndex) {
        exclusiveTabs.push(tab)
      }
    })

    this.cardFolder.tabArray.forEach((tab, index) => {
      this.cardFolder.container.setChildIndex(this.container, index)
      tab.scrollTicker?.stop?.()
    })

    this.scrollTicker?.start?.()
    this.content.y = 0
  }

  stopAllProcess() {
    if (this.isInfoCard) return

    this.tab.removeAllListeners()
  }
}

function getTabColor(tabIndex) {
  if (this?.isInfoCard) return 0x000000

  if (tabIndex === 0) {
    return 0xcc8053
  } else {
    return 0xa75d31
  }
}
