define(['app/Vector', 'app/Sprite', 'app/Settings', 'app/Grid', 'app/TileMap', 'app/Layer'], function(Vector, Sprite, Settings, Grid, TileMap, Layer) {
    return function() {
        var that = {};

        var layers = [];
        for(var i = 0; i < Settings.numberOfLayers; i++) {
            layers.push(Layer(document.body, Settings.canvasSize, Settings.canvasScale, Settings.drawableAreaSize));
            layers[i].setZ(i);
        }

        var bunbun = Sprite("img/BunBun.png", Vector(2 * Settings.tileSize.x, 2 * Settings.tileSize.y), Vector(), 32, 8);
        layers[1].attachDrawable(bunbun);

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
            bunbun.position.x += 10 * elapsedTimeSeconds;
            that.moveAll(Vector(-5 * elapsedTimeSeconds, -5 * elapsedTimeSeconds));

            for(var i = 0; i < layers.length; i++) {
                layers[i].draw(elapsedTimeSeconds);
            }
        };

        return that;
    };
});
