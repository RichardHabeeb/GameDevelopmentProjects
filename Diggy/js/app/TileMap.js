define(['app/Vector', 'app/Sprite', 'app/Settings', 'app/Grid', 'app/Rect'], function(Vector, Sprite, Settings, Grid, Rect) {
    return function (onLoad) {
        var that = {};
        /* contains each tile as a sprite. */
        var tiles = [];
        /* array of indecies into tiles */
        var tileGrid = null;
        var cellsToSwap = [];
        /* the zero tile is always clear */
        tiles.push("");
        that.position = Vector();
        var gridSize = Vector();

        /* push a generic tile into the pallete */
        that.addTile = function(attr) { /* { src: , solid: , } */
            //TODO add type checking of attr

            tiles.push(attr);

        };

        that.numTiles = function() {
            return tiles.length;
        };

        /* add a predefined sprite into the pallete, useful for animated sprites */
        that.addSprite = function(spr) {
            tiles.push(spr);
        };

        that.getCellsTouchingRectangle = function(rect) {
            return tileGrid.getRectangleOfCells(Rect(
                ~~(rect.x / Settings.tileSize.x),
                ~~(rect.y / Settings.tileSize.y),
                1 + ~~((rect.x + rect.width) / Settings.tileSize.x) - ~~(rect.x / Settings.tileSize.x),
                1 + ~~((rect.y + rect.height) / Settings.tileSize.y) - ~~(rect.y / Settings.tileSize.y)
            ));
        };

        that.swapTilesOfCell = function(cell, id) {
            cell.tile = Sprite(tiles[id].src, Vector(cell.tile.position.x, cell.tile.position.y));
            cell.solid = tiles[id].solid;
            cell.soft = tiles[id].soft;
        };

        that.getCellsBeneathRectangle = function(rect) {
            return tileGrid.getRectangleOfCells(Rect(
                ~~(rect.x / Settings.tileSize.x),
                1 + ~~(rect.height / Settings.tileSize.y),
                1 + ~~(rect.width / Settings.tileSize.x),
                1 + ~~(rect.height / Settings.tileSize.y)
            ));
        };

        that.getCellAtPoint = function(pos) {
            return tileGrid.getCell(Vector(
                ~~(pos.x / Settings.tileSize.x),
                ~~(pos.y / Settings.tileSize.y)));
        };

        that.addLayout = function(tileLayout, size) {
            gridSize = Vector(size.x, size.y);
            tileGrid = Grid(gridSize);
            tileGrid.each(function(cell, pos) {
                cell.tile = Sprite(tiles[tileLayout[pos.y * size.x + pos.x]].src, Vector(pos.x * Settings.tileSize.x, pos.y * Settings.tileSize.y));
                cell.solid = tiles[tileLayout[pos.y * size.x + pos.x]].solid;
                cell.soft = tiles[tileLayout[pos.y * size.x + pos.x]].soft;
            });
        };

        that.draw = function(context, elapsedTimeSeconds) {
            var ret = 0;
            tileGrid.each(function(cell, pos) {
                ret += cell.tile.draw(context, elapsedTimeSeconds) ? 1 : 0;
            });
            return ret > 0;
        };

        return that;
    };
});
