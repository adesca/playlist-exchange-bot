import {MessageReaction, PartialMessageReaction} from "discord.js";
import {signupMessageIdMappedToExchange} from "../SignupMessageIdMappedToExchange";

export async function updateListOfPlayersOnMessageReactChanges(interaction: MessageReaction | PartialMessageReaction) {

    const isMessageUsedForTrackingAnExchange = signupMessageIdMappedToExchange.has(interaction.message.id)

    if (isMessageUsedForTrackingAnExchange) {

        const usersInExchange = interaction.users.cache
            .filter(usersWithReactions => !usersWithReactions.bot)
            .map(usersWithReactions => {
                return {
                    tag: usersWithReactions.tag
                }
            })

        signupMessageIdMappedToExchange.get(interaction.message.id)!.players = usersInExchange

    }
}