import * as PIXI from 'pixi.js'

import playerImagePath from './player1.png'

// create a new Sprite from an image path
const player = PIXI.Sprite.from(playerImagePath)
// center the sprite's anchor point
player.anchor.set(0.5, 0.5)
// move the sprite to the center of the screen
// player.x = app.screen.width / 2
// player.y = app.screen.height / 2

export default player
