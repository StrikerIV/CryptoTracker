const { Builder, ChromeOptions } = require('selenium-webdriver');
const config = require("../utils/config.json");
const cheerio = require('cheerio');

require('chromedriver');

exports.loadPages = async (client) => {

    async function main() {

        let driver = await new Builder().forBrowser('chrome').build();

        async function loadCryptoTab(crypto, index) {

            await driver.get(`https://messari.io/asset/${crypto[2]}/metrics`);
            await driver.sleep(1000)

            let html = await driver.getPageSource()

            let $ = cheerio.load(html);
            let title = $('title')

            console.log(title.text())

            await driver.switchTo().newWindow('tab')

        }

        for (const [index, crypto] of config.validSymbols.entries()) {
            await loadCryptoTab(crypto, index)
        }

        return driver

    }

    return main()

}