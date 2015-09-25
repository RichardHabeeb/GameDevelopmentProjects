/* Perlin noise library, based on the article found here:
 * http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
 */
 define([], function() {


  var _obj = {},
      _persistence = 0.25,
      _octaves = 6;

  /* Gets or sets the persistence
   * params:
   * persistence - if supplied, sets to this value
   * returns:
   * the current persistence
   */
  _obj.persistence = function(persistence) {
 if(persistence !== undefined) {
  _persistence = persistence;
 }
 return _persistence;
 };

  /* Gets or sets the number of octaves
   * params:
   * octaves - if supplied, sets octaves to this value
   * returns:
   * the current number of ocataves
   */
  _obj.octaves = function(octaves) {
    if(octaves !== undefined) {
      _octaves = octaves;
    }
    return _octaves;
    };

  /* Uses cosine interpolation between
   * number a and b at ratio
   * params:
   * a - the first value
   * b - the second value
   * ratio - the ratio between values
   */
  function interpolate(a, b, ratio) {
    var ft = ratio * Math.PI,
        f = (1 - Math.cos(ft)) * 0.5;
    return a * (1 - f) + b * f;
  }

  /* Generates pseudo-random noise from large primes
   * params:
   * x - a seed value for 1-d noise generation
   * returns:
   * a pseudo-random number between -1.0 and 1.0
   */
  function noise(x) {

    x = (x<<13) ^ x;
    return (1.0 - ((x * (x * x * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
  }

  /* Generates smoothed 1-dimensional noise by
   * averaging value at x with neighbouring values
   * params:
   * x - the seed value
   */
  function smoothedNoise1d(x) {
    return noise(x)/2 + noise(x-1)/4 + noise(x+1)/4;
  }

  /* Generates interpolated 1-dimensional noise values
   * params:
   * x - the seed value
   */
  function interpolatedNoise1d(x) {
    var integerX = Math.floor(x),
        fractionalX = x - integerX,
        v1 = smoothedNoise1d(integerX),
        v2 = smoothedNoise1d(integerX + 1);
    return interpolate(v1, v2, fractionalX);
  }

  /* Generates 1-dimensional perlin noise
   * params:
   * x - the seed value
   */
  _obj.noise1d = function(x) {
    var total = 0,
        frequency,
        amplitude;
    for(var i = 0; i < _octaves; i++) {
      frequency = 2^i;
      amplitude = _persistence^i;
      total = total + interpolatedNoise1d(x * frequency) * amplitude;
    }
    return total;
};

  /* Generates a 2-dimensional noise value
   * params:
   * x - the x seed value
   * y - the y seed value
   */
  function noise2d(x, y) {
    var n = x + y * 57;
    n = (n << 13) ^ n;
    return (1.0 - ((n * (n * n * 15731 + 789221) + 137612589) & 0x7fffffff) / 1073741824.0);
  }

  /* Generates smoothed 2-dimensional noise
   * params:
   * x - the x seed value
   * y - the y seed value
   */
  function smoothedNoise2d(x, y) {
    var corners = (
          noise2d(x-1, y-1) +
          noise2d(x+1, y-1) +
          noise2d(x-1, y+1) +
          noise2d(x+1, y+1)) / 16,
        sides = (
          noise2d(x-1, y) +
          noise2d(x+1, y) +
          noise2d(x, y-1) +
          noise2d(x, y+1)) / 8,
        center = noise2d(x, y) / 4;
    return corners + sides + center;
  }

  /* Generates interpolated 2-dimensional noise
   * params:
   * x - the x seed value
   * y - the y seed value
   */
  function interpolatedNoise2d(x, y) {
    var integerX = Math.floor(x),
        fractionalX = x - integerX,

        integerY = Math.floor(y),
        fractionalY = y - integerY,

        v1 = smoothedNoise2d(integerX, integerY),
        v2 = smoothedNoise2d(integerX + 1, integerY),
        v3 = smoothedNoise2d(integerX, integerY),
        v4 = smoothedNoise2d(integerX + 1, integerY + 1),

        i1 = interpolate(v1, v2, fractionalX),
        i2 = interpolate(v3, v4, fractionalX);
    return interpolate(i1, i2, fractionalY);
  }

  /* Generates 2-dimensional Perlin noise
   * params:
   * x - the x seed value
   * y - the y seed value
   */
  _obj.noise2d = function(x, y) {
    var total = 0,
        frequency,
        amplitude;
    for(i = 0; i < _octaves; i++) {
      frequency = 2^i;
      amplitude = _persistence^i;
      total = total + interpolatedNoise2d(x * frequency, y * frequency) * amplitude;
    }
    return total;
};

  return _obj;

});
