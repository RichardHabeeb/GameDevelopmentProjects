define(function (require) {
    var Vector = require('./Vector');
    var Settings = require('./Settings');
    var Sprite = require('./Sprite');
    var Layer = require('./Layer');
    var TileMap = require('./TileMap');
    var SpriteMap = require('./SpriteMap');
    var DarknessTileMapBuilder = require('./DarknessTileMapBuilder');
    var MobLayerBuilder = require('./MobLayerBuilder');
    var walkingAudio = new Audio('aud/step2.wav');
    var treasureAudio = new Audio('aud/pickupitem.wav');
    var jellyWarningAudio = new Audio('aud/warble2.wav');
    var jellyAudio = new Audio('aud/warble.wav');
    var wumpusWarningAudio = new Audio('aud/rumble2.wav');
    var wumpusAudio = new Audio('aud/crash.wav');
    var pitWarningAudio = new Audio('aud/rumble.wav');
    var pitAudio = new Audio('aud/fall.wav');
    var gameEndAudio = new Audio('aud/powerup.wav');
    var pitDeaths = 0;
    var wumpusDeaths = 0;
    var robotsSaved = 0;

    walkingAudio.loop = true;

    function runGame() {
        var wumpus = Sprite('img/Wumpus.png', Vector(0, -Settings.tileSize.y), Vector(0,Settings.tileSize.y));
        var previousTimeStamp = null;
        var playerIsMoving = false;
        var layers = [];
        for(var i = 0; i < Settings.numberOfLayers; i++) {
            layers.push(Layer(document.body, Settings.canvasSize, Settings.canvasScale));
        }

        function endGame() {
            for(var i = 0; i < Settings.numberOfLayers; i++) {
                layers[i].fadeOut(1000);
            }
            runGame();
        }

        /* background layer */
        var layout = new Uint8Array(Settings.tilesPerRow * Settings.tilesPerColumn);
        layout.fill(1);
        layers[0].tileMap = TileMap();
        layers[0].tileMap.addTile("img/Space Dirt 1.png");
        layers[0].tileMap.addLayout(layout);
        layers[0].tileMap.redrawEachFrame = false;


        /* mob layer */
        var foundTreasure = false;
        var treasure = Sprite("img/treasureAnimation.png", Vector(), Vector(), 32, 4);
        var robot = Sprite("img/RobotComingAlive.png", Vector(), Vector(), 32, 4);
        var mobSpriteMap = null;
        robot.pause();
        var gameEvents = {
            pitEvent: function () {
                pitAudio.play();
                endGame();
            },
            pitWarningEvent: function() {
                pitWarningAudio.play();
            },
            jellyEvent: function(sender, pos) {
                jellyAudio.play();
                mobSpriteMap.removeParent(pos);
                var newPos = mobSpriteMap.findEmptyPosition();
                mobSpriteMap.attachSprite(Sprite("img/BrainJelly.png"), newPos, gameEvents.jellyEvent);
                mobSpriteMap.attachChildren(newPos, "img/JellyTrace.png", gameEvents.jellyWarningEvent);
                resetDarkness();
                resetPlayer();
            },
            jellyWarningEvent: function() {
                jellyWarningAudio.play();
            },
            wumpusEvent: function() {
                layers[4].attachSprite(wumpus);
                wumpus.position.x = player.position.x;
                window.onkeydown = function() {};
                wumpusDeaths++;
                wumpus.tweenPosition(Vector(0, player.position.y + Settings.tileSize.y), 1, function() {
                    layers[2].removeSprite(player);
                    window.setTimeout(endGame, 500);
                });
                wumpusAudio.play();
            },
            wumpusWarningEvent: function() {
                wumpusWarningAudio.play();
            },
            treasureEvent: function() {
                if(!foundTreasure) {
                    foundTreasure = true;
                    treasureAudio.play();
                    layers[1].removeSprite(treasure);
                }
            },
            exitEvent: function() {
                if(foundTreasure) {
                    robotsSaved++;
                    gameEndAudio.play();
                    robot.play();
                    window.setTimeout(endGame, 3000);
                }
            },
            default: function() {
            }
        };
        mobSpriteMap = MobLayerBuilder(layers[1], gameEvents, treasure, robot);


        /* darkness layer */
        var explored = null;
        function resetDarkness() {
            explored = new Uint8Array(Settings.tilesPerRow * Settings.tilesPerColumn);
            layout.fill(0);
            layers[3].tileMap = DarknessTileMapBuilder(explored);
        }
        resetDarkness();

        /* player's layer */
        var player = null;
        function resetPlayer() {
            layers[2].removeSprite(player);
            var playerPos = mobSpriteMap.findEmptyPosition();
            player = Sprite("img/SpaceDudeWalking.png", Vector(playerPos.x*Settings.tileSize.x, playerPos.y*Settings.tileSize.y), Vector(), 32, 4);
            player.pause();
            explored[playerPos.y*Settings.tilesPerRow + playerPos.x] = 1;
            var newLayer = Layer(document.body, Settings.canvasSize, Settings.canvasScale);
            newLayer.tileMap = DarknessTileMapBuilder(explored);
            layers[3].fadeOut(500);
            layers[3] = newLayer;
            layers[2].attachSprite(player);
        }
        resetPlayer();



        window.onkeyup = function(e) {
            if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        };

        window.onkeydown = function (e) {
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
            if(playerIsMoving || player.position.y + direction.y >= Settings.canvasSize.y || player.position.x + direction.x >= Settings.canvasSize.x ||
                player.position.y + direction.y < 0 || player.position.x + direction.x < 0) return;
            var newLayer = Layer(document.body, Settings.canvasSize, Settings.canvasScale);
            var newTilePosition = Vector(Math.round((player.position.x + direction.x) / Settings.tileSize.x), Math.round((player.position.y + direction.y) / Settings.tileSize.y));
            playerIsMoving = true;
            explored[newTilePosition.y*Settings.tilesPerRow + newTilePosition.x] = 1;
            newLayer.tileMap = DarknessTileMapBuilder(explored);
            layers[3].fadeOut(500);
            layers[3] = newLayer;
            player.reverse = direction.x < 0;
            walkingAudio.play();
            player.tweenPosition(direction, 1, function() {
                walkingAudio.pause();
                player.pause();
                playerIsMoving = false;
                mobSpriteMap.triggerEvent(newTilePosition);
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
    }
    runGame();
});
