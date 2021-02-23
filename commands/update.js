const { dbQuery } = require('../structures/structures.js')

exports.run = async (client, message, args) => {

    let prices = require("../utils/allprices.json");
    prices = JSON.parse(JSON.stringify(prices, null, 2))

    prices.data.forEach(crypto => {
        console.log(crypto.symbol, crypto.name, crypto.slug)
        dbQuery(client, "INSERT INTO mastercryptos(symbol, name, slug) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE slug = ?", [crypto.symbol, crypto.name, crypto.slug, crypto.slug])
    })

}