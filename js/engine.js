var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;
       
    canvas.style.backgroundColor = "#000";
    canvas.width = 800;
    canvas.height = 500;
    // I will reposition the canvas for layout reasons
    document.getElementById('gameboard').appendChild(canvas);
    /* Assign the canvas' context object to the global variable (the window object when run in a browser) so that developers can use it more easily from within their app.js files.
     */
    global.ctx = ctx;

    // turn the Key and our engine will start to run
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function serves as the kickoff point for the game loop itself 
    and handles properly calling the update and render methods.
    */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now();
        var dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    // the update function will update every single object at each tick
    function update(dt) {
        // game.state === 1, the game is active and running
        if(game.state === 1) {
            // monitor if our ball reaches the corners of our canvas
            ball.edge(canvas);

            // collision between ball, playerPaddle or aiPaddle?
            var paddleBasket = [playerPaddle, aiPaddle];
            for(var i = 0; i < paddleBasket.length; i++) {
                if(collide.boxonbox(ball, paddleBasket[i])) {
                    ball.speedX *= -1;
                }
            }

            // monitor for keyboard inputs on the playerPaddle
            playerPaddle.handleControl();

            // monitor the aiPaddle movement
            aiPaddle.ai(canvas);

            // Update the ball
            ball.move();
        }
        // game.state === 0, the mainscreen is showing
        else if(game.state === 0) {
            game.selectorHandler();
        }
        // game.state === 2, the how to play screen is showing
        else if(game.state === 2) {
            if(keyState[10]) {
                game.state = 0;
            }
        }
        // game.state === 3, the credits screen is showing
        else if(game.state === 3) {
            if(keyState[10]) {
                game.state = 0;
            }
        }
        
    }

    // the render function will redraw every single object each tick
    function render() {

        // game.state === 1, the game is active and running
        if(game.state === 1) {
            // Erase the canvas
            ctx.clearRect(0,0,canvas.width,canvas.height);
            // Redraw the scoreboard
            game.write(game.scorePlayer, canvas.width/2 - 50, 30);
            game.write(game.scoreAi, canvas.width/2 + 50, 30);
            // Redraw the ball
            ball.draw();
            // Redraw the playerPaddle
            playerPaddle.draw();
            // Redraw the aiPaddle
            aiPaddle.draw();
        }
        
        // game.state === 0, the main screen is active
        else if(game.state === 0) {
            // Erase the canvas
            ctx.clearRect(0,0,canvas.width,canvas.height);
            picasso.write("80px", "Verdana", "#FFD700", 290, 150, "Pong");
            picasso.write("20px", "Verdana", "#fff", 290, 180, "classic arcade");
            picasso.write("30px", "Verdana", "#fff", 320, 300, "New Game");
            picasso.write("30px", "Verdana", "#fff", 320, 350, "How to Play");
            picasso.write("30px", "Verdana", "#fff", 320, 400, "Credits");
            picasso.write("15px", "Verdana", "#fff", 200, 480, "(Up and Down Arrow to move, Spacebar to select)");
            // draw the selector
            selector.draw();
        }
        
        // game.state === 2, the how to play screen is showing
        else if(game.state === 2) {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            picasso.write("40px", "Verdana", "#FFD700", 290, 50, "How to Play");
            picasso.write("25px", "Verdana", "#fff", 50, 120, "Overview:");
            picasso.line(50, 125, 180, 125, 2, "#fff");
            picasso.write("20px", "Verdana", "#fff", 50, 155, "Move the up and down arrows on your keyboard");
            picasso.write("20px", "Verdana", "#fff", 50, 185, "to move the paddle and hit the ball.");
            
            picasso.write("25px", "Verdana", "#fff", 50, 240, "Controls:");
            picasso.line(50, 245, 170, 245, 2, "#fff");
            picasso.write("20px", "Verdana", "#fff", 50, 275, "Up Arrow:");
            picasso.write("20px", "Verdana", "#fff", 50, 305, "Down Arrow:");
            picasso.write("20px", "Verdana", "#fff", 50, 335, "Press P to:");
            picasso.write("20px", "Verdana", "#fff", 50, 365, "Press Esc to:");
            
            picasso.write("20px", "Verdana", "#fff", 250, 275, "Paddle will move upwards");
            picasso.write("20px", "Verdana", "#fff", 250, 305, "Paddle will move downwards");
            picasso.write("20px", "Verdana", "#fff", 250, 335, "Pause the game");
            picasso.write("20px", "Verdana", "#fff", 250, 365, "go back to mainscreen");
            
            picasso.write("15px", "Verdana", "#fff", 300, 480, "(Press Escape to return)");
        }
        
        // game.state === 3, the Credits screen is showing
        else if(game.state === 3) {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            picasso.write("40px", "Verdana", "#FFD700", 330, 50, "Credits");
            picasso.write("15px", "Verdana", "#fff", 180, 140, "coding and design:");
            picasso.write("15px", "Verdana", "#fff", 380, 140, "by Juergen 'Anskiere' Mayer");
            picasso.write("15px", "Verdana", "#fff", 180, 170, "Ingredients:");
            picasso.write("15px", "Verdana", "#fff", 380, 170, "tiny bits of css");
            picasso.write("15px", "Verdana", "#fff", 380, 200, "the good old Html canvas");
            picasso.write("15px", "Verdana", "#fff", 380, 230, "huge chunks of vanilla JavaScript");
            picasso.write("15px", "Verdana", "#fff", 180, 260, "Purpose:");
            picasso.write("15px", "Verdana", "#fff", 380, 260, "My purpose with this project was building my skills");
            picasso.write("15px", "Verdana", "#fff", 380, 290, "on object oriented JavaScript.");
            
            picasso.write("15px", "Verdana", "#fff", 300, 480, "(Press Escape to return)");
        }
        
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        
    }

    // Let'S fire the engine
    init();

}(this));