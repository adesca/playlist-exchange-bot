import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {addNewExchange, Exchange, getExchangeById} from "../State";
import {CommandDetails} from "./command-details";
import {generateRandomSentence} from "./dictionary-util";


const startExchangeCommand = new SlashCommandBuilder()
    .setName("start-exchange")
    .setDescription("Let's start an exchange!")
    .setDMPermission(false)

const startExchangeCommandExecute = async function (interaction: ChatInputCommandInteraction) {
    await interaction.reply({content: 'Working on it!', ephemeral: true})

    const guildId = interaction.guildId
    if (guildId) {
        let randomExchangeName = generateRandomSentence()
        for (let i=0; i< 15; i++) {
            if (getExchangeById(randomExchangeName) == undefined) break

            randomExchangeName = generateRandomSentence()
        }

        const followupMessage = await interaction.followUp(`${interaction.user.toString()} started the playlist exchange \`${randomExchangeName}\`. Who's in?
     React with :notes: if you are!`)

        addNewExchange(randomExchangeName, new Exchange(followupMessage.id, guildId, interaction.channelId, randomExchangeName))

        await followupMessage.react('🎶')
    } else {
        await interaction.reply({content: `You don't seem to be in a discord server`, ephemeral: true})
    }
}

export const StartExchangeCommand: CommandDetails = {
    command: startExchangeCommand,
    execute: startExchangeCommandExecute
}