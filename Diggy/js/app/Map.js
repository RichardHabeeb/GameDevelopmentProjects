define(['app/Vector', 'app/Rect', 'app/Settings', 'app/Grid', 'app/TileMap', 'app/Layer'], function(Vector, Rect, Settings, Grid, TileMap, Layer) {
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
        tileMap.addTile({ src: "img/SquareLightDirt1.png", solid: false });
        tileMap.addTile({ src: "img/SquareLightDirt2.png", solid: true });
        tileMap.addTile({ src: "img/SquareLightDirt4.png", solid: true });
        tileMap.addTile({ src: "img/SquareLightDirt5.png", solid: true });

        tileMap.addLayout([
            4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            2, 3, 2, 4, 2, 2, 3, 3, 2, 2, 4, 2, 2, 3, 4, 4,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        ], Settings.numTiles);

        layers[0].attachDrawable(tileMap);

        that.checkCollision = function(ent) {
            var rect = ent.getHitbox();
            var cells = tileMap.getCellsTouchingRectangle(rect);
            for(var i = 0; i < cells.length; i++) {
                if(cells[i].solid) {
                    ent.collide(rect.getOverlapOffset(Rect().buildFromVectors(cells[i].tile.position, cells[i].tile.size)));
                    rect = ent.getHitbox();
                }
            }
        };

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
