import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Exchange, state} from "../State";
import {CommandDetails} from "./command-details";


const startExchangeCommand = new SlashCommandBuilder()
    .setName("start-exchange")
    .setDescription("Let's start an exchange!")

const startExchangeCommandExecute = async function (interaction: ChatInputCommandInteraction) {
    await interaction.reply({content: 'Working on it!', ephemeral: true})

    const guildId = interaction.guildId
    if (guildId) {
        const followupMessage = await interaction.followUp(`${interaction.user.toString()} started an exchange. Who's in?
     React with :notes: if you are!`)

        state.set(guildId, new Exchange(followupMessage.id, guildId))

        await followupMessage.react('🎶')
    } else {
        await interaction.reply({content: `You don't seem to be in a discord server`, ephemeral: true})
    }
}

export const StartExchangeCommand: CommandDetails = {
    command: startExchangeCommand,
    execute: startExchangeCommandExecute
}