import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
import { Ground } from '../components/Ground'
import { Doctor } from '../components/Doctor'
import { Player } from '../components/Player'
import { Globals } from '../script/Globals'

export class GroundGroup {
  constructor(groundGroupDimention) {
    this.container = new PIXI.Container()
    this.x = groundGroupDimention.x
    this.y = groundGroupDimention.y

    this.createGroundGroup()
  }

  createGroundGroup() {
    const doctorDimention = Globals.getDoctorDimention({ x: this.x, y: this.y })
    const playerDimention = Globals.getPlayerDimention({ x: this.x, y: this.y })

    this.ground = new Ground({
      x: this.x,
      y: this.y,
      isDarkGreen: false,
    })
    this.player = new Player({
      x: playerDimention.x,
      y: playerDimention.y,
    })
    this.doctor = new Doctor({
      x: doctorDimention.x,
      y: doctorDimention.y,
    })

    this.container.addChild(
      this.ground.sprite,
      this.doctor.sprite,
      this.player.sprite
    )
  }

  hidePlayer() {
    this.player.sprite.alpha = 0
  }
}
