const Discord = require("discord.js");
const { reactionCollector } = require("../events/reactionCollector");
const message = require("../messageEvent/message");

/**
 * 
 * @param {client} client 
 * @param {message} message 
 * @param {message} reactionMessage 
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


/**
 * 
 * @param {string} query 
 * @param {array} params 
 */

async function dbQuery(client, query, params) {

    return new Promise((result) => {
        client.pool.query(query, params, function (error, results, fields) {
            if (error) throw error;
            returnObject = {
                error: error,
                results: results,
                fields: fields,
            }
            result(returnObject)
        })
    })
}

/**
 * 
 * @param {client} client 
 * @param {string} error 
 * @param {string} title 
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
 * @param {client} client 
 * @param {string} success 
 * @param {string} title 
 * @param {string} footer
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
 * @param {string} ongoing 
 * @param {string} author 
 * @param {string} footer 
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

module.exports = {
    reactionQuestion: reactionQuestion,
    dbQuery: dbQuery,
    success: success,
    ongoing: ongoing,
    error: error
}