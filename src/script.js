//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

//ground
let groundWidth = 360;
let groundHeight = 63;
let groundX = 0;
let groundY = 577;
let groundImg;

let ground = {
    x : groundX,
    y : groundY,
    width : groundWidth,
    height : groundHeight
}

// flappy bird text
let flappyTextWidth = 987 / 4;
let flappyTextHeight = 259 / 4;
let flappyTextX = boardWidth / 2 - flappyTextWidth / 2 ;
let flappyTextY = boardHeight / 4;
let flappyTextImg;

// flappy bird text
let gameOverWidth = 1238 / 4;
let gameOverHeight = 340 / 4;
let gameOverX = boardWidth / 2 - flappyTextWidth / 2 ;
let gameOverY = boardHeight / 4;
let gameOverImg;

//start button 
let startButtonWidth = 407;
let startButtonHeight = 150;
let startButtonX = boardWidth / 2 - startButtonWidth / 8;
let startButtonY = boardHeight - (boardHeight / 3);
let startButtonImg;

let startButton = {
    x : startButtonX,
    y : startButtonY,
    width : startButtonWidth / 4,
    height : startButtonHeight / 4
}


let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameStart = false;
let gameOver = false;
let score = 0;
let bestScore = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //flappy bird text
    flappyTextImg = new Image();
    flappyTextImg.src = "images/Flappy-Bird-Transparent.png";
    flappyTextImg.onload = function() {
        context.drawImage(flappyTextImg, flappyTextX, flappyTextY, flappyTextWidth, flappyTextHeight);
    }



    //load images
    birdImg = new Image();
    birdImg.src = "images/flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "images/bottompipe.png";

    //ground image
    groundImg = new Image();
    groundImg.src = "images/ground.png";
    groundImg.onload = function() {
        context.drawImage(groundImg, ground.x, ground.y, ground.width, ground.height);
    }

    //start button
    startButtonImg = new Image();
    startButtonImg.src = "images/startButton.png"
    startButtonImg.onload = function() {
        context.drawImage(startButtonImg, startButton.x, startButton.y, startButton.width, startButton.height);
    }
    
    // Sounds
    backgroundMusic = new Audio("music/theme.m4a");
    flapSound = new Audio("music/flap.mp3");
    hitSound = new Audio("music/hitdie.mp3");
    pointSound = new Audio("music/point.mp3");
    clickSound = new Audio("music/clicksound.mp3");

    board.addEventListener("click", function(event) {
        var rect = board.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;

        if (x >= startButton.x && x <= startButton.x + startButton.width &&
            y >= startButton.y && y <= startButton.y + startButton.height) {
            gameStart = true;
            clickSound.play();
            startGame();
        }
    });

    document.addEventListener("keydown", function(event) {
        if (!gameStart && (event.code === 'Space' || 
            event.code === 'ArrowUp' || event.code === 'ArrowDown' 
            || event.code === 'ArrowLeft' || event.code === 'ArrowRight')) {
            gameStart = true;
            clickSound.play()
            startGame();
        }
    });

}

function startGame() {
    if (gameStart) {
        requestAnimationFrame(update);
        setInterval(placePipes, 1500); //every 1.5 seconds
        document.addEventListener("keydown", moveBird);
        backgroundMusic.loop = true;
        backgroundMusic.play();
    }
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        backgroundMusic.pause();
        hitSound.play();
        setTimeout(function() {
            hitSound.pause();
        }, 500);
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    
    //bird
    velocityY += gravity;

    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pointSound.play();
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font="45px flappybird";
    context.fillText(score, 5, 45);
    context.strokeStyle = "black";
    context.strokeText(score, 5, 45);

    //ground 
    context.drawImage(groundImg, ground.x, ground.y, ground.width, ground.height);
    if (detectCollision(bird, ground)) {
        gameOver = true;
    }

    if (gameOver) {
        bestScore = Math.max(bestScore, score);
        context.fillText("BEST SCORE: " + bestScore, 30, boardHeight/2);
        context.strokeText("BEST SCORE: " + bestScore, 30, boardHeight/2);
        context.fillText("SCORE: " + score, 30, boardHeight/2 + 80);
        context.strokeText("SCORE: " + score, 30, boardHeight/2 + 80);
        //gameOver text
        gameOverImg = new Image();
        flappyTextImg.src = "images/gameOver.png";
        gameOverImg.onload = function() {
            context.drawImage(gameOverImg, gameOverX, gameOverY, gameOverWidth, gameOverHeight);
        };
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -6;
        flapSound.play();

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}