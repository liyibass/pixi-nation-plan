import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Ground } from './GroundNew'
import { Doctor } from './DoctorNew'
import { Player } from './PlayerNew'
// import { Globals } from '../script/Globals'
import { GroundGroupIcon } from './GroundGroupIcon'
import { DoctorSay } from './DoctorSay'
import { Status } from '../script/Status'
const groundGroupDimention = Globals.getGroundDimention()

export class GroundGroup {
  constructor(groundGroupDimention, menuSceneContainer) {
    this.menuSceneContainer = menuSceneContainer
    this.container = new PIXI.Container()
    this.container.name = 'groundGroup'
    this.x = groundGroupDimention.x
    this.y = groundGroupDimention.y

    this.createGroundGroup()
    this.createIcons()
  }

  createGroundGroup() {
    // const doctorDimention = Globals.getDoctorDimention({ x: this.x, y: this.y })
    // const playerDimention = Globals.getPlayerDimention({ x: this.x, y: this.y })

    this.ground = new Ground({
      x: 0,
      y: 0,
      isDarkGreen: false,
      groundGroupDimention,
    })

    const scale = this.ground.getSpriteScale()
    const playerXRatio = 90 / 359
    const playerYRatio = 30 / 113
    const doctorXRatio = 70 / 359
    const doctorYRatio = 40 / 113

    this.player = new Player({
      x:
        -groundGroupDimention.groundWidth / 2 +
        groundGroupDimention.groundWidth * playerXRatio,
      y: groundGroupDimention.groundHeight * playerYRatio,
      scale,
    })
    this.doctor = new Doctor({
      x:
        -groundGroupDimention.groundWidth / 2 +
        groundGroupDimention.groundWidth * doctorXRatio,
      y: -groundGroupDimention.groundHeight * doctorYRatio,
      scale,
    })

    this.container.addChild(
      this.ground.sprite,
      this.doctor.sprite,
      this.player.container
    )
  }

  createIcons() {
    const iconsContainer = new PIXI.Container()
    const interval = (groundGroupDimention.groundWidth * 0.6) / 3
    this.iconArray = []
    for (let i = 0; i < 3; i++) {
      const icon = new GroundGroupIcon(i)
      this.iconArray.push(icon)
      icon.container.x = i * interval
      iconsContainer.addChild(icon.container)
    }

    iconsContainer.x = -20
    this.container.addChild(iconsContainer)
  }

  hidePlayer() {
    this.player.container.alpha = 0
  }

  activeListener(enterCallback = () => {}, exitCallback = () => {}) {
    this.iconArray.forEach((icon) => {
      icon.activeListener?.(enterCallback, exitCallback)
    })

    this.activePlayerModSelection()
  }

  activePlayerModSelection() {
    this.player.container.buttonMode = true
    this.player.container.interactive = true
    this.player.container.addListener('pointerdown', () => {
      console.log('MOD')

      if (!Status.isShared) return
      this.doctorSay = new DoctorSay()
      this.menuSceneContainer.addChild(this.doctorSay.container)
      // this.doctorSay.mod('已解鎖獨家角色(功能尚未開發)')
    })
  }

  deactivePlayModSelection() {
    this.player.container.removeAllListeners()
    this.player.container.buttonMode = false
    this.player.container.interactive = false
  }

  deactiveListener() {
    this.iconArray.forEach((icon) => {
      icon.deactiveListener?.()
    })

    this.deactivePlayModSelection()

    this.player.container.removeAllListeners()
  }

  updateStageStatus() {
    for (let i = 0; i < 2; i++) {
      const icon = this.iconArray[i]
      icon.updateText()
    }
  }
}
