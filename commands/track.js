const { reactionQuestion, dbQuery, success, ongoing, error } = require("../structures/structures.js");
const config = require("../utils/config.json");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {

    if (!config.admins.includes(message.author.id)) return message.channel.send(error(client, "Only licensed administrators can use this command."))

    if (!args[1]) return message.channel.send(error(client, "Supply a cryptocurrency to track."))
    if (!config.validSymbols.includes(args[1].toLowerCase())) return message.channel.send(error(client, "This cryptocurrency is not supported."))

    let symbol = args[1].toLowerCase()
    let crypto = await dbQuery(client, `SELECT * FROM mastercryptos WHERE symbol = ? LIMIT 1`, [symbol])

    if (crypto.error) return message.channel.send(error(client, "Something went wrong with the database. Try again later."))
    crypto = crypto.results[0]

    if (crypto.tracking === 1) {

        let questionMessage = await message.channel.send(ongoing(`This cryptocurrency is already being tracked. Would you like to disable tracking?`, false, "You have 30 seconds to make a decision."))
        let choice = await reactionQuestion(client, message, questionMessage)

        if (choice) {
            let update = dbQuery(client, `UPDATE mastercryptos SET tracking = 0 WHERE symbol = ? LIMIT 1`, [symbol, 0])
            if (update.error) return message.channel.send(error(client, "Something went wrong with the database. Try again later."))

            return message.channel.send(success(client, `Tracking for \`${symbol.toUpperCase()}\` has been disabled.`))
        } else {
            return message.channel.send(success(client, `Tracking for \`${symbol.toUpperCase()}\` has stayed enabled.`))
        }

    } else {
        let update = dbQuery(client, `UPDATE mastercryptos SET tracking = 1 WHERE symbol = ? LIMIT 1`, [symbol, 0])
        if (update.error) return message.channel.send(error(client, "Something went wrong with the database. Try again later."))

        return message.channel.send(success(client, `Tracking for \`${symbol.toUpperCase()}\` has been enabled.`))
    }

}