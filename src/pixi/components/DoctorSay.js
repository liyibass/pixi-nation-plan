import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

import { DialogBoxNew } from './DialogBoxNew'
import { DoctorDialogBoxNew } from './DoctorDialogBoxNew'
import { DoctorShareBoxGroup } from './DoctorShareBoxGroup'
import { DoctorModBoxGroup } from './DoctorModBoxGroup'
import { SpeakDialog } from './SpeakDialog'
import { shareUtil, updateMod } from '../script/Utils'
import { sound } from '@pixi/sound'

export class DoctorSay {
  constructor() {
    this.container = new PIXI.Container()
    this.container.name = 'doctorSay'
    // this.initMusic()
    this.init()

    this.doctorDimention = Globals.getDoctorDimention()
  }

  playClickMusic() {
    sound.play('click')
  }

  init() {
    this.container.interactive = true
    this.container.buttonMode = true
  }

  say(text) {
    const dialogBox = new DialogBoxNew({
      text,
      talkerX: this.doctorDimention.x,
      talkerY: this.doctorDimention.y,
    })
    dialogBox.init()

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
    // console.log('chooseSay')
    return new Promise((resolve) => {
      const chosenHandler = (chosen) => {
        this.playClickMusic()
        this.container.removeChildren()
        this.container.removeAllListeners()
        resolve(chosen)
      }

      const dialogBox = new DoctorDialogBoxNew({
        text,
        talkerX: this.doctorDimention.x,
        talkerY: this.doctorDimention.y,
        chosenHandler,
        button1,
        button2,
      })
      dialogBox.init()

      this.container.addChild(dialogBox.container)
    })
  }

  share(text, gameName) {
    shareUtil.shareHandler(true, gameName)

    return new Promise((resolve) => {
      const shareHandler = async () => {}

      const doneShare = () => {
        this.container.removeChildren()
        this.container.removeAllListeners()
        resolve(true)
      }

      shareUtil.doneShare = doneShare

      const dialogBox = new DoctorShareBoxGroup({
        text,
        talkerX: this.doctorDimention.x + 30,
        talkerY: this.doctorDimention.y,
        chosenHandler: shareHandler,
      })

      this.container.addChild(dialogBox.container)
    })
  }

  mod(text, isClickable = true) {
    return new Promise((resolve) => {
      const modHandler = (chosen) => {
        this.playClickMusic()
        this.container.removeChildren()
        this.container.removeAllListeners()

        if (!isClickable) {
          return resolve(false)
        }

        if (chosen === 'cancel') {
          resolve(false)
        } else {
          updateMod(chosen)
          resolve(true)
        }
      }

      const width = 327
      const height = 170

      const dialogBox = new DoctorModBoxGroup({
        text,
        x: (Globals.outerWidth - width) / 2,
        y: this.doctorDimention.y - height - 70,
        talkerX: this.doctorDimention.x + 30,
        talkerY: this.doctorDimention.y,
        width: width,
        height: height,
        fontSize: 16,
        chosenHandler: modHandler,
      })

      this.container.addChild(dialogBox.container)
    })
  }

  hint(text, timeout = 3000) {
    const talkerX = this.doctorDimention.x
    const talkerY = this.doctorDimention.y

    this.dialogBox = new DialogBoxNew({
      text,
      talkerX: talkerX,
      talkerY: talkerY,
    })
    this.dialogBox.init()
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
        this.playClickMusic()
        this.container.removeChild(speakDialog.container)
        this.container.removeAllListeners()
        speakDialog.destorySpeakDialog?.()

        resolve()
        // setTimeout(() => {
        // }, 200)
      })
    })
  }
  _wait(delayTime) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, delayTime)
    })
  }
}
