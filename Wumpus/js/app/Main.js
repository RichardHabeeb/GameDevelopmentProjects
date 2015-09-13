define(function (require) {
    var Vector = require('./Vector');
    var Settings = require('./Settings');
    var Sprite = require('./Sprite');
    var Layer = require('./Layer');
    var TileMap = require('./TileMap');
    var DarknessTileMapBuilder = require('./DarknessTileMapBuilder');
    var previousTimeStamp = null;

    var layers = [];
    for(var i = 0; i < Settings.numberOfLayers; i++) {
        layers.push(Layer(document.body, Settings.canvasSize, Settings.canvasScale));
    }

    /*
    initialize and attach stuff here
    */
    var layout = new Uint8Array(Settings.tilesPerRow * Settings.tilesPerColumn);
    layout.fill(1);
    layers[0].tileMap = TileMap();
    layers[0].tileMap.addTile("img/Space Dirt 1.png");
    layers[0].tileMap.addLayout(layout);
    layers[0].tileMap.redrawEachFrame = false;

    layers[1].attachSprite(Sprite("img/SpaceDudeWalking.png", Vector(0 * Settings.tileSize.x, 0 * Settings.tileSize.y), Vector(0,0), 32, 3));
    
    explored = new Uint8Array([
        1, 1, 1, 1, 1, 0, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 1,
        0, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 1, 1, 1, 1, 0,
        0, 0, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    layers[2].tileMap = DarknessTileMapBuilder(explored);



    /* Animation loop */
    var loop = function (timeStamp) {
        if(!previousTimeStamp) previousTimeStamp = timeStamp;
        var elapsedTimeSeconds = (timeStamp - previousTimeStamp) / 1000.0;

        /*
        update position code here, every frame
        */

        for(var i = 0; i < layers.length; i++) {
            layers[i].draw(elapsedTimeSeconds);
        }
        previousTimeStamp = timeStamp;
        window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);

    console.log("Loaded.");
});
