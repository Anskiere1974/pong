// --------------------------------------------------------------------
//                            Declaring Objects
// --------------------------------------------------------------------

// ********************************************************************
//                            Game
// ********************************************************************
// in Game we will store our game relevant data like score, and helper classes to control the scoreboard

var Game = function() {
  this.scorePlayer = 0; // Player score
  this.scoreAi = 0; // Ai score
  // Our Game can be in different states:
  // 0: Main Screen
  // 1: Game is active
  // 2: How to Play
  // 3: Credits
  this.state = 0;
  // On the mainscreen you can chose from different menue items
  // 0: New Game
  // 1: How to play
  // 2: Credits
  this.menuestate = 0;
 };
// write will write messages on a given x and y
Game.prototype.write = function(message, posX, posY) {
        ctx.font = '25px "Arial"';
        ctx.textAlign = 'center';
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.strokeText(message, posX, posY);
        ctx.fillStyle = "#fff";
        ctx.fillText(message, posX, posY);        
    };

// add aiScores will add one point to the ai score
Game.prototype.aiScores = function() {
    this.scoreAi++;
};

// add playerScores() will add one point to the player score
Game.prototype.playerScores = function() {
    this.scorePlayer++;
};

Game.prototype.selectorHandler = function() {
    // Using the Up arrow
    if(keyState[1]) {
        if(this.menuestate < 2) {
            this.menuestate++;
            keyState[1] = false;
        }
    }
    // using the Down Arrow
    else if(keyState[0]) {
        if(this.menuestate > 0) {
            this.menuestate--;
            keyState[0] = false;
            console.log(this.menuestate);
        }
    }
    // getting the y pos for the selector according to the menuestate
    switch(this.menuestate) {
    case 0:
        selector.y = 282;
        break;
    case 1:
        selector.y = 332;
        break;
    case 2:
        selector.y = 382;
        break;
    }
    
    if(keyState[9]) {
        switch(this.menuestate) {
    case 0:
        this.scorePlayer = 0; // Player score set to zero
        this.scoreAi = 0; // Ai score set to zero
        this.state = 1;
        break;
    case 1:
        this.state = 2;
        break;
    case 2:
        this.state = 3;
        break;
        }
    }
    
};

// ********************************************************************
//                            Entity
// ********************************************************************
// Entity will act as a superclass for Ball

var Entity = function(x, y, width, height, color, speedX, speedY) {
  this.x = x; // X-Position of the Topleft corner
  this.y = y; // Y-Position of the Topleft corner
  this.width = width; //width of our Entity
  this.height = height; //height of our Entity
  this.color = color; //chosen color for drawing the Entity
  this.speedX = speedX; // speed in X direction
  this.speedY = speedY; // speed in Y direction
};

//Entity.draw() will render a rectangle with given params
Entity.prototype.draw = function() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

//Entity.move() will move our object with a given x and y speed
Entity.prototype.move = function() {
    this.x += this.speedX;
    this.y += this.speedY;
};
// Entity.reset() will reset our object to the given coordinates
Entity.prototype.reset = function(x, y) {
    this.x = x;
    this.y = y;
};

// ********************************************************************
//                            Ball
// ********************************************************************
// Ball will act as a subclass of Entity

var Ball = function(x, y, width, height, color, speedX, speedY) {
  Entity.call(this, x, y, width, height, color, speedX, speedY); // this line connects to the properties in the responding superclass
};

Ball.prototype = Object.create(Entity.prototype); // Let's connect to the prototype of the superclass
Ball.prototype.constructor = Ball;

// Ball.edge() will monitor if our ball reaches the borders of the gameboard
Ball.prototype.edge = function(canvas) {
    // watch the upper edge
    if(this.y + this.speedY <= 0 ) {
        this.speedY *= -1;
    }
    // watch the bottom edge
    if(this.y + this.height + this.speedY >= canvas.height) {
        this.speedY *= -1;
    }
    // watch the left edge
    if (this.x + this.speedX <= 0) {
        this.reset((canvas.width / 2) - (this.width / 2), (canvas.height / 2) - (this.height / 2)); // reset the ball to the kickoff point
        game.aiScores();
    }
    // watch the right side
    if (this.x + this.width + this.speedX >= canvas.width) {
        this.reset((canvas.width / 2) - (this.width / 2), (canvas.height / 2) - (this.height / 2)); // reset the ball to the kickoff point
        game.playerScores();
    }
};

