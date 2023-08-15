import {ChatInputCommandInteraction, CollectorFilter, MessageReaction, SlashCommandBuilder, User} from "discord.js";
import {Exchange, signupMessageIdMappedToExchange} from "../SignupMessageIdMappedToExchange";


const startExchangeCommand = new SlashCommandBuilder()
    .setName("start-exchange")
    .setDescription("Let's start an exchange!")

const startExchangeCommandExecute = async function(interaction: ChatInputCommandInteraction) {
    await interaction.reply({content: 'Working on it!', ephemeral: true})

    const followupMessage = await interaction.followUp(`${interaction.user.toString()} started an exchange. Who's in?
     React with :notes: if you are!`)

    signupMessageIdMappedToExchange.set(followupMessage.id, new Exchange(followupMessage.id))

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