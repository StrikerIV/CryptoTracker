const config = require("../utils/config.json");

module.exports = (client, message) => {

    if (message.author.bot) return;
    message.content = message.content
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    let command = args[0].toLowerCase();
    let cmd = client.commands.get(command);

    if (!cmd) {
        client.commands.each(Command => {
            let aliass = Command.commandInfo
            if (!aliass) return
            aliass = aliass.alias
            if (!aliass) return
            if (!aliass.includes(command)) return
            cmd = client.commands.get(Command.commandInfo.name);
        })
    };

    if (!cmd) return;

    cmd.run(client, message, args);

};