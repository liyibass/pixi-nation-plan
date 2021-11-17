import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { DialogBox } from './DialogBox'
import { DoctorDialogBox } from './DoctorDialogBox'

export class DoctorSay {
  constructor() {
    this.container = new PIXI.Container()
    this.init()

    this.doctorDimention = Globals.getDoctorDimention()
    // const doctorPosition =
    // console.log(doctorPosition)
  }
  init() {
    this.container.interactive = true
    this.container.buttonMode = true
  }

  say(text) {
    const dialogBox = new DialogBox({
      text,
      x: (Globals.width - 300) / 2,
      y: Globals.height / 2 - 30,
      talkerX: this.doctorDimention.x + 30,
      talkerY: this.doctorDimention.y,
      width: 300,
      height: 150,
      fontSize: 16,
    })
    this.container.addChild(dialogBox.container)

    return new Promise((resolve) => {
      this.container.addListener('pointerdown', () => {
        this.container.removeChildren()
        this.container.removeAllListeners()

        setTimeout(() => {
          resolve()
        }, 200)
      })
    })
  }

  chooseSay(text) {
    return new Promise((resolve) => {
      const chosenHandler = (chosen) => {
        resolve(chosen)
      }

      const dialogBox = new DoctorDialogBox({
        text,
        x: (Globals.width - 300) / 2,
        y: Globals.height / 2 - 30,
        talkerX: this.doctorDimention.x + 30,
        talkerY: this.doctorDimention.y,
        width: 300,
        height: 150,
        fontSize: 16,
        chosenHandler,
      })
      this.container.addChild(dialogBox.container)
    })
  }
}
