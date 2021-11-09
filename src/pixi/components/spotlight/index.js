import * as PIXI from 'pixi.js'

import spotlightImagePath from './spotlight.png'

// create a new Sprite from an image path
const spotlight = PIXI.Sprite.from(spotlightImagePath)
// center the sprite's anchor point
spotlight.anchor.set(0.5, 1)
// move the sprite to the center of the screen
// player.x = app.screen.width / 2
// player.y = app.screen.height / 2

export default spotlight
