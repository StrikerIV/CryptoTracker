const { dbQuery, sleep } = require('./structures/structures.js')

let prices = require("./utils/allprices.json");
prices = JSON.parse(JSON.stringify(prices, null, 2))

prices.data.forEach(crypto => {
    sleep(100)
    let result = dbQuery(client, "SELECT * FROM mastercryptos WHERE slug = ?", [crypto.slug])
    console.log(result)
    if (!result.results) {
        dbQuery(client, "INSERT INTO mastercryptos(symbol, name, slug, tracking) VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE slug = ?", [crypto.symbol, crypto.name, crypto.slug, crypto.slug])
    }
})
