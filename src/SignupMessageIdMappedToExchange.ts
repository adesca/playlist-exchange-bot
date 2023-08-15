import {Collection} from "discord.js";

export const signupMessageIdMappedToExchange = new Collection<string, Exchange>()

export class Exchange {
    players: unknown[]
    // signupMessageId: string;

    constructor(public signupMessageId: string) {
        this.players = []
    }
}

