define(function (require) {
    var Vector = require('./Vector');
    var Settings = require('./Settings');
    var Sprite = require('./Sprite');
    var Layer = require('./Layer');
    var TileMap = require('./TileMap');
    var DarknessTileMapBuilder = require('./DarknessTileMapBuilder');
    var MobLayerBuilder = require('./MobLayerBuilder');
    var previousTimeStamp = null;
    var playerIsMoving = false;
    var layers = [];
    for(var i = 0; i < Settings.numberOfLayers; i++) {
        layers.push(Layer(document.body, Settings.canvasSize, Settings.canvasScale));
    }

    /* background layer */
    var layout = new Uint8Array(Settings.tilesPerRow * Settings.tilesPerColumn);
    layout.fill(1);
    layers[0].tileMap = TileMap();
    layers[0].tileMap.addTile("img/Space Dirt 1.png");
    layers[0].tileMap.addLayout(layout);
    layers[0].tileMap.redrawEachFrame = false;

    /* player's layer */
    var player = Sprite("img/SpaceDudeWalking.png", Vector(0 * Settings.tileSize.x, 0 * Settings.tileSize.y), Vector(), 32, 4);
    player.pause();
    layers[2].attachSprite(player);

    /* mob layer */
    var treasures = [];
    treasures.push(Sprite("img/treasureAnimation.png", Vector(), Vector(), 32, 4));
    var robot = Sprite("img/RobotComingAlive.png", Vector(), Vector(), 32, 4);
    robot.pause();
    var eventTileTable = MobLayerBuilder(layers[1], {
        pitEvent: function () {

        },
        pitWarningEvent: function() {

        },
        jellyEvent: function() {

        },
        jellyWarningEvent: function() {

        },
        wumpusEvent: function() {

        },
        wumpusWarningEvent: function() {

        },
        treasureEvent: function() {

        },
        exitEvent: function() {
            robot.play();
        },
        default: function() {
            console.log(player.position.x);
        }
    }, treasures, robot);





    /* darkness layer */
    var explored = new Uint8Array([
        1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    layers[3].tileMap = DarknessTileMapBuilder(explored);

    window.onkeydown = function(e) {
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    };

    window.onkeyup = function (e) {
        var key = e.which || e.keyCode;
        if(key == 32) { //space
            e.preventDefault();
        }
        if(key == 37) { //left
            e.preventDefault();
            playerMove(Vector(-Settings.tileSize.x, 0));
        }
        if(key == 38) { //up
            e.preventDefault();
            playerMove(Vector(0, -Settings.tileSize.y));
        }
        if(key == 39) { //right
            e.preventDefault();
            playerMove(Vector(Settings.tileSize.x, 0));

        }
        if(key == 40) { //down
            e.preventDefault();
            playerMove(Vector(0, Settings.tileSize.y));
        }
    };

    var playerMove = function(direction) {
        if(playerIsMoving || player.position.y + direction.y >= Settings.canvasSize.y || player.position.x + direction.x >= Settings.canvasSize.y ||
            player.position.y + direction.y < 0 || player.position.x + direction.x < 0) return;
        var newLayer = Layer(document.body, Settings.canvasSize, Settings.canvasScale);
        var newTilePosition = Vector(Math.round((player.position.x + direction.x) / Settings.tileSize.x), Math.round((player.position.y + direction.y) / Settings.tileSize.y));
        playerIsMoving = true;
        explored[newTilePosition.y*Settings.tilesPerRow + newTilePosition.x] = 1;
        newLayer.tileMap = DarknessTileMapBuilder(explored);
        layers[3].fadeOut(500);
        layers[3] = newLayer;
        player.reverse = direction.x < 0;
        player.tweenPosition(direction, 1, function() {
            player.pause();
            playerIsMoving = false;
            eventTileTable[newTilePosition.y*Settings.tilesPerRow + newTilePosition.x]();
        });
        player.play();

    };

    /* Animation loop */
    var animationloop = function (timeStamp) {
        if(!previousTimeStamp) previousTimeStamp = timeStamp;
        var elapsedTimeSeconds = (timeStamp - previousTimeStamp) / 1000.0;
        for(var i = 0; i < layers.length; i++) {
            layers[i].draw(elapsedTimeSeconds);
        }
        previousTimeStamp = timeStamp;
        window.requestAnimationFrame(animationloop);
    };
    window.requestAnimationFrame(animationloop);
});
