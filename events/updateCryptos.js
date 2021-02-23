const { Builder, ChromeOptions, Key } = require('selenium-webdriver');
const config = require("../utils/config.json");
const cheerio = require('cheerio');
const { arrayEquals, dbQuery, sleep, arrayDifference } = require('../structures/structures');
const { loadPages } = require('./loadPages');
const fs = require("fs");
const { diffieHellman } = require('crypto');
const { load } = require('cheerio');

require('chromedriver');

exports.updateCryptos = async (client) => {

    let cryptosToTrack = await dbQuery(client, "SELECT * FROM mastercryptos WHERE tracking = 1 ORDER BY symbol DESC")
    if (cryptosToTrack.error) return main()

    const driver = client.driver
    const tabs = await driver.getAllWindowHandles()

    let crypto_data = []

    function createCryptoObject(crypto, price, rv24, rev24, pc24, hl1, hl24, lt) {
        return CryptoObject = {
            "lastUpdated": Date.now(),
            "data": {
                "symbol": crypto.symbol,
                "name": crypto.name,
                "slug": crypto.slug,
                "market_data": {
                    "price": price,
                    "real-volume-24": rv24,
                    "reported-volume-24": rev24,
                    "percent-change-24-usd": pc24,
                    "high-low-1": {
                        "high": hl1[0],
                        "low": hl1[1]
                    },
                    "high-low-24": {
                        "high": hl24[0],
                        "low": hl24[1]
                    },
                    "last-trade": lt
                }
            }
        }

    }

    async function updateCrypto(tab) {
        try {
            await driver.switchTo().window(tab)
            await driver.navigate().refresh()
            await driver.sleep(250)

            const html = await driver.getPageSource()
            const $ = cheerio.load(html);

            let title = $('title').text().split("(")[0].trim()

            let crypto = await dbQuery(client, "SELECT * FROM mastercryptos WHERE name = ? LIMIT 1", [title])
            crypto = crypto.results[0]

            let price = $('h3:contains("Price (USD)")').parent().text().split("$")
            price = price[price.length - 1].replace(/,/g, "")
            console.log(crypto)
            console.log(crypto.symbol)

            if (crypto.symbol === "BTC") { } else {
                console.log("here")
                price = $('h3:contains("Price (BTC)")').parent().text().split(")")
                price = price[price.length - 1].replace(/,/g, "")

                console.log("here1")
                let bitcoin = require("../data/prices.json").find(crypto => crypto.data.slug === "bitcoin")
                console.log(price)
                console.log(bitcoin.data)
                price = price * bitcoin.data.market_data.price
                console.log(price, crypto.symbol)
            }

            price = parseFloat(price)

            let realvolume24 = $('h3:contains("Real Volume (24H)")').parent().text().split("$")
            realvolume24 = parseFloat(realvolume24[realvolume24.length - 1].replace(/,/g, ""))

            let reportedvolume24 = $('h3:contains("Reported Volume (24H)")').parent().text().split("$")
            reportedvolume24 = parseFloat(reportedvolume24[reportedvolume24.length - 1].replace(/,/g, ""))

            let percentchange24usd = $('h3:contains("Change vs USD (24H)")').parent().text().split(")")
            percentchange24usd = percentchange24usd[percentchange24usd.length - 1].replace(/%/g, "")

            let highlow1 = $('h3:contains("1Hr Low / 1Hr High")').parent().text().split("$")
            highlow1.splice(0, 1)
            highlow1[0] = parseFloat(highlow1[0].replace("/", "").replace(/,/g, "").trim())
            highlow1[1] = parseFloat(highlow1[1].replace(/,/g, ""))

            let highlow24 = $('h3:contains("24Hr Low / 24Hr High")').parent().text().split("$")
            highlow24.splice(0, 1)
            highlow24[0] = parseFloat(highlow24[0].replace("/", "").replace(/,/g, "").trim())
            highlow24[1] = parseFloat(highlow24[1].replace(/,/g, ""))

            let lasttrade = $('h3:contains("Last Trade")').parent().text().replace("Last Trade", "")
            crypto_data.push(createCryptoObject(crypto, price, realvolume24, reportedvolume24, percentchange24usd, highlow1, highlow24, lasttrade))

        } catch (any) {
            console.log(any)
            await sleep(500)
            return
        }

    }

    for (tab of tabs) {
        await updateCrypto(tab)
        await sleep(150)
    }

    fs.writeFile("data/prices.json", JSON.stringify(crypto_data, null, 2), (err) => {
        if (err)
            console.log(err);
        else {
            console.log("Cryptocurrencies have been updated.");
        }
    });

    function createDataObject(data) {
        return dataObject = {
            "timeRecorded": Date.now(),
            "price": data.data.market_data.price
        }
    }

    crypto_data.forEach(async (data) => {

        let path = `data/${data.data.slug}`
        // check path
        if (!fs.existsSync(`${path}`)) fs.mkdirSync(`${path}`)

        // check files 
        if (!fs.existsSync(`${path}/prices.json`)) {
            let obj = createDataObject(data)
            obj = [obj]
            await fs.writeFile(`${path}/prices.json`, JSON.stringify(obj, null, 2), (err) => { });
        } else {

            let file_data = fs.readFileSync(`${path}/prices.json`, 'utf8')

            file_data = JSON.parse(file_data)
            file_data.push(createDataObject(data))

            fs.writeFile(`${path}/prices.json`, JSON.stringify(file_data, null, 2), (err) => { });

        }

    });

    await sleep(1000);

    async function updateTabs() {

        let cryptosToTrackNew = await dbQuery(client, "SELECT * FROM mastercryptos WHERE tracking = 1 ORDER BY symbol DESC")
        if (cryptosToTrack.error) return main()

        let oldCryptosArray = []
        let newCryptosArray = []

        cryptosToTrack.results.forEach(crypto => {
            oldCryptosArray.push(crypto.symbol)
        })

        cryptosToTrackNew.results.forEach(crypto => {
            newCryptosArray.push(crypto.symbol)
        })

        oldCryptosArray.sort((a, b) => a.localeCompare(b))
        newCryptosArray.sort((a, b) => a.localeCompare(b))


        if (!arrayEquals(oldCryptosArray, newCryptosArray)) {
            // something has changed, some disabled or some enabled or both who knows ¯\_(ツ)_/¯

            await client.driver.quit();
            client.driver = await loadPages(client);

            cryptosToTrack = cryptosToTrackNew

        }

    }

    await updateTabs()

    await sleep(4000);
    return exports.updateCryptos(client);

}