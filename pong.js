

function createSvgUtl(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
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

function ball () {
    var that = {};
    var domElement = createSvgUtl("circle");

    that.position = vector();
    that.velocity = vector();
    that.acceleration = vector();

    that.draw = function () {

    }

    that.attachTo = function (boardElement) {
        boardElement.appendChild(domElement);
    }

    that.update = function (elapsedTime) {

    }

    return that;
}

var defaultPlayerSize = vector(20, 100);
var defaultPlayerMass = 1; //kg
function player (setPosition) {
    var that = {};
    var domElement = createSvgUtl("rect");

    that.currentSize = vector(defaultPlayerSize.x, defaultPlayerSize.y);
    that.position = vector(setPosition.x, setPosition.y);
    that.velocity = vector();
    that.appliedForce = vector();
    that.mass = defaultPlayerMass;

    that.draw = function() {
        domElement.setAttribute('width', that.currentSize.x);
        domElement.setAttribute('height', that.currentSize.y);
        domElement.setAttribute('x', that.position.x);
        domElement.setAttribute('y', that.position.y);
    }

    that.attachTo = function (boardElement) {
        boardElement.appendChild(domElement);
    }

    that.updateLocation = function(elapsedTimeSeconds) {
        var acceleration = vector(that.appliedForce.x * that.mass, that.appliedForce.y * that.mass);
        that.velocity.x += acceleration.x * elapsedTimeSeconds;
        that.velocity.y += acceleration.y * elapsedTimeSeconds;
        that.position.x += pixelsPerMeter * that.velocity.x * elapsedTimeSeconds;
        that.position.y += pixelsPerMeter * that.velocity.y * elapsedTimeSeconds;
    }

    return that;
}

function gameBoard (setSize) {
    var that = {};
    var size = setSize; //TODO size undefined?
    var leftPlayer = player(vector(0, (size.y - defaultPlayerSize.y) / 2));
    var rightPlayer = player(vector(size.x - defaultPlayerSize.x, (size.y - defaultPlayerSize.y) / 2));
    var containerElement = document.getElementById('pongGame');
    var domElement = createSvgUtl('svg');
    var previousTimeStamp = null;
    var quaffle = ball();

    var update = function (elapsedTimeSeconds) {
        leftPlayer.updateLocation(elapsedTimeSeconds);
        rightPlayer.updateLocation(elapsedTimeSeconds);
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
        domElement.setAttribute('width', size.x);
        domElement.setAttribute('height', size.y);
        containerElement.appendChild(domElement);

        leftPlayer.appliedForce.y = -50;

        leftPlayer.attachTo(domElement);
        rightPlayer.attachTo(domElement);
        quaffle.draw();

        window.requestAnimationFrame(loop);
    }

    return  that;
}

function artificialPlayer (controlledPlayer, quaffle) {
    var that = {};

    that.update = function () {
        if(quaffle.position.y < controlledPlayer.y) controlledPlayer.appliedForce.y = -50;
        if(quaffle.position.y > controlledPlayer.y) controlledPlayer.appliedForce.y = 50;
    }

    return that;
}


window.onload = function () {
    var boardSize = vector(800, 500);
    var game = gameBoard(boardSize);

    game.run();
}
