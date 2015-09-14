define(['app/Vector'], function(Vector) {
    return {
        canvasSize: Vector(320,192),
        canvasScale: 4,
        numberOfLayers: 6,
        tileSize: Vector(32, 32),
        tilesPerRow: 10,
        tilesPerColumn: 6,
        numberOfPits: 2,
        numberOfJellys: 2,
        numberOfWumpus: 1,
    };
});
