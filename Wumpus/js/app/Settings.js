define(['app/Vector'], function(Vector) {
    return {
        canvasSize: Vector(256,256),
        canvasScale: 4,
        numberOfLayers: 4,
        tileSize: Vector(32, 32),
        tilesPerRow: 8, /* default  is 8x4 (256/32) */
        tilesPerColumn: 8,
        numberOfPits: 2,
        numberOfJellys: 2,
        numberOfWumpus: 1,
        numberOfTreasures: 1,
    };
});
