const GRID_SIZE = 20
const TICKS_PER_MOVE = 10
const PELLET_COUNT = 2

const COLORS = {
  snakeHead: '#9BC53D',
  snakeBody: '#FDE74C',
  wall: '#404E4D',
  background: '#FFFFFF',
  grid: '#5BC0EB',
  pellet: '#C3423F'
}

const SHOW_GRID = false

// ## Functions

function isSamePos (pos, otherPos) {
  return pos.x === otherPos.x && pos.y === otherPos.y
}

function doesIntersectWithArray (pos, posArray) {
  // A shorter way to write this:
  // `return posArray.some((otherPos) => isSamePos(pos, otherPos))`

  for (let otherPos of posArray) {
    if (isSamePos(pos, otherPos)) {
      return true
    }
  }
  return false
}

// ## Game class
//
// This class orchestrates the entire game. It is responsible for keeping game
// state, running the game loop, and drawing the canvas.

class Game {
  // The constructor creates an object. It sets up all the properties we will
  // use to run the game.
  constructor (canvasId) {

    this.canvas = document.getElementById(canvasId)
    this.screen = this.canvas.getContext('2d')

    this.size = { width: this.canvas.width, height: this.canvas.height }
    this.squares = { x: this.size.width / GRID_SIZE, y: this.size.height / GRID_SIZE }

    this.ticks = 0

    this.gameOver = false

    this.snake = new Snake(this, {
      x: Math.floor(this.squares.x / 2),
      y: Math.floor(this.squares.y / 2)}, 3)
    this.pellets = []

    
    let tick = () => {
      this.ticks++
      this.update()
      this.draw()
      if (!this.gameOver) {
        window.requestAnimationFrame(tick)
      }
    }

    this.tick = tick
  }

  // ### Main game methods


  update () {
    while (this.pellets.length < PELLET_COUNT) {
      this.placePellet()
    }

    this.snake.update(this.ticks)

    this.checkGameOver()
  }


  draw () {
    this.screen.clearRect(0, 0, this.size.width, this.size.height)

    this.drawWall()
    if (SHOW_GRID) {
      this.drawGrid()
    }

    for (let pellet of this.pellets) {
      pellet.draw(this.screen)
    }
    this.snake.draw(this.screen)
    if (this.gameOver) {
      this.drawGameOver()
    }
  }

  // An alias for `.tick` so that our code is more readable.
  start () {
    this.tick()
  }

  // ### Helper methods

  
  checkGameOver () {
    if (this.snakeHitsWall() || doesIntersectWithArray(this.snake.head(), this.snake.tail())) {
      this.gameOver = true
    }
  }

  snakeHitsWall () {
    let snakeHead = this.snake.head()
    return (
      snakeHead.x === 0 ||
      snakeHead.y === 0 ||
      snakeHead.x === this.squares.x - 1 ||
      snakeHead.y === this.squares.y - 1
    )
  }


  drawWall () {
    this.screen.fillStyle = COLORS.wall
    this.screen.fillRect(0, 0, this.size.width, this.size.height)

    this.screen.fillStyle = COLORS.background
    this.screen.fillRect(
      GRID_SIZE,
      GRID_SIZE,
      (this.squares.x - 2) * GRID_SIZE,
      (this.squares.y - 2) * GRID_SIZE)
  }


  drawGrid () {
    this.screen.strokeStyle = COLORS.grid
    this.screen.lineWidth = 1

    // See https://dreisbach.us/notes/begin-path/ to understand why we need to
    // call `this.screen.beginPath()` here.
    this.screen.beginPath()
    for (var x = 0; x < this.size.width; x += GRID_SIZE) {
      this.screen.moveTo(x, 0)
      this.screen.lineTo(x, this.size.height)
    }

    for (var y = 0; y < this.size.height; y += GRID_SIZE) {
      this.screen.moveTo(0, y)
      this.screen.lineTo(this.size.width, y)
    }

    this.screen.stroke()
  }

