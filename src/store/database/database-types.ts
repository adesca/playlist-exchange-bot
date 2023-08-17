import {Generated, Insertable, Selectable, Updateable} from "kysely";

export interface Database {
    exchange: ExchangeTable,
    player: PlayerTable
}

interface ExchangeTable {
    id: Generated<string>
    phase: 'initiated' | 'collecting playlists'
    exchangeEndDate: Date | null
    exchangeReminderDate: Date | null

    reminderSent: boolean | null
    exchangeEnded: boolean | null

    signupMessageId: string,
    guildId: string,
    channelId: string,
    exchangeName: string
}

export type QueriedExchange = Selectable<ExchangeTable>
export type NewExchange = Insertable<ExchangeTable>
export type ExchangeUpdate = Updateable<ExchangeTable>
export interface PlayerTable {
    tag: string,
    id: Generated<string>,
    serverNickname: string,
    toString: string,
    drawnPlayerNickname: string | null
}

export type QueriedPlayer = Selectable<PlayerTable>
export type NewPlayer = Insertable<PlayerTable>
export type PlayerUpdate = Updateable<PlayerTable>

