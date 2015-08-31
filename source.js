function sprite (options) {
  var that = {},
    frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = 2,
    numberOfFrames = options.numberOfFrames || 1;

  that.context = options.context;
  that.width = options.width;
  that.height = options.height;
  that.image = options.image;
  that.loop = options.loop;

  that.render = function () {
    that.context.clearRect(0, 0, that.width, that.height);
    that.context.drawImage(
      that.image,
      frameIndex * that.width,
      0,
      that.width,
      that.height,
      0,
      0,
      that.width,
      that.height);
  };

  that.update = function () {
    tickCount += 1;
    if (tickCount > ticksPerFrame) {
      tickCount = 0;
      if (frameIndex < numberOfFrames - 1) {
        frameIndex += 1;
      } else if (that.loop) {
        frameIndex = 0;
      }
    }
  };

  return that;
}


window.onload = function() {
  var canvas = document.getElementById("coinAnimation");
  canvas.width = 100;
  canvas.height = 100;

  var coinImage = new Image();
  coinImage.src = "./coin-sprite-animation.png";
  var coin = sprite({
    context: canvas.getContext("2d"),
    width: 100,
    height: 100,
    image: coinImage,
    loop: true,
    numberOfFrames: 10
  });
  function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    coin.update();
    coin.render();
  }
  coinImage.onload = gameLoop;
}
