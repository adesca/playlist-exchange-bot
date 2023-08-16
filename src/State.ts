import {Collection} from "discord.js";
import {DateTime, Duration} from "luxon";
import {configuration} from "./config";

export const state = new Collection<string, Exchange>()

export function getAllExchangesThatHaventEnded() {
    return [...state.values()]
        .filter(exchange => exchange.phase !== 'initiated')
        .filter(exchange => !exchange.exchangeEnded)
}

export function turnOffReminderSending(guildId: string) {
    state.get(guildId)!.reminderSent = true
}

export function endExchange(guildId: string) {
    state.get(guildId)!.exchangeEnded = true
}

export function getExchangeOrThrow(guildId: string) {
    const potentialExchange = state.get(guildId)
    if (potentialExchange) return potentialExchange
    throw new Error("No exchange found for server " + guildId)
}

export function setExchangeEndDate(guildId: string, exchangeLength: Duration, exchangeEndDate: DateTime) {
    const exchange = getExchangeOrThrow(guildId)
    exchange.exchangeEndDate = exchangeEndDate.toUnixInteger()
    exchange.exchangeReminderDate = exchangeEndDate.minus(Duration.fromISO(configuration.remindAt)).toUnixInteger()

}

export class Exchange {
    players: ExchangePlayer[]
    phase: 'initiated' | 'collecting playlists'
    public exchangeEndDate: number = 0;
    public exchangeReminderDate: number = 0;

    public reminderSent = false;
    public exchangeEnded = false;

    constructor(public signupMessageId: string, public guildId: string, public channelId: string) {
        this.players = []
        this.phase = 'initiated'
    }
}

interface ExchangePlayer {
    tag: string,
    id: string,
    serverNickname: string,
    toString: string,
    drawnPlayerTag?: string
}