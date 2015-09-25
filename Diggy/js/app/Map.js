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
            4, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
            3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
            2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
            2, 3, 2, 4, 2, 1, 1, 1, 1, 2, 4, 2, 2, 3, 4, 4,
            2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        ], Settings.numTiles);

        layers[0].attachDrawable(tileMap);

        that.checkCollision = function(ent) {
            var rect = ent.getHitbox();

            /* check nearby cells and resolve each collision */
            var cells = tileMap.getCellsTouchingRectangle(rect);
            for(var i = 0; i < cells.length; i++) {
                if(cells[i].solid) {
                    ent.collide(rect.getOverlapOffset(Rect().buildFromVectors(cells[i].tile.position, cells[i].tile.size)));
                    rect = ent.getHitbox();
                }
            }

            /* check for absense of solid floor tiles */
            var floorCells = tileMap.getCellsBeneathRectangle(rect);
            var solid = false;
            for(i = 0; i < cells.length; i++) {
                solid = solid || cells[i].solid;
            }
            if(!solid) ent.startFalling();

        };


        that.checkBorderCollision = function(ent) {
            var rect = ent.getHitbox();
            if(rect.x + rect.width > Math.abs(layers[0].position.x) + Settings.canvasSize.x - Settings.canvasShiftMargin) {
                that.moveAll(Vector((Math.abs(layers[0].position.x) + Settings.canvasSize.x - Settings.canvasShiftMargin) - (rect.x + rect.width), 0));
            }
            if(rect.x < Math.abs(layers[0].position.x) + Settings.canvasShiftMargin) {
                that.moveAll(Vector((Math.abs(layers[0].position.x) + Settings.canvasShiftMargin) - (rect.x) , 0));
            }
            if(rect.y + rect.height > Math.abs(layers[0].position.y) + Settings.canvasSize.y - Settings.canvasShiftMargin) {
                that.moveAll(Vector(0, (Math.abs(layers[0].position.y) + Settings.canvasSize.y - Settings.canvasShiftMargin) - (rect.y + rect.height)));
            }
            if(rect.y < Math.abs(layers[0].position.x) + Settings.canvasShiftMargin) {
                that.moveAll(Vector(0, (Math.abs(layers[0].position.y) + Settings.canvasShiftMargin) - (rect.y)));
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