// ********************************************************************
//                            Paddle
// ********************************************************************
// Paddle is a subclass of Enitity
// Paddle is a superclass for PlayerPaddle and AiPaddle

var Paddle = function(x, y, width, height, color, speedX, speedY) {
  Entity.call(this, x, y, width, height, color, speedX, speedY); // this line connects to the properties in the responding superclass
};

Paddle.prototype = Object.create(Entity.prototype); // Let's connect to the prototype of the superclass
Paddle.prototype.constructor = Paddle;

// ********************************************************************
//                            PlayerPaddle
// ********************************************************************
// PlayerPaddle is a subclass of Paddle

var PlayerPaddle = function(x, y, width, height, color, speedX, speedY) {
  Paddle.call(this, x, y, width, height, color, speedX, speedY); // this line connects to the properties in the responding superclass
};

PlayerPaddle.prototype = Object.create(Paddle.prototype); // Let's connect to the prototype of the superclass
PlayerPaddle.prototype.constructor = PlayerPaddle;

// PlayerPaddle.handleControl() will update the ball's speed acording to keyboard input
PlayerPaddle.prototype.handleControl = function() {
    // move the PlayerPaddle upwards but not out of the canvas
    if(keyState[0] && this.y > Math.abs(this.speedY)){
        if(this.speedY > 0) {
            this.speedY *= -1;
        }
        this.move();
    }
     if(keyState[1] && this.y + this.height + Math.abs(this.speedY) < 500){
        if(this.speedY < 0) {
            this.speedY *= -1;
        }
        this.move();
    }
    
    // pressing escape will show up the mainscreen 
    if(keyState[10]) {
        game.state = 0;
    }
};

// ********************************************************************
//                            AiPaddle
// ********************************************************************
// AiPaddle is a subclass of Paddle

var AiPaddle = function(x, y, width, height, color, speedX, speedY) {
  Paddle.call(this, x, y, width, height, color, speedX, speedY); // this line connects to the properties in the responding superclass
};

AiPaddle.prototype = Object.create(Paddle.prototype); // Let's connect to the prototype of the superclass
AiPaddle.prototype.constructor = AiPaddle;

// AiPaddle.ai() will control the movement of the AiPaddle
AiPaddle.prototype.ai = function(canvas) {
    // first we check if the ball is in the half of the aiPaddle and moving towards the ai
    if (ball.x > canvas.width / 2 && ball.speedX > 0) {
        // Now we try to bring the center of the aiPaddle in height of the incoming ball
        if((this.y + this.height*0.5) < ball.y) {
            if(this.y + this.height + Math.abs(this.speedY) < canvas.height){
                this.speedY = Math.abs(this.speedY);
                this.move();
            }
        }
        else {
            if(this.y > Math.abs(this.speedY)){
                this.speedY = Math.abs(this.speedY)*-1;
                this.move();
            }
        }
    }
    else {
    // we move the ball to the center of his side
        if(this.y + this.height * 0.5 < canvas.height * 0.5 - (this.speedY + 1)) {
            this.speedY = Math.abs(this.speedY);
            this.move();
        }
        else if(this.y + this.height * 0.5 > canvas.height * 0.5 + (this.speedY + 1)) {
            this.speedY = Math.abs(this.speedY)*-1;
            this.move(); 
        }
    }
};

// --------------------------------------------------------------------
//                            Instantiation
// --------------------------------------------------------------------
// Now it's time to instantiate our new objects
// Create a new Game
var game = new Game();
// Create a ball
var ball = new Ball(395, 245, 10, 10, "#ffd700", -3, -4);
// Create a playerPaddle
var playerPaddle = new PlayerPaddle(10, 200, 10, 100, "#fff", 0, -3);
// Create an AiPaddle
var aiPaddle = new AiPaddle(780, 200, 10, 100, "#fff", 0, -3.2);
// Create a selector (used in the mainscreen to select items)
var selector = new Ball(290, 382, 15, 15, "#ffd700", 0, 20);


