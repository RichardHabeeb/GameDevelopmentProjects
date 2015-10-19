module.exports = (function (){
    var Vector = require("./Vector.js");

    return {
        window: {
            width: 1000,
            height: 700,
        },
        player: {
            width: 50,
            height: 100,
            mass: 50,
            topSpeed: 150,
            stoppedSpeed: 5.0,
            movementForce: 1000,
        },
        gravity: Vector(0, 9.8),
        frictionCoef: 0.99,
        serverUri: "ws://localhost/",
        svgUri: "http://www.w3.org/2000/svg"
    };
})();
