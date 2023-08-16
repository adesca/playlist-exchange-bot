import {MessageReaction, PartialMessageReaction} from "discord.js";
import {getExchangeOrThrow, state} from "../State";

export async function updateListOfPlayersOnMessageReactChanges(interaction: MessageReaction | PartialMessageReaction) {

    const guildId = interaction.message.guildId
    if (!guildId) return

    const exchange = getExchangeOrThrow(guildId)

    const isMessageUsedForTrackingAnExchange = exchange.signupMessageId === interaction.message.id

    if (isMessageUsedForTrackingAnExchange) {

        const usersInExchange = interaction.users.cache
            .filter(usersWithReactions => !usersWithReactions.bot)
            .map(userWithReactions => {
                return {
                    id: userWithReactions.id,
                    tag: userWithReactions.tag
                }
            })

        exchange.players = usersInExchange

    }
}