  drawGameOver () {
    this.screen.textAlign = 'center'
    this.screen.font = '48px Helvetica'
    this.screen.fillStyle = COLORS.wall
    this.screen.fillText('game over', this.size.width / 2, this.size.height / 2)
  }

  placePellet () {

    let foundValidPos = false
    let pos
    while (!foundValidPos) {
      pos = {
        x: Math.floor(Math.random() * (this.squares.x - 2)) + 1,
        y: Math.floor(Math.random() * (this.squares.y - 2)) + 1
      }

      foundValidPos = !(doesIntersectWithArray(pos, this.snake.segments) ||
                        doesIntersectWithArray(pos, this.pellets))
    }

    this.pellets.push(new Pellet(pos))
  }


  removePellet (pos) {
    this.pellets = this.pellets.filter(function (pellet) {
      return !isSamePos(pos, pellet)
    })
  }
}

// ## Snake class

class Snake {

  constructor (game, headPos, segmentCount) {
    this.game = game
    
    this.segments = []
    for (let i = 0; i < segmentCount; i++) {
      this.segments.push({x: headPos.x, y: headPos.y + i})
    }
    
    this.direction = 'up'
    this.growing = false

    this.keyboarder = new Keyboarder()
    this.keyboarder.on(Keyboarder.KEYS.LEFT, () => this.turnLeft())
    this.keyboarder.on(Keyboarder.KEYS.RIGHT, () => this.turnRight())
  }

  update (ticks) {

    if (doesIntersectWithArray(this.segments[0], this.game.pellets)) {
      this.game.removePellet(this.segments[0])
      this.growing = true
    }

    // if (ticks % TICKS_PER_MOVE === 0) {
    //   this.moveSnake()
    // }
  }

  draw (screen) {
    screen.fillStyle = COLORS.snakeBody
    for (let segment of this.tail()) {
      screen.fillRect(
        segment.x * GRID_SIZE,
        segment.y * GRID_SIZE,
        GRID_SIZE, GRID_SIZE)
    }

    screen.fillStyle = COLORS.snakeHead
    screen.fillRect(
      this.head().x * GRID_SIZE,
      this.head().y * GRID_SIZE,
      GRID_SIZE, GRID_SIZE)
  }

  head () {
    return this.segments[0]
  }

  tail () {
    return this.segments.slice(1)
  }

  turnLeft () {
    if (this.direction === 'up') {
      this.direction = 'left'
    } else if (this.direction === 'left') {
      this.direction = 'down'
    } else if (this.direction === 'down') {
      this.direction = 'right'
    } else if (this.direction === 'right') {
      this.direction = 'up'
    }
  }

  turnRight () {
    if (this.direction === 'up') {
      this.direction = 'right'
    } else if (this.direction === 'left') {
      this.direction = 'up'
    } else if (this.direction === 'down') {
      this.direction = 'left'
    } else if (this.direction === 'right') {
      this.direction = 'down'
    }
  }

  moveSnake () {
    let newSegment = {
      x: this.segments[0].x,
      y: this.segments[0].y
    }

    if (this.direction === 'up') {
      newSegment.y--
    } else if (this.direction === 'down') {
      newSegment.y++
    } else if (this.direction === 'left') {
      newSegment.x--
    } else if (this.direction === 'right') {
      newSegment.x++
    }

    this.segments.unshift(newSegment)
    if (this.growing) {
      this.growing = false
    } else {
      this.segments.pop()
    }
  }
}

// ## Pellet class

class Pellet {
  constructor (pos) {
    this.x = pos.x
    this.y = pos.y
  }

  draw (screen) {
    screen.fillStyle = COLORS.pellet
    screen.fillRect(
      this.x * GRID_SIZE,
      this.y * GRID_SIZE,
      GRID_SIZE, GRID_SIZE)
  }
}

// ## Keyboarder class

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

Keyboarder.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, S: 83 }

// Start the game.
let game = new Game('game-canvas')
game.start()