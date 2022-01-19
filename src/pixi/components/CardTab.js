import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Status, CityStatusArray } from '../script/Status'
import { Tip } from './Tip'
import { UnlockButton } from './UnlockButton'

import MultiStyleText from 'pixi-multistyle-text'

const TAB_HEIGHT = 34
const TAB_WIDTH = 80
const CONTENT_PADDING = 12

const cardDimention = Globals.getCardDimention()

export class CardTab {
  constructor(
    tabIndex,
    tabData,
    folderHeight,
    cardFolder,
    isInfoCard = false,
    chooseGameHandler,
    cityIndex
  ) {
    this.container = new PIXI.Container()
    this.container.name = 'cardTab'
    this.tabIndex = tabIndex
    this.cityIndex = cityIndex
    this.tabData = tabData
    this.tabStatus = CityStatusArray[this.cityIndex].tabs[this.tabIndex]

    this.container.tabIndex = this.tabIndex
    this.folderHeight = folderHeight
    this.contentHeight = this.folderHeight - TAB_HEIGHT
    this.cardFolder = cardFolder
    this.isInfoCard = isInfoCard
    this.chooseGameHandler = chooseGameHandler

    this.isScrolling = false

    this.createCardTab()
    this.startScrollTicker()
    // this.activeListener()
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
    this.page.drawRoundedRect(0, 0, cardDimention.width, this.contentHeight, 10)
    this.page.endFill()

    this.page.y = TAB_HEIGHT

    // page shadow
    const shadow = new PIXI.Graphics()
    shadow.beginFill(0x000000, 0.1)
    shadow.drawRoundedRect(
      0,
      0,
      cardDimention.width + 10,
      this.contentHeight + 2,
      20
    )
    shadow.endFill()
    shadow.filters = [new PIXI.filters.BlurFilter(7)]
    shadow.y = TAB_HEIGHT - 6

    this.container.addChild(shadow, this.page)

    // scrollable this.content part
    this.scrollPart = new PIXI.Container()
    this.scrollPart.name = 'scrollPart'

    // assing position and record its inner width/height
    this.scrollPart.x = CONTENT_PADDING
    this.scrollPart.y = CONTENT_PADDING
    this.scrollPartWidth = cardDimention.width - CONTENT_PADDING * 2
    this.scrollPartHeight = this.contentHeight - CONTENT_PADDING * 2

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
    // if (this.isInfoCard) return

    this.tabContainer = new PIXI.Container()
    this.tabContainer.name = 'tabContainer'

    const sideShadow = new PIXI.Graphics()
    sideShadow.beginFill(0x000000, 0.2)
    // +10 is for hiding bottom rounded rect curve
    sideShadow.drawRoundedRect(0, 0, TAB_WIDTH + 12, TAB_HEIGHT + 10, 10)
    sideShadow.endFill()
    sideShadow.filters = [new PIXI.filters.BlurFilter(5)]

    const tabShadow = new PIXI.Graphics()
    tabShadow.beginFill(this.isInfoCard ? 0x999999 : 0xa75d31)
    // +10 is for hiding bottom rounded rect curve
    tabShadow.drawRoundedRect(0, 0, TAB_WIDTH + 2, TAB_HEIGHT + 10, 10)
    tabShadow.endFill()

    this.tab = new PIXI.Graphics()
    this.tab.beginFill(getTabColor.bind(this)(this.tabIndex))
    this.tab.drawRoundedRect(0, 0, TAB_WIDTH, TAB_HEIGHT + 10, 10)
    this.tab.endFill()

    const poundSign = new PIXI.Text(`#`, {
      fill: ['0xffffff'],
      fontSize: 20,
    })
    this.tabWording = new PIXI.Text(`${this.tabData.tabTag}`, {
      fill: ['0xffffff'],
      fontSize: 14,
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: 28,
    })
    poundSign.x = 15
    poundSign.y = (TAB_HEIGHT - poundSign.height) / 2
    this.tabWording.x = 32
    this.tabWording.y = (TAB_HEIGHT - this.tabWording.height) / 2

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
  }

