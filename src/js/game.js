var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload: preload, create: create, update: update
});

var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var scoreText;
var score = 0;
var levelText;
var level = 1;
var textStyle = { font: '18px Arial', fill: '#0095DD' };
var speed = 10;
var ballVelocity = 150;
var playing = false;
var startButton;

function preload() {
  game.stage.backgroundColor = '#eee';
  game.load.image('ball', 'img/ball.png');
  game.load.image('paddle', 'img/paddle.png');
  game.load.image('brick', 'img/brick.png');
  game.load.spritesheet('button', 'img/button.png', 120, 40);
  game.load.spritesheet('ball', 'img/wobble.png', 20, 20);
}

var handleGameOver = function () {
  alert('Game over!');
  location.reload();
};

var initBall = function () {
  ball = game.add.sprite(game.world.width * 0.5, game.world.height - 40, 'ball');
  //Done bounce at bottom
  game.physics.arcade.checkCollision.down = false;
  //Enable Physics
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  //Make ball bounce
  ball.checkWorldBounds = true;
  //Handle game over
  ball.events.onOutOfBounds.add(handleGameOver, this);

  //ball.body.velocity.set(150, -150);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
};

var initPaddle = function () {
  paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
  paddle.anchor.set(0.5, 1);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  paddle.body.immovable = true;
};

var initBricks = function () {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 3,
      col: 7
    },
    offset: {
      top: 50,
      left: 60
    },
    padding: 10
  }

  bricks = game.add.group();
  for (c = 0; c < brickInfo.count.col; c++) {
    for (r = 0; r < brickInfo.count.row; r++) {
      var brickX = (c * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
      var brickY = (r * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
      newBrick = game.add.sprite(brickX, brickY, 'brick');
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }

};

var winGame = function () {
  var count_alive = 0;
  for (i = 0; i < bricks.children.length; i++) {
    if (bricks.children[i].alive == true) {
      count_alive++;
    }
  }
  if (count_alive == 0) {
    alert('You won the game, congratulations!');
    location.reload();
  }
};

var increaseLevel = function () {
  ballVelocity = ballVelocity + 20;
  ball.body.velocity.set(Math.min(ballVelocity, 400), Math.max(ballVelocity, -400));
  level += 1;
  levelText.setText("Level: " + level);
};

var ballHitBrick = function (ball, brick) {
  brick.kill();
  score += 10;
  if (score % 30 == 0) {
    increaseLevel();
  }
  scoreText.setText('Points: ' + score);
  winGame();
};

var keyboardInputHandler = function () {
  if (playing) {
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      paddle.x = Math.max(paddle.x - speed, 0.5);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      paddle.x = Math.min(paddle.x + speed, game.world.width - 0.5);
    }
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    startGame();
  }
};

var initStartButton = function () {
  startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
  startButton.anchor.set(0.5);
};

var startGame = function () {
  startButton.destroy();
  ball.body.velocity.set(150, -150);
  playing = true;
};

var animateBall = function () {
  //ball = game.add.sprite(50, 250, 'ball');
  ball.animations.add('wobble', [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
};

var ballHitPaddle = function(ball, paddle) {
  ball.animations.play('wobble');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  initBall();
  initPaddle();
  initBricks();
  initStartButton();
  animateBall();
  scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
  levelText = game.add.text(game.world.width - 70, 5, "Level: 1", textStyle);
}

function update() {
  game.physics.arcade.collide(ball, paddle, ballHitPaddle);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  keyboardInputHandler();
}


