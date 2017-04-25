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

    // the render function will redraw every single object each tick
    function render() {
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

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        
    }

    // Let'S fire the engine
    init();

}(this));