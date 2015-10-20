module.exports = (function (){
    var Settings = require("../../common/Settings.js");
    var Vector = require("../../common/Vector.js");

    var Cursor = function(parent, callback) {
        var pos = new Vector();
        var svg = $(document.createElementNS(Settings.svgUri, "circle"));
        svg.attr({
            "fill": "red",
            "r": Settings.attackRadius,
            "fill-opacity":"0.4"
        });
        parent.append(svg);

        $(document).on('mousemove', function(e){
            var parentOffset = parent.offset();
            pos.x = e.pageX - parentOffset.left;
            pos.y = e.pageY- parentOffset.top;
            svg.attr({
               "cx": pos.x,
               "cy": pos.y
            });
        });

        svg.click(function() {
            callback(pos);
        });
    };

    return Cursor;
})();
