const GRID_SIZE = 20
const TICKS_PER_MOVE = 10
const PREDATOR_COUNT = 10
const PALETTE = {
  frog: '#9BC53D',
  wall: '#404E4D',
  background: '#FFFFFF',
  grid: '#EEEEEE',
  predator: '#C3423F'
}


//// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//// ^^^ ABOVE ^^^  New Section: Declaration of constant variables
//// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


function startGame () {
  let game = new Game('gameCanvas')
  game.start()
}

function doesIntersectWithArray (pos, posArray) {
  // return posArray.some((otherPos) => isSamePos(pos, otherPos))

  for (let otherPos of posArray) {
    if (isSamePos(pos, otherPos)) {
      return true
    }
  }
  return false
}

function isSamePos (pos, otherPos) {
  return pos.x === otherPos.x && pos.y === otherPos.y
}


// ^^^ Can use for collision detection of frog with predators?


//// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//// ^^^ ABOVE ^^^  New Section: helper functions 
//// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




class Game {
  constructor (canvasId) {
    this.gameOver = false
    this.canvas = document.getElementById("getCanvas")
    this.screen = this.canvas.getContext('2d')
    this.size = { width: this.canvas.width, height: this.canvas.height }
    // this.squares = { x: this.size.width / GRID_SIZE, y: this.size.height / GRID_SIZE }

    this.frog = new Frog(this, {
      x: Math.floor(this.squares.x / 2),
      y: Math.floor(this.squares.y / 2)})
// ^^^ Can use for frog?

    this.predators = []

// ^^^ Can use for predators?

    this.ticks = 0

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

  update () {
    if (this.predators.length < PREDATOR_COUNT) {
      this.sendPredator()
    }

    this.frog.update(this.ticks)

    this.checkGameOver()
  }

  draw () {
    this.context.clearRect(0, 0, this.size.width, this.size.height)

    this.drawWall()
    // this.drawGrid()

    for (let predator of this.predators) {
      predator.draw()
    }

    this.frog.draw()

    if (this.gameOver) {
      this.context.textAlign = 'center'
      this.context.font = '48px Helvetica'
      this.context.fillStyle = PALETTE.wall
      this.context.fillText('game over', this.size.width / 2, this.size.height / 2)
    }
  }

  start () {
    this.tick()
  }

  checkGameOver () {
    if (doesIntersectWithArray(this.frog()) || this.frogHitsWall()) {
      this.gameOver = true
    }
  }

frogPos () {
    this.context.frog.pos.x
    this.context.frog.pos.y
}

  // frogHitsWall () {
  //   if frogPos (doesIntersectWithArray(this.wall))

  //   return this.checkGameOver
  // }

  drawWall () {
    this.context.fillStyle = PALETTE.wall
    this.context.fillRect(0, 0, this.size.width, this.size.height)

    this.context.fillStyle = PALETTE.background
    this.context.fillRect(
      GRID_SIZE,
      GRID_SIZE,
      (this.squares.x - 2) * GRID_SIZE,
      (this.squares.y - 2) * GRID_SIZE)
  }

  // drawGrid () {
  //   this.context.strokeStyle = PALETTE.grid
  //   this.context.lineWidth = 1

  //   this.context.beginPath()
  //   for (var x = 0; x < this.size.width; x += GRID_SIZE) {
  //     this.context.moveTo(x, 0)
  //     this.context.lineTo(x, this.size.height)
  //   }

  //   for (var y = 0; y < this.size.height; y += GRID_SIZE) {
  //     this.context.moveTo(0, y)
  //     this.context.lineTo(this.size.width, y)
  //   }

  //   this.context.stroke()
  // }

  // sendPredator () {
  //   // choose a random location
  //   let foundValidPos = false
  //   let pos
  //   while (!foundValidPos) {
  //     pos = {
  //       x: Math.floor(Math.random() * (this.squares.x - 2)) + 1,
  //       y: Math.floor(Math.random() * (this.squares.y - 2)) + 1
  //     }

  //     foundValidPos = !(doesIntersectWithArray(pos, this.frog) ||
  //                       !doesIntersectWithArray(pos, this.wall))
  //   }

  //   // add predator at that location
  //   console.log('adding predator', pos)
  //   this.predators.push(new predator(this, pos))
  // }
}


class Frog {
  constructor (game, pos) {
    this.game = game
    // this.direction = 'up'
    this.keyboarder = new Keyboarder()

    this.keyboarder.on(Keyboarder.KEYS.LEFT, () => this.turnLeft())
    this.keyboarder.on(Keyboarder.KEYS.RIGHT, () => this.turnRight())
    this.keyboarder.on(Keyboarder.KEYS.LEFT, () => this.turnLeft())
    this.keyboarder.on(Keyboarder.KEYS.RIGHT, () => this.turnRight())
  }

  update (ticks) {
    if (doesIntersectWithArray(this.game.predators)) {
      checkGameOver
    }

    if (ticks % TICKS_PER_MOVE === 0) {
      this.moveFrog()
    }
  }

  draw () {
    let context = this.game.context

        this.context.beginPath()
        this.context.arc(x, y, 10, 0, Math.PI*2)
        this.context.fillStyle = '#57737A'
        this.context.fill()
        this.context.closePath()
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


class Predator {

    constructor (game, pos) {
      this.game = game
      this.x = pos.x
      this.y = pos.y
    }
  
    update () {
  
    }
  
    draw () {
      this.game.context.fillStyle = COLORS.predator
      this.game.context.fillRect(
        this.x * GRID_SIZE,
        this.y * GRID_SIZE,
        GRID_SIZE, GRID_SIZE)
    }
  }



  draw () {
    this.game.context.fillStyle = PALETTE.predator
    this.game.context.fillRect(
      this.x * GRID_SIZE,
      this.y * GRID_SIZE,
      GRID_SIZE, GRID_SIZE)
  }
}


// moveFrog () {

// }

// movePredator () {

// }


//// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//// ^^^ New Section:  
//// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



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
  
  
  if(this.cursors.left.isDown || this.keyLeft.isDown) {
    // move left
  }
  else if(this.cursors.right.isDown || this.keyRight.isDown) {
    // move right
  }
  if(this.cursors.up.isDown || this.keyUp.isDown) {
    // move up
  }
  else if(this.cursors.down.isDown || this.keyDown.isDown) {
    // move down
  }
  
  


//// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//// ^^^ New Section:  PROVIDED KEYBOARDER CODE. DON'T KNOW IF NEEDS MODIFYING!
//// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



startGame()



