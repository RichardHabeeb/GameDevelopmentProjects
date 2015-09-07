

function createSvgUtl(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function randomInvertNumber(num) {
    return Math.random() > 0.5 ? num : -num;
}

function limitMaxValue(number, max) {
    return ((number < 0) ? -1 : 1) * Math.min(Math.abs(max), Math.abs(number));
}

function sqr(x) {
    return x * x;
}

function vector(setX, setY) {
    if (typeof setX === 'undefined') {
        setX = 0;
    }

    if (typeof setY === 'undefined') {
        setY = 0;
    }

    var that = {
        x: setX,
        y: setY
    };

    that.distToPointSquared = function(p) {
        return sqr(that.x - p.x) + sqr(that.y - p.y);
    }

    return that;
}

function line(setVector1, setVector2) {
    if (typeof setVector1 === 'undefined') {
        setVector1 = vector();
    }

    if (typeof setVector2 === 'undefined') {
        setVector2 = vector();
    }

    var that = {};

    that.vector1 = setVector1;
    that.vector2 = setVector2;

    var distToSegmentSquared = function (p, v, w) {
      var l2 = v.distToPointSquared(w);
      if (l2 == 0) return p.distToPointSquared(v);
      var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
      if (t < 0) return p.distToPointSquared(v);
      if (t > 1) return p.distToPointSquared(w);
      return p.distToPointSquared(vector(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y)));
    }

    that.distToSegment = function(p) {
        return Math.sqrt(distToSegmentSquared(p, that.vector1, that.vector2));
    }

    that.intersectsCircle = function(circleCenter, radius) {
        return radius >= that.distToSegment(circleCenter);
    }

    return that;
}

var gameState = {
    running: 0,
    leftScored: 1,
    rightScored: 2,
    paused: 3,
};
var pixelsPerMeter = 10;
var defaultBallSpeed = 20;
var defaultBallMass = 1;
var defaultBallRadius = 1;
function ball (setPosition) {
    var that = {};
    var domElement = createSvgUtl("circle");
    that.position = vector(setPosition.x, setPosition.y);
    that.velocity = vector(randomInvertNumber(defaultBallSpeed), defaultBallSpeed);
    that.appliedForce = vector(that.velocity.x * 0.1, that.velocity.y * 0.1);
    that.radius = defaultBallRadius;
    that.mass = defaultBallMass;

    that.draw = function () {
        domElement.setAttribute('r', that.radius * pixelsPerMeter);
        domElement.setAttribute('cx', that.position.x * pixelsPerMeter);
        domElement.setAttribute('cy', that.position.y * pixelsPerMeter);
    }

    that.attachTo = function (boardElement) {
        boardElement.appendChild(domElement);
    }

    that.detachFrom = function (boardElement) {
        boardElement.removeChild(domElement);
    }

    that.updateAndCheckLocation = function(elapsedTimeSeconds, boardSize, leftPlayer, rightPlayer) {
        var acceleration = vector(that.appliedForce.x * that.mass, that.appliedForce.y * that.mass);
        that.velocity.x += acceleration.x * elapsedTimeSeconds;
        that.velocity.y += acceleration.y * elapsedTimeSeconds;
        that.position.x += that.velocity.x * elapsedTimeSeconds;
        that.position.y += that.velocity.y * elapsedTimeSeconds;
        if(that.position.x > (boardSize.x - that.radius)) {
            return gameState.leftScored;
        }
        if(that.position.x < that.radius) {
            return gameState.rightScored;
        }
        if(line(vector(leftPlayer.position.x + leftPlayer.currentSize.x / 2, leftPlayer.position.y + leftPlayer.currentSize.y / 2),
                vector(leftPlayer.position.x + leftPlayer.currentSize.x / 2, leftPlayer.position.y - leftPlayer.currentSize.y / 2)).intersectsCircle(that.position, that.radius)) {
            that.position.x = leftPlayer.position.x + leftPlayer.currentSize.x / 2 + that.radius;
            that.velocity.x = -that.velocity.x;
            that.appliedForce.x = -that.appliedForce.x;
        }
        if(line(vector(rightPlayer.position.x - rightPlayer.currentSize.x / 2, rightPlayer.position.y + rightPlayer.currentSize.y / 2),
                vector(rightPlayer.position.x - rightPlayer.currentSize.x / 2, rightPlayer.position.y - rightPlayer.currentSize.y / 2)).intersectsCircle(that.position, that.radius)) {
            that.position.x = rightPlayer.position.x - rightPlayer.currentSize.x / 2 - that.radius;
            that.velocity.x = -that.velocity.x;
            that.appliedForce.x = -that.appliedForce.x;
        }
        if(that.position.y > (boardSize.y - that.radius)) {
            that.position.y = boardSize.y - that.radius;
            that.velocity.y = -that.velocity.y;
            that.appliedForce.y = -that.appliedForce.y;
        }
        if(that.position.y < that.radius) {
            that.position.y = that.radius;
            that.velocity.y = -that.velocity.y;
            that.appliedForce.y = -that.appliedForce.y;
        }
        return gameState.running;
    }

    return that;
}

