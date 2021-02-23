const Discord = require("discord.js");
const mysql = require('mysql')
const database = require("../utils/database.json")
const { reactionCollector } = require("../events/reactionCollector");
const message = require("../messageEvent/message");

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Discord.Message} reactionMessage 
 */

async function reactionQuestion(client, message, reactionMessage) {

    reactionMessage.react(client.krytcheck)
    reactionMessage.react(client.krytx)

    let reaction = await reactionCollector(message, reactionMessage)
    if (!reaction.first()) return message.channel.send(error(client, "Timed out."))
    reaction = reaction.first()

    if (reaction.emoji.name === 'krytcheck') {
        return true
    } else {
        return false
    }


}

async function createPool(client) {
    return new Promise(async (result) => {
        let pool = await mysql.createPool(database);
        result(pool)
    })
}


/**
 * @param {Discord.Client} client 
 * @param {String} query 
 * @param {Array} params 
 */

async function dbQuery(client, query, params) {

    try {
        let result = await new Promise((result) => {
            client.pool.query(query, params, async function (error, results, fields) {
                returnObject = {
                    error: error,
                    results: results,
                    fields: fields,
                }
                result(returnObject)
            })
        })

        if (result.error) {
            if (result.error.code === "ETIMEDOUT") throw new Error("ETIMEDOUT")
        }

        return result

    } catch (any) {
        console.log("Connection timeout from database -> Network Down...? Retrying connection.")
        await sleep(5000)
        return dbQuery(client, query, params)
    }
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {String} error 
 * @param {String} title 
 */

function error(client, error, title) {
    let errorEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(`${client.krytx} ${error}`)

    if (title) {
        errorEmbed.setTitle(title)
    }

    return errorEmbed
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {String} success 
 * @param {String} title 
 * @param {String} footer
 */

function success(client, success, title, footer) {
    let successEmbed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setDescription(`${client.krytcheck} ${success}`)

    if (title) {
        successEmbed.setTitle(title)
    }

    if (footer) {
        successEmbed.setFooter(footer)
    }

    return successEmbed
}

/**
 * 
 * @param {String} ongoing 
 * @param {String} author 
 * @param {String} footer 
 */

function ongoing(ongoing, author, footer) {
    let ongoingEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription(`${ongoing}`)

    if (author) {
        ongoingEmbed.setTitle(author)
    }

    if (footer) {
        ongoingEmbed.setFooter(footer)
    }

    return ongoingEmbed
}

/**
 * 
 * @param {Number} milliseconds 
 */

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

/**
 * 
 * @param {Array} a
 * @param {Array} b 
 */
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

/**
 * 
 * @param {Array} a
 * @param {Array} b 
 */
function arrayDifference(a, b) {
    return a.filter(function (a) {
        return b.indexOf(a) == -1;
    });
}

module.exports = {
    reactionQuestion: reactionQuestion,
    arrayDifference: arrayDifference,
    arrayEquals: arrayEquals,
    createPool: createPool,
    dbQuery: dbQuery,
    success: success,
    ongoing: ongoing,
    sleep: sleep,
    error: error
}