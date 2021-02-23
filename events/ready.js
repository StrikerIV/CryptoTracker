const config = require("../utils/config.json")
const cheerio = require('cheerio');
const request = require('request');
const got = require("got")
const fs = require("fs");
const { dbQuery, sleep } = require("../structures/structures");
const { Builder, By, Key, util } = require("selenium-webdriver");
const { updateCryptos } = require("./updateCryptos");
const { promisify } = require('util')

exports.ready = async (client) => {

    client.guilds.fetch('671577661952360459').then(function (guild) {
        let emojis = guild.emojis.cache
        client.krytcheck = emojis.find(emoji => emoji.name == 'krytcheck')
        client.krytx = emojis.find(emoji => emoji.name == 'krytx')
    })

    console.log("Ready!\n")

    updateCryptos(client)

}
