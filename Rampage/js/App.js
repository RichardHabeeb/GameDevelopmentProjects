window.jQuery = $ = require('jquery');
var bootstrap = require('bootstrap');
var lSystem = require('./Lsystem.js');


window.onload = function() {
    /* Enable all the tooltips */
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    var canvas = document.createElement('canvas');
    $("#canvasContainer").append($(canvas));
    $(canvas).attr({
        "width": $("#canvasContainer").width(),
        "height": $("#canvasContainer").height(),
    });


    var context = canvas.getContext('2d');

    $("#drawButton").click(function() {
        lSystem.lsystem($("#axiom").val().replace(/\s/g, ""), JSON.parse($("#rules").val()), Number($("#iterations").val()));
        var canvasHeight =  Math.floor($(canvas).height());
        var canvasWidth = Math.floor($(canvas).width());
        context.clearRect(0,0, canvasWidth, canvasHeight);
        lSystem.render(Math.floor(canvasWidth / 2), canvasHeight - 5, context);
        $("#svgOutput").val(lSystem.SVG());
    });
};