var defaultPlayerSize = vector(2, 10);
var defaultPlayerMass = 1; //kg
var defaultPlayerMaxSpeed = 50;
function player (setPosition) {
    var that = {};
    var domElement = createSvgUtl("rect");

    that.currentSize = vector(defaultPlayerSize.x, defaultPlayerSize.y);
    that.position = vector(setPosition.x, setPosition.y);
    that.velocity = vector();
    that.appliedForce = vector();
    that.mass = defaultPlayerMass;
    that.maxSpeed = defaultPlayerMaxSpeed;

    that.draw = function() {
        domElement.setAttribute('width', that.currentSize.x * pixelsPerMeter);
        domElement.setAttribute('height', that.currentSize.y * pixelsPerMeter);
        domElement.setAttribute('x', (that.position.x - (that.currentSize.x / 2)) * pixelsPerMeter);
        domElement.setAttribute('y', (that.position.y - (that.currentSize.y / 2)) * pixelsPerMeter);
    }

    that.attachTo = function (boardElement) {
        boardElement.appendChild(domElement);
    }

    that.updateLocation = function(elapsedTimeSeconds, boardSize) {
        //that.maxSpeed += 1.1 * elapsedTimeSeconds;
        var acceleration = vector(that.appliedForce.x * that.mass, that.appliedForce.y * that.mass);
        that.velocity.x = limitMaxValue(that.velocity.x + acceleration.x * elapsedTimeSeconds, that.maxSpeed);
        that.velocity.y = limitMaxValue(that.velocity.y + acceleration.y * elapsedTimeSeconds, that.maxSpeed);
        that.position.x += that.velocity.x * elapsedTimeSeconds;
        that.position.y += that.velocity.y * elapsedTimeSeconds;
        if(that.position.x > (boardSize.x - that.currentSize.x / 2)) {
            that.position.x = boardSize.x - that.currentSize.x / 2;
            that.velocity.x = -that.velocity.x;
        }
        if(that.position.x < that.currentSize.x / 2) {
            that.position.x = that.currentSize.x / 2;
            that.velocity.x = -that.velocity.x;
        }
        if(that.position.y > (boardSize.y - that.currentSize.y / 2)) {
            that.position.y = boardSize.y - that.currentSize.y / 2;
            that.velocity.y = -that.velocity.y;
        }
        if(that.position.y < that.currentSize.y / 2) {
            that.position.y = that.currentSize.y / 2;
            that.velocity.y = -that.velocity.y;
        }

    }

    return that;
}

function aiController () {
    var that = {};
    var controlledPlayer = null;

    that.setPlayer = function(setControlledPlayer) {
        controlledPlayer = setControlledPlayer;
    }
    that.update = function (quaffle) {
        if(controlledPlayer == null || typeof controlledPlayer === 'undefined') return;
        if(quaffle.position.y < controlledPlayer.position.y) controlledPlayer.appliedForce.y = -200;
        if(quaffle.position.y > controlledPlayer.position.y) controlledPlayer.appliedForce.y = 200;
    }

    return that;
}

function keyboardController () {
    var that = {};
    var controlledPlayer = null;

    that.upKey = false;
    that.downKey = false;

    that.setPlayer = function(setControlledPlayer) {
        controlledPlayer = setControlledPlayer;
    }
    that.update = function() {
        if(controlledPlayer == null || typeof controlledPlayer === 'undefined') return;
        if(that.upKey && !that.downKey) controlledPlayer.appliedForce.y = -200;
        if(!that.upKey && that.downKey) controlledPlayer.appliedForce.y = 200;
    }

    return that;
}

function scoreText (setPosition) {
    var that = {};
    var score = 0;
    var domElement = createSvgUtl('text');

    that.position = vector(setPosition.x, setPosition.y);

    that.draw = function() {
        domElement.setAttribute('x', that.position.x * pixelsPerMeter);
        domElement.setAttribute('y', that.position.y * pixelsPerMeter);
        domElement.setAttribute('font-size', 5 * pixelsPerMeter);
        domElement.setAttribute('font-family', 'Roboto');
        domElement.setAttribute('font-weight', 900);
        domElement.setAttribute('fill', '#aaaaaa');
        domElement.innerHTML = score;
    }

    that.attachTo = function (boardElement) {
        boardElement.appendChild(domElement);
    }

    that.increment = function() {
        score++;
    }

    return that;
}

