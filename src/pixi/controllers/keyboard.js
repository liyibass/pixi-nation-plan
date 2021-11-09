const body = document.querySelector('body')
let direction = 'center'

body.addEventListener('keydown', (e) => {
  switch (e.keyCode) {
    case 38:
    case 87:
      direction = 'up'
      break

    case 40:
    case 83:
      direction = 'down'
      break

    case 37:
    case 65:
      direction = 'left'
      break

    case 39:
    case 68:
      direction = 'right'
      break

    default:
      direction = 'center'
      break
  }
})

export { direction }
