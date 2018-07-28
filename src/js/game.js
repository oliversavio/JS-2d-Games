var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload: preload, create: create, update: update
});

var ball;
var paddle;

function preload() {
  //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  //game.scale.pageAlignHorizontally = true;
  //game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#eee';
  game.load.image('ball', 'img/ball.png');
  game.load.image('paddle', 'img/paddle.png');
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

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  initBall();

  paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
  paddle.anchor.set(0.5, 1);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  paddle.body.immovable = true;
}

function update() {
  game.physics.arcade.collide(ball, paddle);
  paddle.x = game.input.x || game.world.width * 0.5;
}


