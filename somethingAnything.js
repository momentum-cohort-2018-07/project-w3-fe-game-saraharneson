const PREDATOR_COUNT = 8
const PALETTE = {
  frog: '#517171',
  predator: 'black',
  background: '#383821'
}

function startGame () {
  let game = new Game('gameCanvas')
  game.start()
}

class Game {
  constructor (canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.screen = this.canvas.getContext('2d')
    this.size = {
      width: this.canvas.width,
      height: this.canvas.height
    }

    this.gameOver = false

    this.frog = new Frog(this, {
      x: Math.floor(this.size.width / 2),
      y: Math.floor(this.size.height / 2)
    })

    this.predators = []

    let tick = () => {
      this.update()
      this.draw()
      if (!this.gameOver) {
        window.requestAnimationFrame(tick)
      }
    }

    this.tick = tick
  }

  bodies () {
    return this.predators.concat(this.frog)
  }

  update () {
    while (this.predators.length < PREDATOR_COUNT) {
      this.sendPredator()
    }

    this.predators = this.predators.filter((body) => {
      return !(body.center.x < -20 ||
               body.center.x > this.size.width + 20 ||
               body.center.y < 0 ||
               body.center.y > this.size.height + 20)
    })

    this.bodies().forEach(function (body) {
      body.update()
    })
  }

  draw () {
    this.screen.clearRect(0, 0, this.size.width, this.size.height)

    this.bodies().forEach((body) => {
      body.draw(this.screen)
    })
  }

  start () {
    this.tick()
  }

  sendPredator () {
    let sides = ['top', 'left', 'right', 'bottom']
    let entrySide = sides[Math.floor(Math.random() * sides.length)]
    let x, y, vx, vy

    if (entrySide === 'top') {
      x = Math.random() * this.size.width
      y = -10
      vx = Math.random() * 4 - 2
      vy = Math.random() * 2
    } else if (entrySide === 'left') {
      x = -10
      y = Math.random() * this.size.height
      vx = Math.random() * 2
      vy = Math.random() * 4 - 2
    } else if (entrySide === 'bottom') {
      x = Math.random() * this.size.width
      y = this.size.height + 10
      vx = Math.random() * 4 - 2
      vy = Math.random() * -2
    } else if (entrySide === 'right') {
      x = this.size.width + 10
      y = Math.random() * this.size.height
      vx = Math.random() * -2
      vy = Math.random() * 4 - 2
    }

    this.predators.push(new Predator(this, {x: x, y: y}, {x: vx, y: vy}))
  }
}

class Frog {
  constructor (game, center) {
    this.game = game
    this.center = center
    this.keyboard = new Keyboarder()
    this.size = { width: 50, height: 50 }
  }

  update () {
    if (this.keyboard.isDown(Keyboarder.KEYS.LEFT)) {
      this.center.x -= 5
      if (this.center.x <= 0) { this.center.x = this.game.size.width }
    }
    if (this.keyboard.isDown(Keyboarder.KEYS.RIGHT)) {
      this.center.x += 5
      if (this.center.x > this.game.size.width) { this.center.x = 0 }
    }
    if (this.keyboard.isDown(Keyboarder.KEYS.UP)) {
      this.center.y -= 3
      if (this.center.y <= 0) { this.center.y = this.game.size.height }
    }
    if (this.keyboard.isDown(Keyboarder.KEYS.DOWN)) {
      this.center.y += 3
      if (this.center.y >= this.game.size.height) { this.center.y = 0 }
    }
  }

  draw (screen) {
    screen.fillStyle = PALETTE.frog
    screen.fillRect(
      this.center.x - this.size.width / 2,
      this.center.y - this.size.height / 2,
      this.size.width,
      this.size.height)
  }
}

// Previous (working) frog/player was round:
// screen.beginPath()
// screen.arc(this.center.x, this.center.y, 30, 0, Math.PI * 2, false)
// screen.fillStyle = PALETTE.frog
// screen.fill()
// screen.closePath()

class Predator {
  constructor (game, center, velocity) {
    this.game = game
    this.center = center
    this.velocity = velocity
    this.size = { width: 50, height: 50 }
  }

  update () {
    this.center.x += this.velocity.x
    this.center.y += this.velocity.y
  }

  draw (screen) {
    screen.fillStyle = PALETTE.predator
    screen.fillRect(
      this.center.x - this.size.width / 2,
      this.center.y - this.size.height / 2,
      this.size.width,
      this.size.height)
  }
}

class Keyboarder {
  constructor () {
    this.keyState = {}

    window.addEventListener('keydown', function (e) {
      this.keyState[e.keyCode] = true
    }.bind(this))

    window.addEventListener('keyup', function (e) {
      this.keyState[e.keyCode] = false
    }.bind(this))
  }

  isDown (keyCode) {
    return this.keyState[keyCode] === true
  }

  on (keyCode, callback) {
    window.addEventListener('keydown', function (e) {
      if (e.keyCode === keyCode) {
        callback()
      }
    })
  }
}

Keyboarder.KEYS = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  S: 83
}

startGame()