// --------------------------------------------------------------------
//                            Keyboard Input
// --------------------------------------------------------------------
// The following code will listen for keyboard input
// The information is used to move the PlayerPaddle up and down
// To keep things clean and tidy I wrapped the keyboard Input code into an IIFE
// only the keyState[] will be handed back to the gobal object
// I can easily reuse this code in other games.
// ToDo: Add Escape, Shift, Alt, Tab, Enter, Spacebar to the library
// ToDo: Add 0-9 to the library

(function(global){

// Pressed buttons can be defined and initialized with boolean variables, like so.
// We will store all keyevents in an array called keyState.
var keyState = [false,  // keyState[0] will monitor ASCII Keycode 38 (Up Arrow)
                false,  // keyState[1] will monitor ASCII Keycode 40 (Down Arrow)
                false,  // keyState[2] will monitor ASCII Keycode 37 (Left Arrow)
                false,  // keyState[3] will monitor ASCII Keycode 39 (Right Arrow)
                false,  // keyState[4] will monitor ASCII Keycode 87 (W)
                false,  // keyState[5] will monitor ASCII Keycode 83 (A)
                false,  // keyState[6] will monitor ASCII Keycode 65 (S)
                false,  // keyState[7] will monitor ASCII Keycode 68 (D)
                false,  // keyState[8] will monitor ASCII Keycode 80 (P)
                false,  // keyState[9] will monitor ASCII Keycode 32 (Spacebar)
                false,  // keyState[10] will monitor ASCII Keycode 27 (Escape)
               ];

// The default value for both is false because at the beginning the control buttons are not pressed. 
// To listen for key presses, we will set up two event listeners.
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// When the keydown event is fired on any of the keys on your keyboard (when they are pressed), the keyDownHandler() function will be executed. 
// The same pattern is true for the second listener: keyup events will fire the keyUpHandler() function (when the keys stop being pressed).
// Let's take a closer look at keyDownHandler and keyUpHandler.

function keyDownHandler(e) {
    if(e.keyCode == 38) { // 38 is the ASCII Keycode for the Up Arrow
        keyState[0] = true;
    }
    else if(e.keyCode == 40) { // 40 is the ASCII Keycode for the Down Arrow
        keyState[1] = true;
    }
    else if(e.keyCode == 37) { // 37 is the ASCII Keycode for the Left Arrow
        keyState[2] = true;
    }
    else if(e.keyCode == 39) { // 39 is the ASCII Keycode for the Right Arrow
        keyState[3] = true;
    }
    else if(e.keyCode == 87) { // 87 is the ASCII Keycode for "W"
        keyState[4] = true;
    }
    else if(e.keyCode == 83) { // 83 is the ASCII Keycode for "A"
        keyState[5] = true;
    }
    else if(e.keyCode == 65) { // 65 is the ASCII Keycode for "S"
        keyState[6] = true;
    }
    else if(e.keyCode == 68) { // 68 is the ASCII Keycode for "D"
        keyState[7] = true;
    }
    else if(e.keyCode == 80) { // 80 is the ASCII Keycode for "P"
        keyState[8] = true;
    }
    else if(e.keyCode == 32) { // 32 is the ASCII Keycode for "Spacebar"
        keyState[9] = true;
    }
    else if(e.keyCode == 27) { // 27 is the ASCII Keycode for "Escape"
        keyState[10] = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 38) { // 38 is the ASCII Keycode for the Up Arrow
        keyState[0] = false;
    }
    else if(e.keyCode == 40) { // 40 is the ASCII Keycode for the Down Arrow
        keyState[1] = false;
    }
    else if(e.keyCode == 37) { // 37 is the ASCII Keycode for the Left Arrow
        keyState[2] = false;
    }
    else if(e.keyCode == 39) { // 39 is the ASCII Keycode for the Right Arrow
        keyState[3] = false;
    }
    else if(e.keyCode == 87) { // 87 is the ASCII Keycode for "W"
        keyState[4] = false;
    }
    else if(e.keyCode == 83) { // 83 is the ASCII Keycode for "A"
        keyState[5] = false;
    }
    else if(e.keyCode == 65) { // 65 is the ASCII Keycode for "S"
        keyState[6] = false;
    }
    else if(e.keyCode == 68) { // 68 is the ASCII Keycode for "D"
        keyState[7] = false;
    }
    else if(e.keyCode == 80) { // 80 is the ASCII Keycode for "P"
        keyState[8] = false;
    }
    else if(e.keyCode == 32) { // 32 is the ASCII Keycode for "Spacebar"
        keyState[9] = false;
    }
    else if(e.keyCode == 27) { // 27 is the ASCII Keycode for "Escape"
        keyState[10] = false;
    }
}  
    
// Assign the keystate array to the global variable (the window object when run in a browser) so that developers can use it more easily from within their app.js files.
global.keyState = keyState;
    
}(this));

