var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload: preload, create: create, update: update
});

var balls;
var ballInfo;
var scoreText;
var score = 0;
var levelText;
var level = 1;
var textStyle = { font: '18px Arial', fill: '#0095DD' };
var speed = 10;
var ballVelocity = 150;
var playing = true; //TODO chage to false later
var startButton;
var velocityMin = 100;
var velocityMax = 200;

function preload() {
  game.stage.backgroundColor = '#eee';
  game.load.image('ball', 'img/ball.png');
  game.load.spritesheet('button', 'img/button.png', 120, 40);
}

var handleGameOver = function () {
  alert('Game over!');
  location.reload();
};

var genRandomVelocity = function () {
  return Math.floor(Math.random() * (velocityMax - velocityMin + 1)) + velocityMin;
};



var initBall = function () {
  ballInfo = {
    count: 11,
    offset: 40,
    cords: { x: 20, y: -20 },
    levels: [{ c: 2 }, { c: 3 }, { c: 5 }, { c: 7 }, { c: 9 }, { c: 10 }, { c: 11 }]
  }

  balls = game.add.group();
  balls.enableBody = true;
  balls.physicsBodyType = Phaser.Physics.ARCADE;

  for (var i = 0; i < ballInfo.count; i++) {
    x = ((i * ballInfo.offset) + ballInfo.cords.x);
    y = ballInfo.cords.y;
    var ball = balls.create(x, y, 'ball');
    ball.name = 'ball' + x.toString() + y.toString();
    ball.body.velocity.set(0, 0);
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(redrawBall, this);
  }

};

var increaseLevel = function () {
  if (level > ballInfo.levels.length) {
    return;
  }
  var number = ballInfo.levels[level - 1];
  for (var i = 0; i < number.c; i++) {
    var ballIndex = Math.floor(Math.random() * (ballInfo.count)) + 0;
    var b = balls.getAt(ballIndex);
    b.body.velocity.set(0, genRandomVelocity());
  }
  level += 1;
  levelText.setText("Level: " + level);
};

var redrawBall = function (ball) {
  ball.reset(ball.x, 0);
  ball.body.velocity.set(0, genRandomVelocity());

  score += 10;
  if (score % 40 == 0) {
    increaseLevel();
  }
  scoreText.setText('Points: ' + score);
};

var initStartButton = function () {
  startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
  startButton.anchor.set(0.5);
};

var startGame = function () {
  startButton.destroy();
  playing = true;
  initBall();
  increaseLevel();
};

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  initStartButton();
  scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
  levelText = game.add.text(game.world.width - 70, 5, "Level: 1", textStyle);
}


function update() {


}


