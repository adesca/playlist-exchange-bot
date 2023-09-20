import {MessageReaction, PartialMessageReaction} from "discord.js";
import {getExchangeBySignupMessageIdOrThrow, setExchangePlayers} from "../store/State";

export async function updateListOfPlayersOnMessageReactChanges(interaction: MessageReaction | PartialMessageReaction) {

    console.log('New reaction on exchange with signup id ', interaction.message.id)
    const exchange = await getExchangeBySignupMessageIdOrThrow(interaction.message.id)
    console.log('aka ', exchange.exchangeName, ' : ', interaction.message.id)

    const message = await interaction.message.fetch()
    const users = await message.reactions.cache.get('🎶')?.users.fetch()
    if (users === undefined) {
        console.log('No users were found in the message reactions ')
        return;
    }

    const usersInExchangePromises = users
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
        console.log('Setting users', usersInExchange, ' in exchange ', exchange.exchangeName)
        setExchangePlayers(exchange.exchangeName, usersInExchange)
    })


}