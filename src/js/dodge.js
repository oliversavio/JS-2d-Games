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
  game.load.spritesheet('button', 'img/button.png', 120, 40);
}

var handleGameOver = function () {
  alert('Game over!');
  location.reload();
};

var initBall = function () {
  ball = game.add.sprite(game.world.width * 0.5, game.world.height - 40, 'ball');
  game.physics.enable(ball, Phaser.Physics.ARCADE);
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



function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  initBall();
  initStartButton();
  scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
  levelText = game.add.text(game.world.width - 70, 5, "Level: 1", textStyle);
}

function update() {
  
}


