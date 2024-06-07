# THE FLAPPY BIRD GAME

## CS50
>This is my final project for the CS50 Introduction to Computer Sciense course.
> CSS, HTML, JavaScript

## Features
- CSS
- HTML
- JaveScript

Well, I use the normall CSS, HTML and especialy JavaScript. By using the canvas tag I can draw 2d objets in order to put in the game.

## Describe How it works
My project is a game. And that game is mimic the famous Flappy Bird game made by Nguyen Ha Dong.
It has 3 stages:
- The Start GUI when you first lauch the game.
- The ingame experience you enjoy.
- The GameOver GUI when you hit obstacles and die.

### I need to have variables for the game like velocity, speed, rectangles for checking collision.
```javascript
```javascript
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
```
### Create and draw images on screen when windown load
```javascript
window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //flappy bird text
    flappyTextImg = new Image();
    flappyTextImg.src = "./images/Flappy-Bird-Transparent.png";
    flappyTextImg.onload = function() {
        context.drawImage(flappyTextImg, flappyTextX, flappyTextY, flappyTextWidth, flappyTextHeight);
    }



    //load images
    birdImg = new Image();
    birdImg.src = "./images/flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./images/bottompipe.png";

    //ground image
    groundImg = new Image();
    groundImg.src = "./images/ground.png";
    groundImg.onload = function() {
        context.drawImage(groundImg, ground.x, ground.y, ground.width, ground.height);
    }

    //start button
    startButtonImg = new Image();
    startButtonImg.src = "./images/startButton.png"
    startButtonImg.onload = function() {
        context.drawImage(startButtonImg, startButton.x, startButton.y, startButton.width, startButton.height);
    }
    
    // Sounds
    backgroundMusic = new Audio("./music/theme.m4a");
    flapSound = new Audio("./music/flap.mp3");
    hitSound = new Audio("./music/hitdie.mp3");
    pointSound = new Audio("./music/point.mp3");
    clickSound = new Audio("./music/clicksound.mp3");

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
```
This will draw the flappy bird image, start button,the game welcome text and also add audios for later use.
Especialy it will start the game by listen for the click on start button image, arrowkeys, space in order to start game by many ways.
the boolean variable "gameStart" will turn true means that the game is running, the background theme is played by "clickSound.play()" and it will call the function "startGame()".

### Create a funciton that update the frames
In order to create a game we must update it frame to cause the bird and pipes moving.
```javascript
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
        flappyTextImg.src = "./images/gameOver.png";
        gameOverImg.onload = function() {
            context.drawImage(gameOverImg, gameOverX, gameOverY, gameOverWidth, gameOverHeight);
        };
    }
}
```
This will enable us to play the game. The principles is kinda simple first we have to make the if statement to check if the "gameOver" variable is true or not, if true we return the funtion and stop the game.
Now we have to clear the previous frame by using context.clearRect.
Then the screen will display the bird moving by using velocityY keep the bird falling but if we press space or up arrow it will flap up.
The pips then will be display on the screen and move towards the bird with random height.
The pips will be store in an "pipArray" and then is pop out when it reach the end of the screen in order to control the memory.

### Other functions that are used in the game
```javascript
function startGame() {
    if (gameStart) {
        requestAnimationFrame(update);
        setInterval(placePipes, 1500); //every 1.5 seconds
        document.addEventListener("keydown", moveBird);
        backgroundMusic.loop = true;
        backgroundMusic.play();
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
```
Well they are the functions that we call in the update() function and the anonymous function in windown.onload.
They are:
- Function startGame() to start the game.
- Function placePipes() to place the pipes at random height.
- Function moveBird(e) to move the bird and play sound when it flap.
- Function detectCollision(a, b) to dectect the Collision between two sprites.


## About CS50
CS50 is an open online course from Harvard University, taught by David J. Malan.

The course introduces the intellectual enterprises of computer science and the art of programming. It teaches students to think algorithmically and solve problems efficiently. Topics covered include abstraction, algorithms, data structures, encapsulation, resource management, security, and software engineering. The course uses languages such as C, Python, and SQL, and offers optional modules in HTML, CSS, and JavaScript for web development.

Thank you for all CS50 my friends for the amazing journey.

- Where I get CS50 course?
https://cs50.harvard.edu/x/2020/