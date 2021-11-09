import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

// create a new Sprite from an image path

const doctor = PIXI.Sprite(Globals.resources['doctor'].texture)
// center the sprite's anchor point
doctor.anchor.set(0.5, 0.5)
// move the sprite to the center of the screen
// doctor.x = app.screen.width / 2
// doctor.y = app.screen.height / 2

export default doctor
