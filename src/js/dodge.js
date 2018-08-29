var game = new Phaser.Game(470, 580, Phaser.CANVAS, null, {
  preload: preload, create: create, update: update
});

var astroids;
var astroidInfo;
var scoreText;
var score = 0;
var levelText;
var level = 1;
var textStyle = { font: '18px Arial', fill: '#0095DD' };
var speed = 5;
var ballVelocity = 150;
var playing = true; //TODO chage to false later
var startButton;
var velocityMin = 150;
var velocityMax = 250;
var sship;
var background;
var backgroundScrollVelocity = 75;
var explosions;

function preload() {
  game.stage.backgroundColor = '#eee';
  // https://opengameart.org/content/space-shooter-assets
  game.load.image('astroid', 'img/astroid.png');

  game.load.image('sship', 'img/SpaceShipSmall.png')
  // https://opengameart.org/content/space-cartoony-tiled-texture
  game.load.image('background', 'img/space-tiled.png')
  game.load.spritesheet('button', 'img/button.png', 120, 40);
  game.load.spritesheet('kaboom', 'img/explode.png', 128, 128);
}

var handleGameOver = function () {
  alert('Game over!');
  location.reload();
};

var genRandomVelocity = function () {
  return Math.floor(Math.random() * (velocityMax - velocityMin + 1)) + velocityMin;
};

var initGameBackground = function () {
  background = game.add.tileSprite(0, 0, 470, 580, 'background');
};

var renderAstroids = function () {
  for (var i = 0; i < astroidInfo.count; i++) {
    x = ((i * astroidInfo.offset) + astroidInfo.cords.x);
    y = astroidInfo.cords.y;
    var ball = astroids.create(x, y, 'astroid');
    ball.name = 'astroid' + x.toString() + y.toString();
    ball.body.velocity.set(0, 0);
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(redrawBall, this);
    ball.scale.setTo(0.1, 0.1);
  }
};

var initAstroids = function () {
  astroidInfo = {
    count: 11,
    offset: 40,
    cords: { x: 20, y: -20 },
    levels: [{ c: 2 }, { c: 3 }, { c: 5 }, { c: 7 }, { c: 9 }, { c: 10 }, { c: 11 }]
  }

  astroids = game.add.group();
  astroids.enableBody = true;
  astroids.physicsBodyType = Phaser.Physics.ARCADE;
};

var initShip = function () {
  sship = game.add.sprite(game.world.width * 0.5, game.world.height, 'sship')
  sship.anchor.set(0.5, 5);
  sship.scale.setTo(0.6, 0.6);
  game.physics.enable(sship, Phaser.Physics.ARCADE);
  sship.body.immovable = true;

  //exp = game.add.sprite(100, 100, 'kaboom');
  //sship.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 23);

};

var initExplosions = function () {
  explosions = game.add.group();
  explosions.createMultiple(30, 'kaboom');
  explosions.forEach(element => {
    element.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 23);
  });
};


var keyboardInputHandler = function (spriteObject) {
  if (playing) {
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      spriteObject.x = Math.max(spriteObject.x - speed, 0.5);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      spriteObject.x = Math.min(spriteObject.x + speed, game.world.width - 0.5);
    }
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    startGame();
  }
};

var increaseLevel = function () {
  if (level > astroidInfo.levels.length) {
    return;
  }
  var number = astroidInfo.levels[level - 1];
  for (var i = 0; i < number.c; i++) {
    var ballIndex = Math.floor(Math.random() * (astroidInfo.count)) + 0;
    var b = astroids.getAt(ballIndex);
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

var startSpaceScroll = function () {
  background.autoScroll(0, backgroundScrollVelocity);
};


var startGame = function () {
  startButton.destroy();
  playing = true;
  startSpaceScroll();
  renderAstroids();
  initExplosions();
  initShip();
  increaseLevel();
};

var destroyShip = function (sship, astroid) {
  console.log('Crash!!!');
  var explosion = explosions.getFirstExists(false);
  explosion.reset(sship.body.x - 30.0 , sship.body.y - 20.0);
  explosion.play('explode', 30, false, true);
  redrawBall(astroid);
};

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  initGameBackground();
  initStartButton();
  initAstroids();
  scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
  levelText = game.add.text(game.world.width - 70, 5, "Level: 1", textStyle);
}


function update() {
  keyboardInputHandler(sship);
  game.physics.arcade.collide(astroids, sship, destroyShip);
}