  insertTabData() {
    this.content = new PIXI.Container()
    this.content.name = 'content'

    this.scrollPart.addChild(this.content)

    let contentHeight = 0

    // feed paragraph
    for (let i = 0; i < this.tabData.tabContent.length; i++) {
      const paragraph = this.tabData.tabContent[i]
      const nextParagraph = this.tabData?.tabContent?.[i + 1]

      const paragraphText = new MultiStyleText(getStyledContent(paragraph), {
        default: {
          fill: ['0xffffff'],
          fontSize: 14,
          fontWeight: 'normal',
          wordWrap: true,
          breakWords: true,
          wordWrapWidth: cardDimention.width - CONTENT_PADDING * 2,
        },
        bold: {
          fill: ['0xffffff'],
          fontSize: 14,
          fontWeight: 900,
        },
        title: {
          fill: ['0xffffff'],
          fontSize: 20,
          fontWeight: 900,
        },
        hint: {
          fill: ['0x813F2B'],
          fontSize: 14,
          fontWeight: 900,
        },
      })
      paragraphText.y = contentHeight
      contentHeight += paragraphText.height + CONTENT_PADDING

      this.content.addChild(paragraphText)

      // if paragraph is not last one, add white division line
      if (
        i < this.tabData.tabContent.length - 1 &&
        paragraph.type !== 'title'
      ) {
        const line = new PIXI.Graphics()
        line.beginFill(paragraph.type === 'hint' ? 0x813f2b : 0xffffff)
        line.drawRect(0, 0, this.scrollPartWidth, 1)
        line.endFill()

        line.y = contentHeight
        this.content.addChild(line)

        if (nextParagraph?.type === 'title' && paragraph.type !== 'hint') {
          line.alpha = 0
          contentHeight += CONTENT_PADDING
        }

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

    this.createScrollHint()
  }

  createScrollHint() {
    if (Status.isNeedScrollHint) {
      Status.isNeedScrollHint = false

      const tip = new Tip()
      tip.createScrollHint()
      console.log(tip.scrollHintContainer)
      this.page.addChild(tip.scrollHintContainer)
    }
  }

  startScrollTicker() {
    if (this.tabStatus.isLocked) return

    this.scrollPart.buttonMode = true
    this.scrollPart.interactive = true

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
    if (this.tabStatus.isLocked) {
      // lock graphics
      this.content.filters = [new PIXI.filters.BlurFilter(5)]

      this.createUnlockButton()
    }
  }

  createUnlockButton() {
    this.unlockButton = new UnlockButton(this.unlockGame.bind(this))

    this.unlockButton.container.x =
      (this.page.width - this.unlockButton.container.width) / 2
    this.unlockButton.container.y =
      (this.page.height - this.unlockButton.container.height) / 2
    this.page.addChild(this.unlockButton.container)
  }

  unlockGame() {
    const game = this.tabData.unlockGame

    this.chooseGameHandler(game)
  }

  activateScrollTicker() {
    this.scrollTicker?.start?.()
    this.scrollPart.buttonMode = true
    this.scrollPart.interactive = true
  }

  stopScrollTicker() {
    this.scrollTicker?.stop?.()
    this.scrollPart.buttonMode = false
    this.scrollPart.interactive = false
  }

  updateTabOrder(callback) {
    // set rest tabs in order
    const exclusiveTabs = []
    this.cardFolder.tabArray.forEach((cardTab) => {
      if (cardTab.tabIndex !== this.tabIndex) {
        exclusiveTabs.push(cardTab)
      }
    })

    exclusiveTabs.forEach((cardTab, index) => {
      this.cardFolder.container.setChildIndex(cardTab.container, index)
      cardTab.stopScrollTicker()
    })

    // set selected cardTab to top
    this.cardFolder.container.setChildIndex(
      this.container,
      this.cardFolder.tabArray.length - 1
    )

    this.activateScrollTicker()
    this.content.y = 0

    if (callback) {
      callback()
    }
  }

  stopAllProcess() {
    if (this.isInfoCard) return
    // console.log('tab stopAllProcess')
    this.tab.removeAllListeners()
  }

  activeListener() {
    // console.log('tab activeListener')
    this.tab.buttonMode = true
    this.tab.interactive = true

    this.tab.addListener('pointerdown', () => {
      this.updateTabOrder()
      this.unlockButton?.activeListener?.()
    })
  }

  activeTabListener() {
    // console.log('tab activeListener')
    this.tab.buttonMode = true
    this.tab.interactive = true

    this.tab.addListener('pointerdown', () => {
      this.updateTabOrder()
      // this.unlockButton.activeListener()
    })
  }

  deactiveListener() {
    this.tab.buttonMode = false
    this.tab.interactive = false
    this.tab.removeAllListeners()
  }
}

function getTabColor(tabIndex) {
  if (this?.isInfoCard) return 0x000000

  if (tabIndex === 0 || !this.tabStatus.isLocked) {
    return 0xcc8053
  } else {
    return 0xa75d31
  }
}

function getStyledContent(paragraph) {
  switch (paragraph.type) {
    case 'title':
      return `<title>${paragraph.content}</title>`
    case 'hint':
      return `<hint>${paragraph.content}</hint>`

    default:
      return paragraph.content
  }
}
