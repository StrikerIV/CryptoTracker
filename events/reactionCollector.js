exports.reactionCollector = async (message, msg) => {

    let filter = (reaction, user) => user.id === message.author.id
    let reaction = await msg.awaitReactions(filter, { max: 1, time: 30000 })
        .then((r) => {
            return r
        })

    return reaction

}