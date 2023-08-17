import {Collection} from "discord.js";
import {DateTime, Duration} from "luxon";
import {configuration} from "./config";

export const state = new Collection<string, Exchange>()

export function getExchangeById(id: string) {
    return state.get(id)
}

export function addNewExchange(id: string, exchange: Exchange) {
    state.set(id, exchange)
}

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

export function getExchangeOrThrow(exchangeId: string) {
    const potentialExchange = state.get(exchangeId)
    if (potentialExchange) return potentialExchange
    throw new Error("No exchange found for server " + exchangeId)
}

export function getExchangeBySignupMessageIdOrThrow(signupMessageId: string) {
    const potentialExchange = [...state.values()]
        .filter(exchange => exchange.signupMessageId === signupMessageId)
        .pop()

    if (potentialExchange) return potentialExchange
    throw new Error("No open exchanges found for the reacted message ")
}

export function setExchangeEndDate(exchangeId: string, exchangeLength: Duration, exchangeEndDate: DateTime) {
    const exchange = getExchangeById(exchangeId)!
    exchange.exchangeEndDate = exchangeEndDate.toUnixInteger()
    exchange.exchangeReminderDate = exchangeEndDate.minus(Duration.fromISO(configuration.remindAt)).toUnixInteger()

}

export function setExchangePlayers(exchangeName: string, players: ExchangePlayer[]) {
    state.get(exchangeName)!.players = players
}

export class Exchange {
    players: ExchangePlayer[]
    phase: 'initiated' | 'collecting playlists'
    public exchangeEndDate: number = 0;
    public exchangeReminderDate: number = 0;

    public reminderSent = false;
    public exchangeEnded = false;

    constructor(public signupMessageId: string, public guildId: string, public channelId: string,
                public exchangeName: string) {
        this.players = []
        this.phase = 'initiated'
    }
}

interface ExchangePlayer {
    tag: string,
    id: string,
    serverNickname: string,
    toString: string,
    drawnPlayerNickname?: string
}