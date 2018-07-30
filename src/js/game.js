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
var textStyle = { font: '18px Arial', fill: '#0095DD' };
var speed = 10;
var ballVelocity = 150;

function preload() {
  game.stage.backgroundColor = '#eee';
  game.load.image('ball', 'img/ball.png');
  game.load.image('paddle', 'img/paddle.png');
  game.load.image('brick', 'img/brick.png');
}

var handleGameOver = function () {
  alert('Game over!');
  location.reload();
};

var initBall = function () {
  ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball');
  //Done bounce at bottom
  game.physics.arcade.checkCollision.down = false;
  //Enable Physics
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  //Make ball bounce
  ball.checkWorldBounds = true;
  //Handle game over
  ball.events.onOutOfBounds.add(handleGameOver, this);

  ball.body.velocity.set(150, -150);
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
  ballVelocity = ballVelocity + 10;
  ball.body.velocity.set(Math.min(ballVelocity, 200), Math.max(ballVelocity, -200));
};

var ballHitBrick = function (ball, brick) {
  brick.kill();
  score += 10;
  if(score % 30 == 0) {
    increaseLevel();
  }
  scoreText.setText('Points: ' + score);
  winGame();
};

var keyboardInputHandler = function () {
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    paddle.x = Math.max(paddle.x - speed, 0.5);
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    paddle.x = Math.min(paddle.x + speed, game.world.width - 0.5);
  }
};

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  initBall();
  initPaddle();
  initBricks();
  scoreText = game.add.text(5, 5, 'Points: 0', textStyle);

}

function update() {
  game.physics.arcade.collide(ball, paddle);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  keyboardInputHandler();
}


