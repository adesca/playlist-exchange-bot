import {Collection} from "discord.js";

export const state = new Collection<string, Exchange>()

export function getExchangeOrThrow(guildId: string) {
    const potentialExchange = state.get(guildId)
    if (potentialExchange) return potentialExchange
    throw new Error("No exchange found for server " + guildId)
}

export class Exchange {
    players: unknown[]
    phase: 'initiated' | 'collecting playlists'

    constructor(public signupMessageId: string, public guildId: string) {
        this.players = []
        this.phase = 'initiated'
    }
}

