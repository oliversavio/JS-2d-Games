var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload: preload, create: create, update: update
});

var balls;
var paddle;
var bricks;
var newBall;
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

var genRandomVelocity = function() {
  return Math.floor(Math.random() * (velocityMax - velocityMin + 1)) + velocityMin;
};

var initBall = function () {
  ballInfo = {
    count: 10,
    offset: 40,
    cords: { x: 40, y: 30 }
  }

  balls = game.add.group();
  balls.enableBody = true;
  balls.physicsBodyType = Phaser.Physics.ARCADE;
  for(var i = 0 ; i < ballInfo.count ; i++) {
    x = ((i * ballInfo.offset) + ballInfo.cords.x);
    y = ballInfo.cords.y;
    
    var ball = balls.create(x, y, 'ball');

    //newBall = game.add.sprite(x, y, 'ball');
    
    //game.physics.enable(newBall, Phaser.Physics.ARCADE);
    // Generate Random velocity between 150 - 180 for each ball
    //velocity = Math.floor(Math.random() * 100) + velocityMin;
    ball.body.velocity.set(0, genRandomVelocity());
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(redrawBall, this);
    
  }



 // ball = game.add.sprite(game.world.width * 0.5, 10, 'ball');
 // game.physics.enable(ball, Phaser.Physics.ARCADE);
};


var initStartButton = function () {
  startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
  startButton.anchor.set(0.5);
};

var startGame = function () {
  startButton.destroy();
  //ball.body.velocity.set(0, 150);
  playing = true;
};



function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  initBall();
  initStartButton();
  startGame(); //TODO remove this later
  scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
  levelText = game.add.text(game.world.width - 70, 5, "Level: 1", textStyle);
}

var redrawBall = function(ball) {
  console.log('reset');
  //ball.reset(ball.x, 0);
  //ball.body.velocity.set(0, genRandomVelocity());
};

function update() {
  redrawBall();

}


