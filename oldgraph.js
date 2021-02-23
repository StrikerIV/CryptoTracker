var plotly = require('plotly')('StrikerIV', 'i2gSnoVAXQpNraOZaLFd');
var moment = require('moment');
var fs = require('fs');

var data = [
    {
        x: [1, 2, 3],
        y: [20, 14, 23],
        type: "scatter"
    }
];
var graphOptions = { filename: "", fileopt: "overwrite" };

plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});

plotly.getFigure('strikeriv', '8', function (err, figure) {
    if (err) return console.log(err);

    var imgOpts = {
        format: 'png',
        width: 1000,
        height: 500
    };

    console.log(figure)

    plotly.getImage(figure, imgOpts, function (error, imageStream) {
        if (error) return console.log(error);

        var fileStream = fs.createWriteStream('2.png');
        imageStream.pipe(fileStream);
    });
});