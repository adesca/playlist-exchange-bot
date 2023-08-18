import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {addNewExchangeWithoutPlayers, Exchange, getExchangeByNameOrUndefined} from "../store/State";
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
        try {

            let randomExchangeName = generateRandomSentence()
            for (let i = 0; i < 15; i++) {
                if (await getExchangeByNameOrUndefined(randomExchangeName) == undefined) break

                randomExchangeName = generateRandomSentence()
            }

            const followupMessage = await interaction.followUp(`${interaction.user.toString()} started the playlist exchange \`${randomExchangeName}\`. Who's in?
     React with :notes: if you are!`)

            await addNewExchangeWithoutPlayers(randomExchangeName, new Exchange(followupMessage.id, guildId, interaction.channelId, randomExchangeName))

            await followupMessage.react('🎶')

        } catch (e) {
            console.log('caught it ', e)
        }
    } else {
        await interaction.reply({content: `You don't seem to be in a discord server`, ephemeral: true})
    }
}

export const StartExchangeCommand: CommandDetails = {
    command: startExchangeCommand,
    execute: startExchangeCommandExecute
}