import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { DialogBox } from './DialogBox'
import { DoctorDialogBox } from './DoctorDialogBox'
import { DoctorShareBox } from './DoctorShareBox'
import { SpeakDialog } from './SpeakDialog'

export class DoctorSay {
  constructor() {
    this.container = new PIXI.Container()
    this.container.name = 'doctorSay'
    this.init()

    this.doctorDimention = Globals.getDoctorDimention()
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

  chooseSay(text, button1, button2) {
    return new Promise((resolve) => {
      const chosenHandler = (chosen) => {
        this.container.removeChildren()
        this.container.removeAllListeners()
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
        button1,
        button2,
      })

      this.container.addChild(dialogBox.container)
    })
  }
  share(text) {
    return new Promise((resolve) => {
      const shareHandler = (chosen) => {
        console.log(chosen)
        this.container.removeChildren()
        this.container.removeAllListeners()

        if (chosen === 'cancel') {
          resolve(false)
        } else {
          resolve(true)
        }
      }

      const width = 327
      const height = 170

      const dialogBox = new DoctorShareBox({
        text,
        x: (Globals.width - width) / 2,
        y: this.doctorDimention.y - height - 70,
        talkerX: this.doctorDimention.x + 30,
        talkerY: this.doctorDimention.y,
        width: width,
        height: height,
        fontSize: 16,
        chosenHandler: shareHandler,
      })

      this.container.addChild(dialogBox.container)
    })
  }

  hint(text, timeout = 3000) {
    const talkerX = this.doctorDimention.x + 30
    const talkerY = this.doctorDimention.y
    const fontSize = 14
    const textMaxWidth =
      window.innerWidth - 32 > 300 ? 300 : window.innerWidth - 32

    const textWidth =
      text.length * fontSize > textMaxWidth
        ? textMaxWidth
        : text.length * fontSize
    const textLineCount = Math.ceil((text.length * fontSize) / textMaxWidth)
    const blobWidth = 16 * 2 + textWidth
    const blobHeight = 16 * 2 + textLineCount
    this.dialogBox = new DialogBox({
      text,
      x: (Globals.width - 300) / 2,
      y: talkerY - blobHeight - 70,
      talkerX: talkerX,
      talkerY: talkerY,
      width: blobWidth,
      height: blobHeight,
      fontSize: fontSize,
    })
    this.container.addChild(this.dialogBox.container)

    setTimeout(() => {
      this.container.removeChild(this.dialogBox.container)
      // this.container.removeAllListeners()
    }, timeout)
  }

  removeHint() {
    this.container.removeChild(this.dialogBox.container)
  }

  newSay(text) {
    const speakDialog = new SpeakDialog(text)
    this.container.addChild(speakDialog.container)

    return new Promise((resolve) => {
      this.container.addListener('pointerdown', () => {
        this.container.removeChild(speakDialog.container)
        this.container.removeAllListeners()

        setTimeout(() => {
          resolve()
        }, 200)
      })
    })
  }
}
