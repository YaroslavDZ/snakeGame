let intervalId;

class GameField {

  constructor() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.size = 25;
    this.rows = this.canvas.height / this.size;
    this.cols = this.canvas.width / this.size;
    this.snake = new Snake(this);
    this.food = new Food(this.rows, this.cols);
  }

  drawLine(startX, startY, endX, endY) {
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
  }

  drawFood(food) {
    this.food = food;
    this.ctx.beginPath();
    this.ctx.rect(food.x, food.y, this.size, this.size);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawField() {
    for (let i = 0, xPos = this.snake.size; i < this.rows; i++, xPos += this.snake.size) {
      this.drawLine(xPos, 0, xPos, this.canvas.height);
    }

    for (let i = 0, yPos = this.snake.size; i < this.cols; i++, yPos += this.snake.size) {
      this.drawLine(0, yPos, this.canvas.width, yPos);
    }
  }
}

class Food {
  constructor(rows, cols, size = 25) {
    this.x = Math.floor(Math.random() * cols) * size;
    this.y = Math.floor(Math.random() * rows) * size;
  }
}

class Snake {
  constructor(gameField, size = 25, length = 2) {
    this.length = length;
    this.size = size;
    this.direction = "";
    this.gameField = gameField;
    this.ctx = this.gameField.ctx;
    this.snakeCoordinates = [{ x: 0, y: 0 }];
  }

  drawSnake() {
    this.ctx.beginPath();
    this.ctx.rect(this.snakeCoordinates[0].x, this.snakeCoordinates[0].y, this.size, this.size);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
    this.ctx.closePath();

    for (let i = 1; i < this.snakeCoordinates.length; i++) {
      this.ctx.beginPath();
      this.ctx.rect(this.snakeCoordinates[i].x, this.snakeCoordinates[i].y, this.size, this.size);
      this.ctx.fillStyle = 'green';
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  moveSnake(direction) {
    if (this.isBiteItself()) {
      clearInterval(intervalId);
      let popup = document.querySelector('.block-hidden');
      popup.classList.add('gameOver');
      return;
    }

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.gameField.drawField();
    this.drawSnake();
    this.gameField.drawFood(this.gameField.food);

    let head = { x: this.snakeCoordinates[0].x, y: this.snakeCoordinates[0].y };
    if (this.gameField.food.x === head.x && this.gameField.food.y === head.y) {
      this.length++;
      this.gameField.drawFood(new Food(this.gameField.rows, this.gameField.cols));
    } else {
      this.snakeCoordinates.pop();
    }

    switch (direction) {
      case 'right':
        head.x += this.size;
        break;
      case 'left':
        head.x -= this.size;
        break;
      case 'up':
        head.y -= this.size;
        break;
      case 'down':
        head.y += this.size;
        break;
    }

    this.processOutOfBounds(head, direction);
    this.snakeCoordinates.unshift(head);
    this.direction = direction;
  }

  processOutOfBounds(coordinates, direction) {
    if (coordinates.x < 0) coordinates.x = (this.gameField.cols - 1) * this.size;
    if (coordinates.x >= this.gameField.cols * this.size) coordinates.x = 0;
    if (coordinates.y < 0) coordinates.y = (this.gameField.rows - 1) * this.size;
    if (coordinates.y >= this.gameField.rows * this.size) coordinates.y = 0;
  }

  isBiteItself() {
    let head = this.snakeCoordinates[0];
    for (let i = 1; i < this.snakeCoordinates.length; i++) {
      if (this.snakeCoordinates[i].x === head.x && this.snakeCoordinates[i].y === head.y) {
        return true;
      }
    }
    return false;
  }
}

document.querySelector('#restart').addEventListener('click', function() {
  game.ctx.clearRect(0, 0, game.ctx.canvas.width, game.ctx.canvas.height);
  let popup = document.querySelector('.block-hidden');
  popup.classList.remove('gameOver');
  start();
});

document.addEventListener('keydown', function(event) {
  if (event.keyCode === 39 && game.snake.direction !== "left") {
    clearInterval(intervalId);
    intervalId = setInterval(() => game.snake.moveSnake('right'), 200);
  }

  if (event.keyCode === 40 && game.snake.direction !== "up") {
    clearInterval(intervalId);
    intervalId = setInterval(() => game.snake.moveSnake('down'), 200);
  }

  if (event.keyCode === 37 && game.snake.direction !== "right") {
    clearInterval(intervalId);
    intervalId = setInterval(() => game.snake.moveSnake('left'), 200);
  }

  if (event.keyCode === 38 && game.snake.direction !== "down") {
    clearInterval(intervalId);
    intervalId = setInterval(() => game.snake.moveSnake('up'), 200);
  }
});

let game;

function start() {
  game = new GameField();
  game.drawField();
  game.snake.drawSnake();
  game.drawFood(new Food(game.rows, game.cols));
}

start();
