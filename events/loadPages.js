const { Builder, ChromeOptions } = require('selenium-webdriver');
const config = require("../utils/config.json");
const cheerio = require('cheerio');
const { dbQuery, sleep } = require('../structures/structures');

require('chromedriver');

exports.loadPages = async (client) => {

    async function main() {

        let cryptosToTrack = await dbQuery(client, "SELECT * FROM mastercryptos WHERE tracking = 1")
        if (cryptosToTrack.error) {
            await sleep(5000)
            return main()
        }

        let driver = await new Builder().forBrowser('chrome').build();

        async function loadCryptoTab(crypto) {

            driver.get(`https://messari.io/asset/${crypto.slug}/metrics`);

            let html = await driver.getPageSource()

            let $ = cheerio.load(html);

            await driver.switchTo().newWindow('tab')

        }

        for (const crypto of cryptosToTrack.results) {
            await loadCryptoTab(crypto)
        }

        driver.close();
        return driver

    }

    return main()

}