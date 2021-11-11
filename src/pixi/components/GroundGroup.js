import * as PIXI from 'pixi.js'
// import { Globals } from '../script/Globals'
import { Ground } from '../components/Ground'
import { Doctor } from '../components/Doctor'
import { Player } from '../components/Player'

export class GroundGroup {
  constructor(groundGroupPosition) {
    this.container = new PIXI.Container()
    this.x = groundGroupPosition.x
    this.y = groundGroupPosition.y

    this.createGroundGroup()
  }

  createGroundGroup() {
    console.log('createGroundGroup')
    console.log(this.x)
    console.log(this.y)

    this.player = new Player({
      x: this.x - 52,
      y: this.y,
    })
    this.ground = new Ground({
      x: this.x,
      y: this.y,
      isDarkGreen: false,
    })
    this.doctor = new Doctor({
      x: this.x - 100,
      y: this.y - 33,
    })

    this.container.addChild(
      this.ground.sprite,
      this.doctor.sprite,
      this.player.sprite
    )
  }
}
