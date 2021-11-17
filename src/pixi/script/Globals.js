const gameStagePadding = 10

export const Globals = {
  resources: {},
  width: window.innerWidth,
  height: window.innerHeight,
  isSmallScreen: function () {
    return !!this.width < 1280
  },
  getGroundDimention: function () {
    return {
      x: this.width / 2,
      y:
        window.innerWidth < 1280
          ? (this.height * 5) / 6
          : (this.height * 3) / 4,
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
      y: groundGroupDimention.y,
    }
  },
  getGameStageDimention: function () {
    const BLOCK_WIDTH = 16

    let shortLength

    if (this.width > this.height / 2) {
      shortLength = parseInt(this.height / 2 / BLOCK_WIDTH) * BLOCK_WIDTH

      return {
        x: (this.width - shortLength) / 2,
        y: this.height / 2 - shortLength + gameStagePadding,
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
      y: this.height / 2 + 40,
    }
  },
}
