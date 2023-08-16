import {ChatInputCommandInteraction} from "discord.js";

export function getGuildIDOrThrow(interaction: ChatInputCommandInteraction) {
    const potentialGuildId = interaction.guildId
    if (potentialGuildId) return potentialGuildId
    throw new Error("No guild ID was associated with this interaction")
}