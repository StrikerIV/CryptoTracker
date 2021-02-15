const { reactionQuestion, dbQuery, success, ongoing, error } = require("../structures/structures.js");
const config = require("../utils/config.json");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {

    if (!config.admins.includes(message.author.id)) return message.channel.send(error(client, "Only licensed administrators can use this command."))

    if (!args[1]) return message.channel.send(error(client, "Supply a cryptocurrency to trigger on."))
    if (!config.validSymbols.includes(args[1].toLowerCase())) return message.channel.send(error(client, "This cryptocurrency is not supported."))

    if (!args[2]) return message.channel.send(error(client, "Command requires high or low value.\n\nEx. - \`!trigger btc high 50000\`."))
    if (!config.validValues.includes(args[2].toLowerCase())) return message.channel.send(error(client, "Currently \`high\` and \`low\` are only supported."))

    if (!args[3]) return message.channel.send(error(client, "Supply a value to trigger on."))
    if (!typeof (args[3]) == "number") return message.channel.send(error(client, "Supply a valid value."))

    let update = await dbQuery(client, `INSERT INTO triggers(user_id, symbol, value, triggervalue) VALUES(?, ?, ?, ?)`, [message.author.id, args[1].toLowerCase(), args[2].toLowerCase(), parseInt(args[3])])
    if (update.error) return message.channel.send(error(client, "Something went wrong with the database. Try again later."))

    return message.channel.send(success(client, `A ${args[2].toLowerCase()} trigger has been enabled for \`${args[1].toUpperCase()}\`.\n\nPrice : \`${args[3]}\``))

}