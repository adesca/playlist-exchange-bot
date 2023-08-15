import {ChatInputCommandInteraction, CollectorFilter, MessageReaction, SlashCommandBuilder, User} from "discord.js";


const startExchangeCommand = new SlashCommandBuilder()
    .setName("start-exchange")
    .setDescription("Let's start an exchange!")

const startExchangeCommandExecute = async function(interaction: ChatInputCommandInteraction) {
    await interaction.reply({content: 'Working on it!', ephemeral: true})

    const followupMessage = await interaction.followUp(`@${interaction.user.displayName} started an exchange. Who's in?
     React with :notes: if you are!`)

    const emojiFilter: CollectorFilter<[MessageReaction, User]> = (reaction) => false

    await followupMessage.react('🎶')
}

export type CommandDetails = {
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    command: SlashCommandBuilder
}

export const StartExchangeCommand: CommandDetails = {
    command: startExchangeCommand,
    execute: startExchangeCommandExecute
}