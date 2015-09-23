define([], function() {
    return function(keyCodes) {
        var that = {};

        that.keyPressed = [];
        for(var i = 0; i < 250; i++) that.keyPressed[i] = false;

        var defaultPreventers = [];
        that.preventDefault = function(key, state) {
            if(typeof(state) === "undefined") state = true;
            defaultPreventers[key] = state;
        };

        var keyEvents = [];
        that.addEvent = function(key, event) {
            keyEvents[key] = event;
        };

        that.removeEvent = function(key) {
            keyEvents[key] = undefined;
        };


        function keyDownListener(e) {
            var key = e.which || e.keyCode;
            if(typeof(keyEvents[key]) !== "undefined") keyEvents[key]();
            if(typeof(defaultPreventers[key]) !== "undefined" && defaultPreventers[key]) e.preventDefault();
            that.keyPressed[key] = true;
        }

        function keyUpListener(e) {
            var key = e.which || e.keyCode;
            if(typeof(keyEvents[key]) !== "undefined") keyEvents[key]();
            if(typeof(defaultPreventers[key]) !== "undefined" && defaultPreventers[key]) e.preventDefault();
            that.keyPressed[key] = false;
        }

        that.startListener = function() {
            window.onkeydown = keyDownListener;
            window.onkeyup = keyUpListener;
        };

        that.stopListener = function() {
            window.onkeydown = function() {};
            window.onkeyup = function() {};
        };

        return that;
    };
});
