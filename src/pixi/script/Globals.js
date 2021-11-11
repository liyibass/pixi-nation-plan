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
  getDoctorDimention: function (getGroundDimention) {
    return {
      x: getGroundDimention.x - 100,
      y: getGroundDimention.y - 33,
    }
  },
  getPlayerDimention: function (getGroundDimention) {
    return {
      x: getGroundDimention.x - 60,
      y: getGroundDimention.y,
    }
  },
  getGameStageDimention: function () {
    let shortLength

    if (this.width - 40 > this.height / 2 - 20) {
      shortLength = this.height / 2 - 20

      return {
        x: (this.width - shortLength) / 2,
        y: this.height / 2 - shortLength,
        width: shortLength,
        height: shortLength,
      }
    } else {
      shortLength = this.width - 40

      return {
        x: (this.width - shortLength) / 2,
        y: this.height / 2 - shortLength,
        width: shortLength,
        height: shortLength,
      }
    }
  },
}
