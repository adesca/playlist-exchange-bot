import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {getExchangeBySignupMessageIdOrThrow, setExchangePlayers} from "../store/State";

const manuallyAddPeople = new SlashCommandBuilder()
    .setName("update-exchange-end-time")
    .setDescription("Update ")
    .addStringOption(option =>
        option
            .setName("exchange-message-id")
            .setDescription("The message with the exchange reacts")
            .setRequired(true))

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({content: 'Working on it!', ephemeral: true})

    const messageId = interaction.options.getString("exchange-message-id")!

    const exchange = await getExchangeBySignupMessageIdOrThrow(messageId)
    const message = await interaction.channel!.messages.fetch(messageId)


    const users = await message.reactions.cache.get('🎶')?.users.fetch()

    if (users === undefined) return;

    const usersInExchangePromises = users
        .filter(usersWithReactions => !usersWithReactions.bot)
        .map(async userWithReactions => {
            try {
                const user = await interaction.guild!.members.fetch(userWithReactions.id)

                return {
                    discordId: userWithReactions.id,
                    toString: userWithReactions.toString(),
                    serverNickname: user.nickname || userWithReactions.displayName,
                    tag: userWithReactions.tag,
                }
            } catch (e) {
                console.log('User is no longer in discord, defaulting to normal user data for ', userWithReactions.tag)
                return {
                    discordId: userWithReactions.id,
                    toString: userWithReactions.toString(),
                    serverNickname: userWithReactions.displayName,
                    tag: userWithReactions.tag,
                }
            }

        })
        .filter(maybeUser => maybeUser != undefined)

    const usersInExchange = await Promise.all(usersInExchangePromises)
    await setExchangePlayers(exchange.exchangeName, usersInExchange)

}

export const ManuallyAddPeopleCommand = {
    command: manuallyAddPeople as SlashCommandBuilder,
    execute: execute
}