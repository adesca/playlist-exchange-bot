import {CommandDetails} from "./command-details";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {getExchangeOrThrow} from "../State";
import {getGuildIDOrThrow} from "../util";

/*
todo:
- [ ] check that the exchange being progressed exists
- [ ] progress the exchange from initiated to "collecting playlists"
*/

const progressExchange = new SlashCommandBuilder()
    .setName("progress-exchange")
    .setDescription("Progress a currently in progress exchange")

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({content: 'Working on it!', ephemeral: true})

    const exchange = getExchangeOrThrow(getGuildIDOrThrow(interaction))
    exchange.phase = 'collecting playlists'



}

export const ProgressExchangeCommand: CommandDetails = {
    command: progressExchange,
    execute: execute
}