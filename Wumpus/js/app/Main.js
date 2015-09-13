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

    /* mob layer */
    MobLayerBuilder(layers[1]);

    /* player's layer */
    var player = Sprite("img/SpaceDudeWalking.png", Vector(0 * Settings.tileSize.x, 0 * Settings.tileSize.y), Vector(0,0), 32, 4);
    player.pause();
    layers[2].attachSprite(player);

    /* darkness layer */
    explored = new Uint8Array([
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
        playerIsMoving = true;
        explored[Math.round((player.position.y + direction.y) / Settings.tileSize.y)*Settings.tilesPerRow + Math.round((player.position.x + direction.x) / Settings.tileSize.x)] = 1;
        var newLayer = Layer(document.body, Settings.canvasSize, Settings.canvasScale);
        newLayer.tileMap = DarknessTileMapBuilder(explored);
        layers[3].fadeOut(1000);
        layers[3] = newLayer;
        player.reverse = direction.x < 0;
        player.tweenPosition(direction, 1, function() {
            player.pause();
            playerIsMoving = false;
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
