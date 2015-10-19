module.exports = (function (){
    var Vector = require("./Vector.js");

    return {
        window: {
            width: 1000,
            height: 500,
            scroll: Vector(100, 100)
        },
        world: {
            width: 1300,
            height: 550
        },
        player: {
            width: 25,
            height: 50,
            mass: 50,
            topSpeed: 300,
            stoppedSpeed: 5.0,
            movementForce: 2000,
        },
        gravity: Vector(0, 9.8),
        frictionCoef: 1.0,
        serverUri: "ws://localhost/",
        svgUri: "http://www.w3.org/2000/svg"
    };
})();
