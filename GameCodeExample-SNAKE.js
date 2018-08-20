const GRID_SIZE = 20
const TICKS_PER_MOVE = 10
const PELLET_COUNT = 3
const COLORS = {
  snakeHead: '#9BC53D',
  snakeBody: '#FDE74C',
  wall: '#404E4D',
  background: '#FFFFFF',
  grid: '#5BC0EB',
  pellet: '#C3423F'
}

function startGame () {
  let game = new Game('game-canvas')
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

class Game {
  constructor (canvasId) {
    this.gameOver = false
    this.canvas = document.getElementById(canvasId)
    this.context = this.canvas.getContext('2d')
    this.size = { width: this.canvas.width, height: this.canvas.height }
    this.squares = { x: this.size.width / GRID_SIZE, y: this.size.height / GRID_SIZE }

    this.snake = new Snake(this, {
      x: Math.floor(this.squares.x / 2),
      y: Math.floor(this.squares.y / 2)}, 3)
    this.pellets = []

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
    if (this.pellets.length < PELLET_COUNT) {
      this.placePellet()
    }

    this.snake.update(this.ticks)

    this.checkGameOver()
  }

  draw () {
    this.context.clearRect(0, 0, this.size.width, this.size.height)

    this.drawWall()
    // this.drawGrid()
    for (let pellet of this.pellets) {
      pellet.draw()
    }
    this.snake.draw()

    if (this.gameOver) {
      this.context.textAlign = 'center'
      this.context.font = '48px Helvetica'
      this.context.fillStyle = COLORS.wall
      this.context.fillText('game over', this.size.width / 2, this.size.height / 2)
    }
  }

  start () {
    this.tick()
  }

  checkGameOver () {
    if (doesIntersectWithArray(this.snake.head(), this.snake.tail()) || this.snakeHitsWall()) {
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
    this.context.fillStyle = COLORS.wall
    this.context.fillRect(0, 0, this.size.width, this.size.height)

    this.context.fillStyle = COLORS.background
    this.context.fillRect(
      GRID_SIZE,
      GRID_SIZE,
      (this.squares.x - 2) * GRID_SIZE,
      (this.squares.y - 2) * GRID_SIZE)
  }

  drawGrid () {
    this.context.strokeStyle = COLORS.grid
    this.context.lineWidth = 1

    this.context.beginPath()
    for (var x = 0; x < this.size.width; x += GRID_SIZE) {
      this.context.moveTo(x, 0)
      this.context.lineTo(x, this.size.height)
    }

    for (var y = 0; y < this.size.height; y += GRID_SIZE) {
      this.context.moveTo(0, y)
      this.context.lineTo(this.size.width, y)
    }

    this.context.stroke()
  }

  placePellet () {
    // choose a random location
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

    // add pellet at that location
    console.log('adding pellet', pos)
    this.pellets.push(new Pellet(this, pos))
  }

  removePellet (pos) {
    this.pellets = this.pellets.filter(function (pellet) {
      return !isSamePos(pos, pellet)
    })
  }
}

class Snake {
  constructor (game, headPos, segmentCount) {
    this.game = game
    this.segments = []
    this.growing = false
    for (let i = 0; i < segmentCount; i++) {
      this.segments.push({x: headPos.x, y: headPos.y + i})
    }
    this.direction = 'up'
    this.keyboarder = new Keyboarder()

    this.keyboarder.on(Keyboarder.KEYS.LEFT, () => this.turnLeft())
    this.keyboarder.on(Keyboarder.KEYS.RIGHT, () => this.turnRight())
  }

  update (ticks) {
    if (doesIntersectWithArray(this.segments[0], this.game.pellets)) {
      this.game.removePellet(this.segments[0])
      this.growing = true
    }

    if (ticks % TICKS_PER_MOVE === 0) {
      this.moveSnake()
    }
  }

  draw () {
    let context = this.game.context
    for (let i = this.segments.length - 1; i >= 0; i--) {
      let segment = this.segments[i]
      if (i === 0) {
        context.fillStyle = COLORS.snakeHead
      } else {
        context.fillStyle = COLORS.snakeBody
      }
      context.fillRect(
        segment.x * GRID_SIZE,
        segment.y * GRID_SIZE,
        GRID_SIZE, GRID_SIZE)
    }
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

    newSegment.x = Math.max(newSegment.x, 0)
    newSegment.x = Math.min(newSegment.x, this.game.squares.x - 1)
    newSegment.y = Math.max(newSegment.y, 0)
    newSegment.y = Math.min(newSegment.y, this.game.squares.y - 1)

    if (newSegment.x !== this.segments[0].x || newSegment.y !== this.segments[0].y) {
      this.segments.unshift(newSegment)
      if (this.growing) {
        this.growing = false
      } else {
        this.segments.pop()
      }
    }
  }
}

class Pellet {
  constructor (game, pos) {
    this.game = game
    this.x = pos.x
    this.y = pos.y
  }

  update () {

  }

  draw () {
    this.game.context.fillStyle = COLORS.pellet
    this.game.context.fillRect(
      this.x * GRID_SIZE,
      this.y * GRID_SIZE,
      GRID_SIZE, GRID_SIZE)
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

Keyboarder.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, S: 83 }

startGame()




///// ++++++++++++++++++++++++++++
///// ^^^ End of Snake example
///// ++++++++++++++++++++++++++++




// function doesIntersectWithArray (pos, posArray) {
//   // return posArray.some((otherPos) => isSamePos(pos, otherPos))

//   for (let otherPos of posArray) {
//     if (isSamePos(pos, otherPos)) {
//       return true
//     }
//   }
//   return false
// }

// function isSamePos (pos, otherPos) {
//   return pos.x === otherPos.x && pos.y === otherPos.y
// }


/// TEST 

// var canvas = document.getElementById("gameCanvas");
// var ctx = canvas.getContext("2d");

// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = PALETTE.snake
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI*2, false);
// ctx.fillStyle = PALETTE.frog
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.closePath();




// class Game {
//   constructor (canvasId) {
//     this.gameOver = false
//     this.canvas = document.getElementById(canvasId)
//     this.context = this.canvas.getContext('2d')
//     this.size = { width: this.canvas.width, height: this.canvas.height }

// this.frog = new frog(this, {

//     }

//     this.predators = []

//     this.ticks = 0

//     let tick = () => {
//       this.ticks++
//       this.update()
//       this.draw()
//       if (!this.gameOver) {
//         window.requestAnimationFrame(tick)
//       this.playerUpdate()
//       }
//     }

//     this.tick = tick
  // }

//   update () {
//     if (this.predators.length < PREDATORS_COUNT) {
//       this.placePellet()
//     }

//     this.snake.update(this.ticks)

//     this.checkGameOver()
//   }

//   draw () {
//     this.context.clearRect(0, 0, this.size.width, this.size.height)

//     this.drawWall()
//     for (let predator of this.predators) {
//       predator.draw()
//     }

//     this.snake.draw()

//     if (this.gameOver) {
//       this.context.textAlign = 'center'
//       this.context.font = '48px Helvetica'
//       this.context.fillStyle = COLORS.frog
//       this.context.fillText('game over', this.size.width / 2, this.size.height / 2)
//     }
//   }

//   start () {
//     this.tick()
//   }

//   checkGameOver () {
//     if (doesIntersectWithArray(this.frog(), this.predator()) || this.snakeHitsWall()) {
//       this.gameOver = true
//     }
//   }

//   drawWall () {
//     this.context.fillStyle = COLORS.wall
//     this.context.fillRect(0, 0, this.size.width, this.size.height)

//     this.context.fillStyle = COLORS.background
//     this.context.fillRect(
//       GRID_SIZE,
//       GRID_SIZE,
//       (this.squares.x - 2) * GRID_SIZE,
//       (this.squares.y - 2) * GRID_SIZE)
//   }

//   drawGrid () {
//     this.context.strokeStyle = COLORS.grid
//     this.context.lineWidth = 1

//     this.context.beginPath()
//     for (var x = 0; x < this.size.width; x += GRID_SIZE) {
//       this.context.moveTo(x, 0)
//       this.context.lineTo(x, this.size.height)
//     }

//     for (var y = 0; y < this.size.height; y += GRID_SIZE) {
//       this.context.moveTo(0, y)
//       this.context.lineTo(this.size.width, y)
//     }

//     this.context.stroke()
//   }

//   placePellet () {
//     // choose a random location
//     let foundValidPos = false
//     let pos
//     while (!foundValidPos) {
//       pos = {
//         x: Math.floor(Math.random() * (this.squares.x - 2)) + 1,
//         y: Math.floor(Math.random() * (this.squares.y - 2)) + 1
//       }

//       foundValidPos = !(doesIntersectWithArray(pos, this.snake.segments) ||
//                         doesIntersectWithArray(pos, this.pellets))
//     }

//     // add pellet at that location
//     console.log('adding pellet', pos)
//     this.pellets.push(new Pellet(this, pos))
//   }

//   removePellet (pos) {
//     this.pellets = this.pellets.filter(function (pellet) {
//       return !isSamePos(pos, pellet)
//     })
//   }
// }

// class Snake {
//   constructor (game, headPos, segmentCount) {
//     this.game = game
//     this.segments = []
//     this.growing = false
//     for (let i = 0; i < segmentCount; i++) {
//       this.segments.push({x: headPos.x, y: headPos.y + i})
//     }
//     this.direction = 'up'
//     this.keyboarder = new Keyboarder()

//     this.keyboarder.on(Keyboarder.KEYS.LEFT, () => this.turnLeft())
//     this.keyboarder.on(Keyboarder.KEYS.RIGHT, () => this.turnRight())
//   }

//   update (ticks) {
//     if (doesIntersectWithArray(this.segments[0], this.game.pellets)) {
//       this.game.removePellet(this.segments[0])
//       this.growing = true
//     }

//     if (ticks % TICKS_PER_MOVE === 0) {
//       this.moveSnake()
//     }
//   }

//   draw () {
//     let context = this.game.context
//     for (let i = this.segments.length - 1; i >= 0; i--) {
//       let segment = this.segments[i]
//       if (i === 0) {
//         context.fillStyle = COLORS.frog
//       } else {
//       context.fillRect(
//         segment.x * ,
//         segment.y * GRID_SIZE,
//         GRID_SIZE, GRID_SIZE)
//     }
//   }

//   head () {
//     return this.segments[0]
//   }

//   tail () {
//     return this.segments.slice(1)
//   }

//   turnLeft () {
//     if (this.direction === 'up') {
//       this.direction = 'left'
//     } else if (this.direction === 'left') {
//       this.direction = 'down'
//     } else if (this.direction === 'down') {
//       this.direction = 'right'
//     } else if (this.direction === 'right') {
//       this.direction = 'up'
//     }
//   }

//   turnRight () {
//     if (this.direction === 'up') {
//       this.direction = 'right'
//     } else if (this.direction === 'left') {
//       this.direction = 'up'
//     } else if (this.direction === 'down') {
//       this.direction = 'left'
//     } else if (this.direction === 'right') {
//       this.direction = 'down'
//     }
//   }

//   moveSnake () {
//     let newSegment = {
//       x: this.segments[0].x,
//       y: this.segments[0].y
//     }

//     if (this.direction === 'up') {
//       newSegment.y--
//     } else if (this.direction === 'down') {
//       newSegment.y++
//     } else if (this.direction === 'left') {
//       newSegment.x--
//     } else if (this.direction === 'right') {
//       newSegment.x++
//     }

//     newSegment.x = Math.max(newSegment.x, 0)
//     newSegment.x = Math.min(newSegment.x, this.game.squares.x - 1)
//     newSegment.y = Math.max(newSegment.y, 0)
//     newSegment.y = Math.min(newSegment.y, this.game.squares.y - 1)

//     if (newSegment.x !== this.segments[0].x || newSegment.y !== this.segments[0].y) {
//       this.segments.unshift(newSegment)
//       if (this.growing) {
//         this.growing = false
//       } else {
//         this.segments.pop()
//       }
//     }
//   }
// }

// class Pellet {
//   constructor (game, pos) {
//     this.game = game
//     this.x = pos.x
//     this.y = pos.y
//   }

//   update () {

//   }

//   draw () {
//     this.game.context.fillStyle = COLORS.pellet
//     this.game.context.fillRect(
//       this.x * GRID_SIZE,
//       this.y * GRID_SIZE,
//       GRID_SIZE, GRID_SIZE)
//   }
// }

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






// startGame()




/// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
///// MY FIRST DRAFT CODE BELOW
/// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++





// const PALETTE = {
//   background: '#A6CAD2',
//   frog: '#DB7F8E',
//   hedgehog: '#604D53',
//   snake: '#57737A'
// }


// class Game {
//   constructor(canvasId) {
//     this.canvas = document.getElementById(canvasId)
//     this.context = this.canvas.getContext('2d')
//     this.size = {
//       width: this.size.width,
//       height: this.canvas.height
//     }

//     this.frog = new frog({
//       x: Math.floor(this.squares.x / 2),
//       y: Math.floor(this.squares.y / 2)}, 3)

//     this.ticks = 0
//   }

//   update (){
//     this.frog.update(this.ticks)
//   }

//   draw () {
//     this.context.fillStyle = COLORS.background
//     this.context.fillRect(0, 0, this.size.width, this.size.height)

//     this.context.fillStyle = COLORS.background
//     this.context.fillRect(
//       (this.x - 2),
//       (this.y - 2))

//     this.context.fillStyle = COLORS.grid
//     for (var x = 0; x < this.size.width; x += GRID_SIZE) {
//       this.context.fillRect(x - 1, 0, 2, this.size.height)
//     }

//     for (var y = 0; y < this.size.height; y += GRID_SIZE) {
//       this.context.fillRect(0, y - 1, this.size.width, 2)
//     }

//     this.frog.draw(this.context)
//   }

//     tick () {
//       this.ticks++
//       this.update()
//       this.draw()
//       window.requestAnimationFrame(() => this.tick())
//     }

//     start () {
//       this.tick()
//     }
//   }


// class Frog {
//   constructor (Game, pos) {
//     // this.direction = 'up'
//     // this.keyboarder = new Keyboarder()

//     // this.keyboarder.on(Keyboarder.KEYS.LEFT, () => this.turnLeft())
//     // this.keyboarder.on(Keyboarder.KEYS.RIGHT, () => this.turnRight())

//     draw () {   

//       this.context.clearRect(0, 0, this.size.width, this.size.height)
  
//       this.context.beginPath();
//       this.context.arc(240, 160, 20, 0, Math.PI*2, false);
//       this.context.fillStyle = '#DB7F8E';
//       this.context.fill();
//       this.context.closePath(); 
//     }
//   }
// }


// class Keyboarder {
//   constructor() {
//     this.keyState = {}

//     window.addEventListener('keydown', function (e) {
//       this.keyState[e.keyCode] = true
//     }.bind(this))

//     window.addEventListener('keyup', function (e) {
//       this.keyState[e.keyCode] = false
//     }.bind(this))
//   }

//   isDown(keyCode) {
//     return this.keyState[keyCode] === true
//   }

//   on(keyCode, callback) {
//     window.addEventListener('keydown', function (e) {
//       if (e.keyCode === keyCode) {
//         callback()
//       }
//     })
//   }
// }

// Keyboarder.KEYS = {
//   LEFT: 37,
//   RIGHT: 39,
//   UP: 38,
//   DOWN: 40,
//   // S: 83
// }

// turnLeft () {
//   if (this.direction === 'up') {
//     this.direction = 'left'
//   } else if (this.direction === 'left') {
//     this.direction = 'down'
//   } else if (this.direction === 'down') {
//     this.direction = 'right'
//   } else if (this.direction === 'right') {
//     this.direction = 'up'
//   }
// }

// turnRight () {
//   if (this.direction === 'up') {
//     this.direction = 'right'
//   } else if (this.direction === 'left') {
//     this.direction = 'up'
//   } else if (this.direction === 'down') {
//     this.direction = 'left'
//   } else if (this.direction === 'right') {
//     this.direction = 'down'
//   }
// }

// update (ticks) {

//   if (ticks % 30 === 0) {
//     let newSegment = {
//       x: this.segments[0].x,
//       y: this.segments[0].y
//     }

//     if (this.direction === 'up') {
//       newSegment.y--
//     } else if (this.direction === 'down') {
//       newSegment.y++
//     } else if (this.direction === 'left') {
//       newSegment.x--
//     } else if (this.direction === 'right') {
//       newSegment.x++
//     }

//     this.segments.unshift(newSegment)
//     this.segments.pop()
//   }


//   draw (context) {
//     for (let i = 0; i < this.segments.length; i++) {
//       let segment = this.segments[i]
//       if (i === 0) {
//         context.fillStyle = COLORS.snakeHead
//       } else {
//         context.fillStyle = COLORS.snakeBody
//       }
//       context.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE,
//         GRID_SIZE, GRID_SIZE)
//     }
//   }
// }



/// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/// STARTER COPY ^^^
///// MY FIRST DRAFT CODE ABOVE
/// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++



