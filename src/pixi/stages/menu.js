import * as PIXI from 'pixi.js'
import player from '../components/player/index'
import doctor from '../components/doctor/index'
import ground from '../components/ground/index'
import spotlight from '../components/spotlight/index'

const menu = new PIXI.Container({
    backgroundColor: 0x1099bb,
    width: 300,
    height: 300,
})

spotlight.x = menu.width / 2
spotlight.y = 298

ground.x = menu.width / 2
ground.y = 298

player.x = menu.width / 2
player.y = 247

doctor.x = menu.width / 2
doctor.y = 0
menu.addChild(spotlight, ground, player, doctor)

export default menu
