export const Globals = {
  resources: {},
  width: window.innerWidth,
  height: window.innerHeight,
  groundPosition: function () {
    return {
      x: this.width / 2,
      y: (this.height * 3) / 4,
    }
  },
}
