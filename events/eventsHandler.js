const path = require('path');
const fs = require('fs');

async function loadEventExports() {

    let exports = {}

    return new Promise((result) => {
        fs.readdir(__dirname, function (err, files) {
            files.forEach(function (file) {
                if (file === 'eventsHandler.js') return
                const { name } = path.parse(file)
                let actualFile = require(`./${file}`)
                let eventExport = actualFile[Object.keys(actualFile)[0]];
                exports[name] = eventExport
                result(exports)
            });
        });
    });


}

module.exports = {
    loadEventExports: loadEventExports,
}