import * as PIXI from 'pixi.js'

import doctorImagePath from './doctor.png'

// create a new Sprite from an image path
const doctor = PIXI.Sprite.from(doctorImagePath)
// center the sprite's anchor point
doctor.anchor.set(0.5, 0.5)
// move the sprite to the center of the screen
// doctor.x = app.screen.width / 2
// doctor.y = app.screen.height / 2

export default doctor
