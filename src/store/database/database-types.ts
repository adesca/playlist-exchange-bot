import {Generated, Insertable, Selectable, Updateable} from "kysely";

export interface Database {
    exchanges: ExchangeTable,
    players: PlayerTable
}

interface ExchangeTable {
    id: Generated<string>
    phase: 'initiated' | 'collecting playlists'
    exchange_end_date: Date | null
    exchange_reminder_date: Date | null

    reminder_sent: boolean | null
    exchange_ended: boolean | null

    signup_message_id: string,
    guild_id: string,
    channel_id: string,
    exchange_name: string
}

export type QueriedExchange = Selectable<ExchangeTable>
export type NewExchange = Insertable<ExchangeTable>
export type ExchangeUpdate = Updateable<ExchangeTable>
export interface PlayerTable {
    tag: string,
    id: Generated<string>,
    server_nickname: string,
    discord_id: string,
    to_string: string,
    drawn_player_nickname: string | null,

    exchange_id: string
}

export type QueriedPlayer = Selectable<PlayerTable>
export type NewPlayer = Insertable<PlayerTable>
export type PlayerUpdate = Updateable<PlayerTable>

