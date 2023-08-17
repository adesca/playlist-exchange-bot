import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {SharedSlashCommandOptions} from "@discordjs/builders";

export interface CommandDetails {
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    command: SlashCommandBuilder
}