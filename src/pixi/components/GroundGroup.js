import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'
import { Ground } from '../components/Ground'
import { Doctor } from '../components/Doctor'
import { Player } from '../components/Player'
// import { Globals } from '../script/Globals'
import { GroundGroupIcon } from './GroundGroupIcon'
const groundGroupDimention = Globals.getGroundDimention()

export class GroundGroup {
  constructor(groundGroupDimention) {
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
    this.player = new Player({
      x: -83,
      y: 30,
      scale,
    })
    this.doctor = new Doctor({
      x: -104,
      y: -35,
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
    const interval = 60
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
  }

  deactiveListener() {
    this.iconArray.forEach((icon) => {
      icon.deactiveListener?.()
    })
  }

  updateStageStatus() {
    for (let i = 0; i < 2; i++) {
      const icon = this.iconArray[2]
      console.log(icon)
    }
  }
}
