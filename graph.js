var plotly = require('plotly')('StrikerIV', 'i2gSnoVAXQpNraOZaLFd');
var moment = require('moment');
var fs = require('fs');

let currency = "ren"
let hoursBack = 1

let currencyData = require(`./data/${currency.toLowerCase()}/prices.json`)

let xValues = []
let yValues = []

currencyData.forEach(cryptoData => {
    // let timeBack = Math.abs(moment(cryptoData.timeRecorded).diff(moment.now(), 'hours'))
    // if (timeBack > hoursBack - 1) return
    console.log(moment(cryptoData.timeRecorded).format("h:mm"))
    xValues.push(cryptoData.timeRecorded)
    yValues.push(cryptoData.price)
});

async function graph() {
    var trace1 = {
        type: "scatter",
        mode: "lines",
        x: xValues,
        y: yValues,
        line: { color: '#17BECF' }
    }

    var data = [trace1];

    yValues.sort((a, b) => a - b)

    var layout = {
        title: `${currency} Time Series - ${hoursBack}hr(s)`,
        filename: `${currency} Time Series - ${hoursBack}hr(s)`,
        fileopt: "overwrite",
        xaxis: {
            type: "linear",
            range: [0, 3]
        },
        yaxis: {

        }
    };

    await plotly.plot(data, layout, function (err, msg) {

        let graph = msg.url.split("/")
        graph = graph[graph.length - 1]

        plotly.getFigure('strikeriv', graph, function (err, figure) {
            if (err) return console.log(err);

            var imgOpts = {
                format: 'png',
                width: 1000,
                height: 500
            };

            plotly.getImage(figure, imgOpts, function (error, imageStream) {
                if (error) return console.log(error);

                var fileStream = fs.createWriteStream('2.png');
                imageStream.pipe(fileStream);
            });
        });
    });

}

graph()