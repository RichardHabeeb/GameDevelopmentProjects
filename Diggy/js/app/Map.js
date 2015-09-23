define(['app/Vector', 'app/Sprite', 'app/Settings', 'app/Grid', 'app/TileMap', 'app/Layer'], function(Vector, Sprite, Settings, Grid, TileMap, Layer) {
    return function() {
        var that = {};

        var layers = [];
        for(var i = 0; i < Settings.numberOfLayers; i++) {
            layers.push(Layer(document.body, Settings.canvasSize, Settings.canvasScale, Settings.drawableAreaSize));
            layers[i].setZ(i);
        }

        var layerDict = {
            bgLayer: layers[0],
            fgLayer: layers[1],
            playerLayer: layers[2],
            menuLayer: layers[3],
        };

        that.attachPlayer = function(player) {
            layerDict.playerLayer.attachDrawable(player);
        };

        var tileMap = TileMap();
        tileMap.addTile("img/Dirt1.png");
        tileMap.addTile("img/Dirt2.png");

        tileMap.addLayout([
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ], Settings.numTiles);

        layers[0].attachDrawable(tileMap);

        that.moveAll = function(offset) {
            for(var i = 0; i < layers.length; i++) {
                layers[i].position.x = Math.min(0, Math.max(Settings.canvasSize.x - Settings.drawableAreaSize.x, layers[i].position.x + offset.x));
                layers[i].position.y = Math.min(0, Math.max(Settings.canvasSize.y - Settings.drawableAreaSize.y, layers[i].position.y + offset.y));
            }
        };

        that.draw = function(elapsedTimeSeconds) {
            for(var i = 0; i < layers.length; i++) {
                layers[i].draw(elapsedTimeSeconds);
            }
        };

        return that;
    };
});