// --------------------------------------------------------------------
//                            Collision Detection
// --------------------------------------------------------------------
// I will define an object collide{}, filled with different methods for collision detection
// this object will be a starting point for a small reusable library on collision detection
// ToDo: circle on circle collision
// ToDo: point on circle collision
// ToDo: point on box collision
// ToDo: line intersections

var collide = {
    // The boxonbox() follows the AABB model as described on https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    // The algorithm works by ensuring there is no gap between any of the 4 sides of the rectangles. Any gap means a collision does not exist.
    boxonbox: function(box1, box2) {
    return (box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.height + box1.y > box2.y);
    }
};

// --------------------------------------------------------------------
//         Picasso - a drawing library - just like the artist
// --------------------------------------------------------------------
// I will define an object picasso{}, filled with different methods for drawing objects and working with them
// this object will be a starting point for a small reusable library on drawing

var picasso = {
    //box() will draw a rectangle
    // _x and _y are the coords
    // _width and _height of the box
    // _color for the color
    box: function(_x, _y, _width, _height, _color) {
        ctx.beginPath();
        ctx.rect(_x, _y, _width, _height);
        ctx.fillStyle = _color;
        ctx.fill();
        ctx.closePath();
    },
    
    // ellipse() will draw an ellipse/ circle
    // x and y coordinates of the arc's center
    // arc radius
    // color of the arc
    ellipse: function(_x, _y, _radius, _color) {
    ctx.beginPath();
    ctx.arc(_x, _y, _radius, 0, Math.PI*2, false);
    ctx.fillStyle = _color;
    ctx.fill();
    ctx.closePath();
    },
    
    // ring() will draw an ellipse/circle with just an outline
    // Instead of using fill() and filling the shapes with colors, we can use stroke() to only colour the outer stroke. Try adding this code to your JavaScript too:
    ring: function(_x, _y, _radius, _color, _lineWidth) {
        ctx.beginPath();
        ctx.arc(_x, _y, _radius, 0, Math.PI*2, false);
        ctx.lineWidth = _lineWidth;
        ctx.strokeStyle = _color;
        ctx.stroke();
        ctx.closePath();
    },
    
    // line() will draw a line from A to B
    line: function(_aX, _aY, _bX, _bY, _lineWidth, _color) {
         ctx.beginPath();
         ctx.moveTo(_aX, _aY);
         ctx.lineTo(_bX, _bY);
         ctx.lineWidth = _lineWidth;
         ctx.strokeStyle = _color;
         ctx.stroke();
    },
    
    // for writing out various messages we define our own pen
    // _fontSize, _font, _color, _posX, _posY, _message
    write: function(_fontSize, _font, _color, _posX, _posY, _message) {
        ctx.font = _fontSize + " " + _font;
        ctx.textAlign = 'left';
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.strokeText(_message, _posX, _posY);
        ctx.fillStyle = _color;
        ctx.fillText(_message, _posX, _posY);
    }
        
};



