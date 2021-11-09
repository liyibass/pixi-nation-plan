import * as PIXI from 'pixi.js'

import groundImagePath from './ground.png'

// create a new Sprite from an image path
const ground = PIXI.Sprite.from(groundImagePath)
// center the sprite's anchor point
ground.anchor.set(0.5, 0.5)
// move the sprite to the center of the screen
// player.x = app.screen.width / 2
// player.y = app.screen.height / 2

export default ground
