define(['app/Vector'], function(Vector) {
    return {
        canvasSize: Vector(256,128),
        canvasScale: 4,
        canvasShiftMargin: 32,
        numberOfLayers: 4,
        tileSize: Vector(32, 32),
        drawableAreaSize: Vector(16*32, 6*32),
        numTiles: Vector(16, 6), /* this can go over the bounds of the canvas */
    };
});
