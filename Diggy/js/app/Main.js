define(['app/Vector', 'app/Game'], function(Vector, Game) {
    var previousTimeStamp = null;
    var game = Game();

    /* Animation loop */
    var loop = function (timeStamp) {
        if(!previousTimeStamp) previousTimeStamp = timeStamp;
        var elapsedTimeSeconds = (timeStamp - previousTimeStamp) / 1000.0;

        game.update(elapsedTimeSeconds);
        game.draw(elapsedTimeSeconds);

        previousTimeStamp = timeStamp;
        window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
});
