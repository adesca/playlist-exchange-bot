import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export interface CommandDetails {
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    command: SlashCommandBuilder
}