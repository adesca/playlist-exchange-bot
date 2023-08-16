import {ChatInputCommandInteraction} from "discord.js";

export function getGuildIDOrThrow(interaction: ChatInputCommandInteraction) {
    const potentialGuildId = interaction.guildId
    if (potentialGuildId) return potentialGuildId
    throw new Error("No guild ID was associated with this interaction")
}

export function rotateArray(arr: string[], count: number) {
    if (count == arr.length || count == 0) {
        count = 1
    }

    return [...arr.slice(count, arr.length), ...arr.slice(0,count)]
}