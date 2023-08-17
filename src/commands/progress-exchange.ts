import {CommandDetails} from "./command-details";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {getExchangeOrThrow, setExchangeEndDate} from "../State";
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

    const playerNicknames = exchange.players.map(player => player.serverNickname)
    const randomRotateNumber = Math.floor(Math.random() * playerNicknames.length)
    const rotatedPlayerTags = rotateArray(playerNicknames, randomRotateNumber)

    for (const [index, player] of exchange.players.entries()) {
        player.drawnPlayerNickname = rotatedPlayerTags[index]
        await interaction.client.users.send(player.id,
            `Welcome to the exchange! You drew ${player.drawnPlayerNickname} (Server nickname: ${player.serverNickname})`)
    }

    const exchangeLength = Duration.fromISO(configuration.exchangeLength)
    const exchangeEndDate = DateTime.now().plus(exchangeLength)
    setExchangeEndDate(getGuildIDOrThrow(interaction), exchangeLength, exchangeEndDate)

    const playerList = exchange.players.map(player => "- " + player.toString)
    await interaction.channel!.send(`Assignments sent out! The following players are in the exchange: 
    ${playerList.join('\n')}
    
    The exchange will wrap <t:${exchangeEndDate.toUnixInteger()}:R>, and drawn players will be revealed around <t:${exchangeEndDate.toUnixInteger()}:f>
    `)

}

export const ProgressExchangeCommand: CommandDetails = {
    command: progressExchange,
    execute: execute
}