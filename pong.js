

function createSvgUtl(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function randomInvertNumber(num) {
    return Math.random() > 0.5 ? num : -num;
}

function limitMaxValue(number, max) {
    var test = Math.min(Math.abs(max), Math.abs(number));
    return ((number < 0) ? -1 : 1) * Math.min(Math.abs(max), Math.abs(number));
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

    that.angle = function () {

    }

    that.length = function () {

    }

    return that;
}

var pixelsPerMeter = 10;
var defaultBallSpeed = 20;
var defaultBallMass = 1;
var defaultBallRadius = 1;
function ball (setPosition) {
    var that = {};
    var domElement = createSvgUtl("circle");
    that.position = vector(setPosition.x, setPosition.y);
    that.velocity = vector(randomInvertNumber(defaultBallSpeed), defaultBallSpeed);
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

    that.updateLocation = function(elapsedTimeSeconds, boardSize) {
        that.position.x += that.velocity.x * elapsedTimeSeconds;
        that.position.y += that.velocity.y * elapsedTimeSeconds;
        if(that.position.x > (boardSize.x - that.radius)) {
            that.position.x = boardSize.x - that.radius;
            that.velocity.x = -that.velocity.x;
        }
        if(that.position.x < that.radius) {
            that.position.x = that.radius;
            that.velocity.x = -that.velocity.x;
        }
        if(that.position.y > (boardSize.y - that.radius)) {
            that.position.y = boardSize.y - that.radius;
            that.velocity.y = -that.velocity.y;
        }
        if(that.position.y < that.radius) {
            that.position.y = that.radius;
            that.velocity.y = -that.velocity.y;
        }
    }

    return that;
}

var defaultPlayerSize = vector(2, 10);
var defaultPlayerMass = 1; //kg
var defaultPlayerMaxSpeed = 40;
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

function artificialPlayer (controlledPlayer, quaffle) {
    var that = {};

    that.update = function () {
        if(quaffle.position.y < controlledPlayer.position.y) controlledPlayer.appliedForce.y = -100;
        if(quaffle.position.y > controlledPlayer.position.y) controlledPlayer.appliedForce.y = 100;
    }

    return that;
}

function gameBoard (setSize) {
    var that = {};
    var size = setSize;
    var leftPlayer = player(vector(defaultPlayerSize.x / 2, (size.y - defaultPlayerSize.y / 2) / 2));
    var rightPlayer = player(vector(size.x - defaultPlayerSize.x / 2, (size.y - defaultPlayerSize.y / 2) / 2));
    var containerElement = document.getElementById('pongGame');
    var domElement = createSvgUtl('svg');
    var previousTimeStamp = null;
    var quaffle = ball(vector(size.x / 2, 0));
    var leftPlayerController = artificialPlayer(leftPlayer, quaffle);
    var rightPlayerController = artificialPlayer(rightPlayer, quaffle);

    var update = function (elapsedTimeSeconds) {
        leftPlayerController.update();
        rightPlayerController.update();
        leftPlayer.updateLocation(elapsedTimeSeconds, size);
        rightPlayer.updateLocation(elapsedTimeSeconds, size);
        quaffle.updateLocation(elapsedTimeSeconds, size);
    }

    var render = function () {
        leftPlayer.draw();
        rightPlayer.draw();
        quaffle.draw();
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
        domElement.setAttribute('width', size.x * pixelsPerMeter);
        domElement.setAttribute('height', size.y * pixelsPerMeter);
        containerElement.appendChild(domElement);
        leftPlayer.attachTo(domElement);
        rightPlayer.attachTo(domElement);
        quaffle.attachTo(domElement);
        window.requestAnimationFrame(loop);
    }

    return  that;
}


window.onload = function () {
    var boardSize = vector(120, 50);
    var game = gameBoard(boardSize);

    game.run();
}
