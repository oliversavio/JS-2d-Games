/*----------------------------------
* Game Variables
*----------------------------------*/
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var ballspeed = 2.5;
var dx = Math.random() * (2.4 - 1) + 2.1;
var dy = -ballspeed;//-Math.random( ) * ballspeed;
var raidus = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var paddlePadding = 10;
var isGameStarted = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = []
var score = 0;
var level = 1;

var initBricks = function () {
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
};

/* Init Bricks Array */
initBricks();


function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

var drawBall = function () {
    ctx.beginPath();
    ctx.arc(x, y, raidus, 0, Math.PI * 2, false);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
};

var drawPaddle = function () {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

var collosion = function () {
    if (y + dy < 0 + raidus) {
        dy = -dy;
    }
    if (x + dx < 0 + raidus || x + dx > canvas.width - raidus) {
        dx = -dx;
    }
};

var brickCollisionDetection = function () {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += 1;
                    levelIncrease();
                }
            }
        }
    }
}

var drawScore = function () {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

var drawLevel = function() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: " + level, canvas.width - 80, 20);
}

var youWin = function() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("WINNER!", (canvas.width - paddleWidth) / 2, canvas.height / 2);
};

var levelIncrease = function(){
    if(score % 2 == 0) {
        level += 1;
        dx = dx * 1.25;
        dy = dy * 1.2;
    }
};

var isBallBewteenPaddle = function () {
    if (x > paddleX && x < (paddleX + paddleWidth)) {
        return true;
    } else {
        return false;
    }
};

var resetGame = function () {
    x = canvas.width / 2;
    y = canvas.height - 30;
    isGameStarted = false;
    dx = Math.random() * (2.4 - 0.5) + 2.1;
    dy = -ballspeed;
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
    level = 1;
    initBricks();
};

var triggerGameOver = function () {
    if (y + dy > canvas.height - raidus) {
        if (isBallBewteenPaddle()) {
            dy = -dy;
        } else {
            resetGame();
            alert('Game over');
        }
    }

    if(score == (brickColumnCount * brickRowCount)) {
        youWin();
        isGameStarted = false;
    }

};

var clearCanvas = function () { ctx.clearRect(0, 0, canvas.width, canvas.height); };

var moveBall = function () {
    if (isGameStarted) {
        x += dx;
        y += dy;
    }
};

var draw = function () {
    clearCanvas();
    
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLevel();
    collosion();
    brickCollisionDetection();
    triggerGameOver();
    keyInputPaddleHandler();
    moveBall();

    requestAnimationFrame(draw);
};

var keyDownHandler = function (e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    if (e.keyCode == 37) {
        leftPressed = true;
    }
    if (e.keyCode == 32) {
        isGameStarted = true;
    }
};

var keyUpHandler = function (e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    if (e.keyCode == 37) {
        leftPressed = false;
    }
};

var keyInputPaddleHandler = function () {
    if (rightPressed && paddleX < canvas.width - paddleWidth - paddlePadding) {
        paddleX += 7;
    } else if (leftPressed && paddleX > paddlePadding) {
        paddleX += -7;
    }
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

draw();