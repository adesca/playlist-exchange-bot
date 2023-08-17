import {Collection} from "discord.js";
import {DateTime, Duration} from "luxon";
import {configuration} from "../config";
import {InMemoryStore} from "./in-memory/InMemoryStore";
import {DatabaseBackedStore} from "./database/DatabaseBackedStore";

const store = configuration.useInMemoryDatastore ? new InMemoryStore() : new DatabaseBackedStore()

export function getExchangeById(id: string) {
    return store.getExchangeById(id)
}

export function addNewExchange(id: string, exchange: Exchange) {
    store.addNewExchange(id, exchange)
}

export function getAllExchangesThatHaventEnded() {
    return store.getAllExchangesThatHaventEnded()
}

export function turnOffReminderSending(guildId: string) {
    store.turnOffReminderSending(guildId)
}

export function endExchange(guildId: string) {
    store.endExchange(guildId)
}

export function getExchangeOrThrow(exchangeId: string) {
    return store.getExchangeOrThrow(exchangeId)
}

export function getExchangeBySignupMessageIdOrThrow(signupMessageId: string) {
    return store.getExchangeBySignupMessageIdOrThrow(signupMessageId)
}

export function setExchangeEndDate(exchangeId: string, exchangeLength: Duration, exchangeEndDate: DateTime) {
    return store.setExchangeEndDate(exchangeId, exchangeLength, exchangeEndDate)
}

export function setExchangePlayers(exchangeName: string, players: ExchangePlayer[]) {
    return store.setExchangePlayers(exchangeName, players)
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

export interface ExchangePlayer {
    tag: string,
    id: string,
    serverNickname: string,
    toString: string,
    drawnPlayerNickname?: string
}