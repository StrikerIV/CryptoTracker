const { loadEventExports } = require("./events/eventsHandler.js");
const config = require("./utils/config.json");
const Discord = require("discord.js");
const { parse } = require("path");
const glob = require("glob");
const { loadPages } = require("./events/loadPages.js");
const database = require("./utils/database.json");
const { createPool } = require("./structures/structures.js");

async function initalizeBot() {

    let eventExports = await loadEventExports()

    const client = new Discord.Client();
    client.commands = new Discord.Collection();

    console.log("\nInitialized! Loading commands...\n")

    glob(__dirname + "/commands/**/*{.js,.ts}", (_, files) => {
        files.forEach(file => {
            const { name } = parse(file)
            const props = require(file)
            client.commands.set(name, props);
        })
    });

    glob(__dirname + "/messageEvent/**/*{.js,.ts}", (_, files) => {
        files.forEach(file => {
            const { name } = parse(file)
            const props = require(file)
            client.on(name, props.bind(null, client));
        })
    });

    client.pool = await createPool(client)
    client.driver = await loadPages(client)

    client.once('ready', () => { eventExports.ready(client) })

    client.login(config.token)

}

initalizeBot()