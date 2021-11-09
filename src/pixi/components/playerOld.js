import * as PIXI from 'pixi.js'
import { Globals } from '../script/Globals'

console.log(Globals)
const texture = Globals.resources['player']?.texture

console.log(texture)
// create a new Sprite from an image path
const player = PIXI.Sprite(texture)
// center the sprite's anchor point
player.anchor.set(0.5, 0.5)
// move the sprite to the center of the screen
// player.x = app.screen.width / 2
// player.y = app.screen.height / 2

export default player
