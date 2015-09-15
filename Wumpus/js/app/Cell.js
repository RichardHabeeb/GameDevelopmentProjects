define(function() {
    return function() {
        var that = {};

        that.childCells = {
            north: null,
            east: null,
            south: null,
            west: null
        };

        that.sprite = null;
        that.event = function(sender) {};

        return that;
    };
});
