const gameStagePadding = 10

const ratio = 376 / 812
const height = window.innerHeight
const maxWidth = height * ratio
const width = window.innerWidth > maxWidth ? maxWidth : maxWidth
const OUTER_PADDING = 20

export const Globals = {
  resources: {},
  playerType: 'player',
  width: width,
  height: height,
  WIDTH: width,
  HEIGHT: height,

  maxContentWidth: width - 2 * OUTER_PADDING,
  contentHeight:
    window.innerHeight / 2 < 450
      ? window.innerHeight / 2 - 30
      : window.innerHeight / 2 < 500
      ? window.innerHeight / 2 - 100
      : 500,
  isSmallScreen: function () {
    return !!this.width < 1280
  },
  GROUND_HEIGHT: 101,

  getGroundDimention: function () {
    return {
      x: this.width / 2,
      y: this.height / 2 + gameStagePadding + (this.contentHeight / 6) * 5,
    }
  },
  getSkipButtonDimention: function () {
    return {
      x: this.width - 20,
      y: this.height - 20,
    }
  },
  getDoctorDimention: function () {
    const groundGroupDimention = this.getGroundDimention()
    return {
      x: groundGroupDimention.x - 100,
      y: groundGroupDimention.y - 33,
    }
  },
  getPlayerDimention: function () {
    const groundGroupDimention = this.getGroundDimention()
    return {
      x: groundGroupDimention.x - 60,
      y: groundGroupDimention.y + 35,
    }
  },
  getGameStageDimention: function () {
    const BLOCK_WIDTH = 16

    let shortLength

    if (this.width > this.height / 2) {
      shortLength =
        parseInt((this.height / 2 - 2 * gameStagePadding) / BLOCK_WIDTH - 2) *
        BLOCK_WIDTH

      return {
        x: (this.width - shortLength) / 2,
        y: this.height / 2 - (shortLength + gameStagePadding),
        width: shortLength,
        height: shortLength,
      }
    } else {
      shortLength =
        parseInt((this.width - gameStagePadding * 2) / BLOCK_WIDTH) *
        BLOCK_WIDTH

      return {
        x: (this.width - shortLength) / 2,
        y: (this.height / 2 - shortLength) / 2,
        width: shortLength,
        height: shortLength,
      }
    }
  },
  CONTROLLER_WIDTH: 75,
  getSnakeControllerPosition: function () {
    return {
      x: this.width / 2 - this.CONTROLLER_WIDTH / 2,
      y:
        this.height / 2 +
        gameStagePadding +
        this.contentHeight / 6 -
        this.CONTROLLER_WIDTH / 2,
    }
  },

  BUTTON_CONTAINER_WIDTH: 194,
  BUTTON_CONTAINER_HEIGHT: 32,

  BUTTON_WIDTH: 88,
  BUTTON_HEIGHT: 32,
  getSnakeMenuPosition: function (buttonCount) {
    const containerWidth =
      buttonCount === 2 ? this.BUTTON_CONTAINER_WIDTH : this.BUTTON_WIDTH
    return {
      x: this.width / 2 - containerWidth / 2,
      y:
        this.height / 2 +
        gameStagePadding +
        (this.contentHeight / 6) * 3 -
        this.BUTTON_CONTAINER_HEIGHT / 2 -
        10,
    }
  },
  getSeesawGameStageDimention: function () {
    let height = Math.floor((this.height * 5) / 8)
    let width =
      this.width - 2 * gameStagePadding > height
        ? height
        : this.width - 2 * gameStagePadding

    return {
      x: (this.width - width) / 2,
      y: 0 + gameStagePadding,
      width: width,
      height: height,
    }
  },
  getRunGameStageDimention: function () {
    let height = Math.floor((this.height * 5) / 8)
    let width =
      this.width - 2 * gameStagePadding < 600
        ? this.width - 2 * gameStagePadding
        : this.width - 2 * gameStagePadding < 1280
        ? 700
        : 900

    return {
      x: (this.width - width) / 2,
      y: 0 + gameStagePadding,
      width: width,
      height: height,
    }
  },
  getCandyGameStageDimention: function () {
    // const windowWidth =
    //   this.width - 2 * gameStagePadding < Math.floor((this.height * 5) / 8)
    //     ? this.width - 2 * gameStagePadding
    //     : Math.floor((this.height * 5) / 8)

    // const candyWidth = Math.floor((windowWidth - 2 * gameStagePadding) / 8)

    // const colCount = 8
    // const rowCount = Math.floor((this.height * 5) / 8 / candyWidth)
    // const width = candyWidth * colCount
    // const height = candyWidth * rowCount

    // return {
    //   x: (this.width - width) / 2,
    //   y: 0 + gameStagePadding * 2 + 28,
    //   // y: this.height / 5,
    //   width,
    //   height,
    //   colCount,
    //   rowCount,
    //   candyWidth,
    // }

    const windowWidth =
      this.width - 2 * gameStagePadding < Math.floor((this.height * 5) / 8)
        ? this.width - 2 * gameStagePadding
        : Math.floor((this.height * 5) / 8)

    const candyWidth = Math.floor((windowWidth - 2 * gameStagePadding) / 8)

    const colCount = 8
    const rowCount = 8
    const width = candyWidth * colCount
    const height = candyWidth * rowCount

    return {
      x: (this.width - width) / 2,
      y: 0 + gameStagePadding * 2 + 28,
      // y: this.height / 5,
      width,
      height,
      colCount,
      rowCount,
      candyWidth,
    }
  },

  getCardDimention: function () {
    const TOP_PADDING = window.innerWidth < 360 ? 10 : 48
    const SIDE_PADDING = window.innerWidth < 360 ? 10 : 25
    const width =
      this.width - 2 * SIDE_PADDING < Math.floor((this.height * 5) / 8)
        ? this.width - 2 * SIDE_PADDING
        : Math.floor((this.height * 5) / 8)

    const height = this.height - 2 * TOP_PADDING

    return {
      x: (this.width - width) / 2,
      y: 0 + TOP_PADDING,
      width,
      height,
    }
  },
  getTaiwanDimention: function () {
    let height = Math.floor((this.height * 3) / 5)
    let width =
      this.width - 2 * gameStagePadding > height
        ? height
        : this.width - 2 * gameStagePadding

    return {
      x: (this.width - width) / 2,
      y: 0 + gameStagePadding,
      width: width,
      height: height,
    }
  },
  getIntroSlideshowDimention: function () {
    const textPositionRatio = 546 / 812
    const slideshowFontRatio = 14 / 812
    return {
      x: (window.innerWidth - this.maxContentWidth) / 2,
      y: (window.innerHeight - this.height) / 2,
      width: this.maxContentWidth,
      height: this.height,

      textY: Math.floor(this.height * textPositionRatio),
      slideshowFontSize: Math.floor(height * slideshowFontRatio),
      imageWidth: this.maxContentWidth + OUTER_PADDING * 2,
    }
  },
  sayFontSize: window.innerWidth < 500 ? 14 : 20,
}
