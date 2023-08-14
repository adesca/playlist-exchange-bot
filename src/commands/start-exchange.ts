import {CommandInteraction, SlashCommandBuilder} from "discord.js";


const startExchangeCommand = new SlashCommandBuilder()
    .setName("start-exchange")
    .setDescription("Let's start an exchange!")

const startExchangeCommandExecute = async function(interaction: CommandInteraction) {
    await interaction.reply('pong!')
}

export type CommandDetails = {
    execute: (interaction: CommandInteraction) => Promise<void>;
    command: SlashCommandBuilder
}

export const StartExchangeCommand: CommandDetails = {
    command: startExchangeCommand,
    execute: startExchangeCommandExecute
}