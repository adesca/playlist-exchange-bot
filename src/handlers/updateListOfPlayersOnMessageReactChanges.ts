import {MessageReaction, PartialMessageReaction} from "discord.js";
import {getExchangeBySignupMessageIdOrThrow, setExchangePlayers} from "../store/State";

export async function updateListOfPlayersOnMessageReactChanges(interaction: MessageReaction | PartialMessageReaction) {


    const exchange = await getExchangeBySignupMessageIdOrThrow(interaction.message.id)

    const usersInExchangePromises = interaction.users.cache
        .filter(usersWithReactions => !usersWithReactions.bot)
        .map(async userWithReactions => {
            const user = await interaction.message.guild!.members.fetch(userWithReactions.id)

            return {
                discordId: userWithReactions.id,
                toString: userWithReactions.toString(),
                serverNickname: user.nickname || userWithReactions.displayName,
                tag: userWithReactions.tag,
            }
        })

    Promise.all(usersInExchangePromises).then(usersInExchange => {
        setExchangePlayers(exchange.exchangeName, usersInExchange)
    })


}