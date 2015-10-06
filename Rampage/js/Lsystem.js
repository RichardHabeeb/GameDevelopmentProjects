// L-System engine defined using the Module pattern
module.exports = (function (){
    var _final = "",
    DEFAULT_STEP = 15,
    DEFAULT_TURN = Math.PI / 4,
    _svgDom = null;

    /* Initializes an L-System using the supplied
    * axiom, rules, and number of iterations
    * params:
    * - axiom: the starting string
    * - rules: the array of rules as string -> string
    *   key/value pairs (i.e. ["key", "value"]
    * - iterations: the number of iterations to carry out
    */
    function lsystem(axiom, rules, iterations) {
        _final = axiom;

        for(var i = 0; i < iterations; i++) {
            _final = apply(_final, rules);
        }

        return _final;
    }

    /* Apply the ruleset in rules to the
    * provided axiom string.
    * params:
    * - axiom: the current axiom string
    * - rules: the transformation rules to apply to the axiom string
    */
    function apply(axiom, rules) {
        var tmp = "",
        value = "",
        match,
        re,
        flag;
        for(var i = 0; i < axiom.length; i++){
            flag = false;
            for(var j = 0; j < rules.length; j++) {
                // If the next sequence of characters is our
                // matching key token, then apply its rule
                // We use regular expressions to match non-exact
                // keys (i.e. +<angle> where angle is a number
                // with a non-definite number of digits can be
                // matched by the regular expression:
                //         /\+([0-9]+)/
                // The parentheses in this expression are a
                // "capture group" which are included in the
                // array returned from the String.prototype.exec
                // function at indices 1...n.  The first element
                // in the array is the full matching value.
                match = axiom.substring(i).match(rules[j][0]);
                if(match && match.index === 0) {
                    // Because our rule may need to inject a value
                    // captured by our regular expression, we need
                    // to do slightly more than simple concatenation
                    // We use the $<number> syntax to indicate the
                    // capture group, starting with an index of 1.
                    value = rules[j][1];
                    for(var k = 1; k < match.length; k++) {
                        re = new RegExp("/\$" + k + "/", 'g');
                        value = value.replace(re, match[k]);
                    }
                    tmp = tmp.concat(value);
                    flag = true;
                    break;
                }
            }
            if(!flag) tmp = tmp.concat(axiom.charAt(i));
        }
        return tmp;
    }

    /* Render the current L-System
    * params:
    * - context: a rendering context to draw into
    */
    function render(xPosition, yPosition, context) {
        console.log("Rendering " + _final + "...");
        var stack = [],
        x = xPosition,
        y = yPosition,
        stroke = "rgba(0,0,0,0)",
        fill = "rgba(0,0,0,0)",
        angle = Math.PI,  // Start facing up
        step = 15,        // Default distance to move
        turn = 45,        // Default turning angle
        sub = "",
        rads = 0,
        match;

        _svgDom = $("<g></g>");
        currentPath = $("<path d='' />");

        var resetPath = function () {

            context.strokeStyle = stroke;
            context.fillStyle = fill;
            if(fill !== "rgba(0,0,0,0)") {
                context.closePath();
                currentPath.attr("d", currentPath.attr("d") + " Z");
            }
            currentPath.attr("stroke", stroke);
            currentPath.attr("fill", fill);
            context.stroke();
            context.fill();
            context.beginPath();
            currentPath = $(document.createElement("path"));
            $(_svgDom).append(currentPath);
            currentPath.attr("d", "M" + Math.floor(x) + " " + Math.floor(y));
        };

        context.save();       // Save any rendering state from calling context
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(x, y); // Move turtle to starting position

        for(var i = 0; i < _final.length; i++) {
            var c = _final.charAt(i);
            console.log("processing " + c );

            var arg = "";
            sub = _final.substr(i);
            match = /\((.*?)\)/g.exec(sub);

            if(match && match.length > 1) {
                arg = match[1];
                if(sub.indexOf(arg) === 2) {
                    i += arg.length + 2; // advance past the parameters
                } else {
                    arg = "";
                }
            }

            if(c === '-') {
                // turn left by specified degrees (or default)
                angle -= (arg.length === 0) ? DEFAULT_TURN : parseFloat(arg) * (Math.PI / 180.0);
            } else if(c === '+') {
                // turn right by specified degrees (or default)
                angle += (arg.length === 0) ? DEFAULT_TURN : parseFloat(arg) * (Math.PI / 180.0);
            } else if(c === '[') {
                // save state
                stack.push({x: x, y: y, angle: angle, stroke: stroke, fill: fill });
            } else if(c === ']') {
                // restore state
                resetPath();
                var state = stack.pop();
                x = state.x;
                y = state.y;
                angle = state.angle;
                stroke = state.stroke;
                fill = state.fill;

                context.moveTo(x, y);
                currentPath.attr({
                    "d": "M" + Math.floor(x) + " " + Math.floor(y)
                });
            } else if(c === '|') {
                //change stroke color
                resetPath();
                context.moveTo(x, y);
                if(arg === "none") arg = "rgba(0,0,0,0)";
                stroke = arg;
            } else if(c === '#') {
                //change fill color
                resetPath();
                context.moveTo(x, y);
                if(arg === "none") arg = "rgba(0,0,0,0)";
                fill = arg;
            } else {
                // move forward
                x += DEFAULT_STEP * Math.sin(angle);
                y += DEFAULT_STEP * Math.cos(angle);
                currentPath.attr({
                    "d": currentPath.attr("d") + " L" + Math.round(x) + " " + Math.round(y)
                });
                context.lineTo(x, y); // Draw line with turtle
            }
        }
        resetPath();
        context.restore();  // Restore contexts' graphical state
    }

    function SVG() {
        return _svgDom.html();
    }

    // The public API for the L-System module
    return {
        lsystem: lsystem,
        render: render,
        SVG: SVG,
    };

})();
