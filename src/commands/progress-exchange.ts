import {CommandDetails} from "./command-details";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {getExchangeOrThrow} from "../State";
import {getGuildIDOrThrow, rotateArray} from "../util";
import {DateTime, Duration} from "luxon";
import {configuration} from "../config";

/*
todo:
- [ ] check that the exchange being progressed exists
- [ ] progress the exchange from initiated to "collecting playlists"
- [ ] (Stretch) check that there's at least 3 people
*/

const progressExchange = new SlashCommandBuilder()
    .setName("progress-exchange")
    .setDescription("Progress a currently in progress exchange")

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({content: 'Working on it!', ephemeral: true})

    const exchange = getExchangeOrThrow(getGuildIDOrThrow(interaction))
    exchange.phase = 'collecting playlists'

    const playerTags = exchange.players.map(player => player.tag)
    const randomRotateNumber = Math.floor(Math.random() * playerTags.length)
    const rotatedPlayerTags = rotateArray(playerTags, randomRotateNumber)

    for (const [index, player] of exchange.players.entries()) {
        player.drawnPlayerTag = rotatedPlayerTags[index]
        await interaction.client.users.send(player.id,
            `Welcome to the exchange! You drew ${player.drawnPlayerTag} (Server nickname: ${player.serverNickname})`)
    }

    const exchangeLength = Duration.fromISO(configuration.exchangeLength)
    const exchangeEndDate = DateTime.now().plus(exchangeLength).toUnixInteger()

    const playerList = exchange.players.map(player => "- " + player.toString)
    await interaction.channel!.send(`Assignments sent out! The following players are in the exchange: 
    ${playerList.join('\n')}
    
    The exchange will wrap <t:${exchangeEndDate}:R>, and drawn players will be revealed on <t:${exchangeEndDate}:f>
    `)

}

export const ProgressExchangeCommand: CommandDetails = {
    command: progressExchange,
    execute: execute
}