import * as PIXI from 'pixi.js'

export class UnlockButton {
  constructor(callback = () => {}) {
    this.callback = callback
    this.container = new PIXI.Container()
    this.createButton()
    this.activeListener()
  }

  createButton() {
    const text = new PIXI.Text('玩遊戲解鎖', {
      fill: ['0xffffff'],
      fontSize: 14,
      align: 'center',
    })

    const background = new PIXI.Graphics()
    background.beginFill(0x3b6bd5)
    const padding = 5
    background.drawRect(
      0,
      0,
      text.width + padding * 2,
      text.height + padding * 2
    )
    background.endFill()

    text.x = padding
    text.y = padding

    this.container.addChild(background, text)

    this.container.buttonMode = true
    this.container.interactive = true
  }

  activeListener() {
    this.container.addListener('pointerdown', () => {
      this.container.removeAllListeners()
      this.callback()
    })
  }
}
