const database = require("../utils/database.json")
const config = require("../utils/config.json")
const cheerio = require('cheerio');
const request = require('request');
const mysql = require('mysql');
const got = require("got")
const fs = require("fs");
const { dbQuery } = require("../structures/structures");
const { Builder, By, Key, util } = require("selenium-webdriver");

exports.ready = async (client) => {

    const pool = await mysql.createPool(database);
    const driver = client.driver
    client.pool = pool

    client.guilds.fetch('671577661952360459').then(function (guild) {
        let emojis = guild.emojis.cache
        client.krytcheck = emojis.find(emoji => emoji.name == 'krytcheck')
        client.krytx = emojis.find(emoji => emoji.name == 'krytx')
    })

    console.log("Ready!\n")

}
