const GRID_SIZE = 10
// const background = "#A6CAD2"
const PALETTE = {
    frog: "#517171",
    predator1: "black",
    predator2: "gray",
    wall: "#273881",
    background: "383821"
}
const KEYS = { UP: 38, LEFT: 37, RIGHT: 39, SPACE: 32 };
const TICKS_PER_MOVE = 10
const PREDATOR_COUNT = 8



// console.log("Hi")


function startGame() {
    let game = new Game(gameCanvas)
    game.start()
}


class Game {
    constructor(canvasId) {

        this.gameOver = false
        this.canvas = document.getElementById('gameCanvas')
        this.screen = this.canvas.getContext('2d')
        this.size = {
            width: this.canvas.width,
            height: this.canvas.height
        }
        this.squares = { x: this.size.width / GRID_SIZE, y: this.size.height / GRID_SIZE }

        
        this.ticks = 0

        this.gameOver = false
        
        this.snake = new Frog(this, {
            x: Math.floor(this.squares.x / 2),
            y: Math.floor(this.squares.y / 2)})
        this.predators = []


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
        // while (this.predators.length < PREDATOR_COUNT) {
        //   this.sendPredator()
        // }
    
        this.frog.update(this.ticks)
    
        this.checkGameOver()
      }



      draw () {
        this.screen.clearRect(0, 0, this.size.width, this.size.height)
    
        this.drawWall()
        
        for (let predator of this.predators) {
          predator.draw(this.screen)
        }
        this.frog.draw(this.screen)
        if (this.gameOver) {
          this.drawGameOver()
        }
      }

  start () {
    this.tick()
  }


    //   this.tick = tick



    // checkGameOver () {
    //     if (doesIntersectWithArray(this.frog(), this.predators())) {
    //       this.gameOver = true
    //     }
    //   }
    

  frogBumpsWall () {
    let frog = this.frog()
    return (
      frog.x === 0 ||
      frog.y === 0 ||
      frog.x === this.squares.x - 1 ||
      frog.y === this.squares.y - 1
    )
  }

  drawWall () {
    this.screen.fillStyle = PALETTE.wall
    this.screen.fillRect(0, 0, this.size.width, this.size.height)

    this.screen.fillStyle = PALETTE.background
    this.screen.fillRect(
      GRID_SIZE,
      GRID_SIZE,
      (this.squares.x - 2) * GRID_SIZE,
      (this.squares.y - 2) * GRID_SIZE)
  }


drawGrid () {




}



}

class Frog {
    constructor(game, position) {
        this.game = game
        this.keyboarder = new Keyboarder()
        

    this.keyboarder() {
        this.keyboarder = new Keyboarder()
        this.keyboarder.isDown(Keyboarder.KEYS.LEFT, () => this.move('left'))
        this.keyboarder.isDown(Keyboarder.KEYS.RIGHT, () => this.move('right'))
        this.keyboarder.isDown(Keyboarder.KEYS.UP, () => this.move('up'))
        this.keyboarder.isDown(Keyboarder.KEYS.DOWN, () => this.move('down'))
    }
    }

    update() {
        this.keyboarder = new Keyboarder()
            if (this.keyboard.isDown(Keyboarder.KEYS.LEFT)) {
                this.center.x -= 5
                if (this.center.x <= 0) this.center.x = 550
            }
            if (this.keyboard.isDown(Keyboarder.KEYS.RIGHT)) {
                this.center.x += 5
                if (this.center.x > canvas.width) this.center.x = 0
            }
            if (this.keyboard.isDown(Keyboarder.KEYS.UP)) {
                this.center.y -= 3
                if (this.center.y <= 0) this.center.y = 530
            }
            if (this.keyboard.isDown(Keyboarder.KEYS.DOWN)) {
                this.center.y += 3
                if (this.center.y >= 530) this.center.y = 530
            }
        }
    
    draw() {

        let context = this.game.context

        // context.fillStyle = '#57737A'
        // context.fillRect(225, 225, 50, 50)

        context.beginPath();
        context.arc(240, 160, 30, 0, Math.PI * 2, false);
        context.fillStyle = PALETTE.frog
        context.fill();
        context.closePath();

        this.frog.draw()
    }
}    



// class Predator {
//     constructor (game, position) {
//     this.game = game
//     // this.size = { width: this.canvas.width, height: this.canvas.height }

//     }

//     update () {

//     }


//     draw () {

//     let context = this.game.context

//     context.fillStyle = '#57737A'
//     context.fillRect(225, 225, 50, 50)
//     }

//     }

drawGameOver () {
    this.screen.textAlign = 'center'
    this.screen.font = '48px Helvetica'
    this.screen.fillStyle = PALETTE.wall
    this.screen.fillText('game over', this.size.width / 2, this.size.height / 2)
}


sendPredator () {
    let foundValidPos = false
    let pos
    while (!foundValidPos) {
      pos = {
        x: Math.floor(Math.random() * (this.squares.x - 2)) + 1,
        y: Math.floor(Math.random() * (this.squares.y - 2)) + 1
      }

foundValidPos = !(doesIntersectWithArray(pos, this.frog) ||
doesIntersectWithArray(pos, this.pellets))
}

this.predators.push(new predators(pos))
}


class Keyboarder {
    constructor() {
        this.keyState = {}

        window.addEventListener('keydown', function (e) {
            this.keyState[e.keyCode] = true
        }.bind(this))

        window.addEventListener('keyup', function (e) {
            this.keyState[e.keyCode] = false
        }.bind(this))
    }

    isDown(keyCode) {
        return this.keyState[keyCode] === true
    }

    on(keyCode, callback) {
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