import {DateTime, Duration} from "luxon";
import {configuration} from "../config";
import {InMemoryStore} from "./in-memory/InMemoryStore";
import {DatabaseBackedStore} from "./database/DatabaseBackedStore";
import {Store} from "./StoreInterface";

const store: Store = configuration.useInMemoryDatastore ? new InMemoryStore() : new DatabaseBackedStore()

export async function getExchangeByNameOrUndefined(id: string): Promise<Exchange | undefined> {
    return store.getExchangeByNameOrUndefined(id)
}

export async function addNewExchangeWithoutPlayers(id: string, exchange: Exchange) {
    await store.addNewExchangeWithoutPlayers(id, exchange)
}

export async function getAllExchangesThatHaventEnded(): Promise<Exchange[]> {
    return store.getAllExchangesThatHaventEnded();
}

export async function turnOffReminderSending(exchangeName: string) {
    await store.turnOffReminderSending(exchangeName)
}

export async function endExchange(guildId: string) {
    await store.endExchange(guildId)
}

export async function getExchangeByNameOrThrow(exchangeId: string) {
    return store.getExchangeByNameOrThrow(exchangeId)
}

export async function progressExchangeOrThrow(exchangeName:string, newPhase: 'collecting playlists') {
    return store.progressExchangeOrThrow(exchangeName, newPhase)
}

export async function getExchangeBySignupMessageIdOrThrow(signupMessageId: string) {
    return store.getExchangeBySignupMessageIdOrThrow(signupMessageId)
}

export async function setExchangeEndDate(exchangeId: string, durationBeforeEndToSendReminder: Duration, exchangeEndDate: DateTime) {
    return store.setExchangeEndDate(exchangeId, durationBeforeEndToSendReminder, exchangeEndDate)
}

export async function setExchangePlayers(exchangeName: string, players: ExchangePlayer[]) {
    return store.setExchangePlayers(exchangeName, players)
}

export class Exchange {
    players: ExchangePlayer[]
    phase: 'initiated' | 'collecting playlists'
    public exchangeEndDate = DateTime.fromSeconds(0);
    public exchangeReminderDate = DateTime.fromSeconds(0);

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
    discordId: string,
    serverNickname: string,
    toString: string,
    drawnPlayerNickname?: string
}