var defaultScoreBoardSize = vector(30, 11);
function scoreBoard (setPosition) {
    var that = {}
    that.position = vector(setPosition.x, setPosition.y);
    that.currentSize = vector(defaultScoreBoardSize.x, defaultScoreBoardSize.y);
    var leftScore = scoreText(vector(10, that.currentSize.y - 1));
    var rightScore = scoreText(vector(20, that.currentSize.y - 1));
    var domElement = createSvgUtl('svg');

    that.draw = function() {
        domElement.setAttribute('width', that.currentSize.x * pixelsPerMeter);
        domElement.setAttribute('height', that.currentSize.y * pixelsPerMeter);
        domElement.setAttribute('x', (that.position.x - (that.currentSize.x / 2)) * pixelsPerMeter);
        domElement.setAttribute('y', (that.position.y - (that.currentSize.y)) * pixelsPerMeter);
        domElement.setAttribute('fill', 'none');
        leftScore.draw();
        rightScore.draw();
    }

    that.attachTo = function (boardElement) {
        leftScore.attachTo(domElement);
        rightScore.attachTo(domElement);
        boardElement.appendChild(domElement);
    }

    that.addScore = function(state) {
        if(state == gameState.leftScored) leftScore.increment();
        if(state == gameState.rightScored) rightScore.increment();
    }

    return that;
}

function gameBoard (setSize, leftPlayerController, rightPlayerController) {
    var that = {};
    var size = setSize;
    var leftPlayer = player(vector(defaultPlayerSize.x / 2, (size.y - defaultPlayerSize.y / 2) / 2));
    var rightPlayer = player(vector(size.x - defaultPlayerSize.x / 2, (size.y - defaultPlayerSize.y / 2) / 2));
    var containerElement = document.getElementById('pongGame');
    var domElement = createSvgUtl('svg');
    var previousTimeStamp = null;
    var quaffle = ball(vector(size.x / 2, 0));
    var score = scoreBoard(vector(size.x / 2, defaultScoreBoardSize.y / 2));

    var update = function (elapsedTimeSeconds) {
        leftPlayerController.update(quaffle);
        rightPlayerController.update(quaffle);
        leftPlayer.updateLocation(elapsedTimeSeconds, size);
        rightPlayer.updateLocation(elapsedTimeSeconds, size);
        var state = quaffle.updateAndCheckLocation(elapsedTimeSeconds, size, leftPlayer, rightPlayer);
        if(state == gameState.leftScored || state == gameState.rightScored) {
            quaffle.detachFrom(domElement);
            quaffle = ball(vector(size.x / 2, 0));
            quaffle.attachTo(domElement);
            score.addScore(state);
        }
    }

    var render = function () {
        leftPlayer.draw();
        rightPlayer.draw();
        quaffle.draw();
        score.draw();
    }

    var loop = function (timeStamp) {
        if(!previousTimeStamp) previousTimeStamp = timeStamp;
        var elapsedTimeSeconds = (timeStamp - previousTimeStamp) / 1000.0;
        update(elapsedTimeSeconds);
        render();
        window.requestAnimationFrame(loop);
        previousTimeStamp = timeStamp;
    }

    that.run = function () {
        leftPlayerController.setPlayer(leftPlayer);
        rightPlayerController.setPlayer(rightPlayer);
        domElement.setAttribute('width', size.x * pixelsPerMeter);
        domElement.setAttribute('height', size.y * pixelsPerMeter);
        containerElement.appendChild(domElement);
        leftPlayer.attachTo(domElement);
        rightPlayer.attachTo(domElement);
        quaffle.attachTo(domElement);
        score.attachTo(domElement);
        window.requestAnimationFrame(loop);
    }

    return  that;
}


window.onload = function () {
    var boardSize = vector(120, 50);
    var leftController = keyboardController();
    var rightController = aiController();
    var game = gameBoard(boardSize, leftController, rightController);

    game.run();

    window.onkeydown = function (e) {
        var key = e.which || e.keyCode;
        if(key == 87 && !(leftController.upKey === 'undefined')) { //w
            leftController.upKey = true;
        }
        if(key == 83 && !(leftController.downKey === 'undefined')) { //s
            leftController.downKey = true;
        }
        if(key == 38 && !(rightController.upKey === 'undefined')) { //w
            rightController.upKey = true;
        }
        if(key == 40 && !(rightController.downKey === 'undefined')) { //s
            rightController.downKey = true;
        }
    }

    window.onkeyup = function (e) {
        var key = e.which || e.keyCode;
        if(key == 87 && !(leftController.upKey === 'undefined')) { //w
            leftController.upKey = false;
        }
        if(key == 83 && !(leftController.downKey === 'undefined')) { //s
            leftController.downKey = false;
        }
        if(key == 38 && !(rightController.upKey === 'undefined')) { //w
            rightController.upKey = false;
        }
        if(key == 40 && !(rightController.downKey === 'undefined')) { //s
            rightController.downKey = false;
        }
    }
}
