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
'''javascript
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
'''