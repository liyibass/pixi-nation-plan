import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

// create a new Sprite from an image path
const spotlight = PIXI.Sprite(Globals.resources['player'].texture)
// center the sprite's anchor point
spotlight.anchor.set(0.5, 1)
// move the sprite to the center of the screen
// player.x = app.screen.width / 2
// player.y = app.screen.height / 2

export default spotlight
