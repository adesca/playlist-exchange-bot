import {boolean, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {drizzle} from "drizzle-orm/postgres-js";
import {Pool} from "pg";
import {databaseDetails} from "../../config";

export const exchanges = pgTable('exchanges', {
    id: uuid('id').primaryKey().defaultRandom(),
    phase: varchar('phase').notNull(),
    exchangeEndDate: timestamp('exchange_end_date'),
    exchangeReminderDate: timestamp('exchange_reminder_date'),

    reminderSent: boolean('reminder_sent'),
    exchangeEnded: boolean('exchange_ended'),

    signupMessageId: varchar('signup_message_id').notNull(),
    guildId: varchar('guild_id').notNull(),
    channelId: varchar('channel_id').notNull(),
    exchangeName: varchar('exchange_name').notNull()

})

export const players = pgTable('players', {
    id: uuid('id').primaryKey().defaultRandom(),
    tag: varchar('tag').notNull(),
    serverNickname: varchar('server_nickname').notNull(),
    discordId: varchar('discord_id').notNull(),
    toString: varchar('to_string').notNull(),
    drawn_player_nickname: varchar('drawn_player_nickname'),

    exchangeId: uuid('exchange_id').references(() => exchanges.id),
    exchangeName: varchar('exchange_name').references(() => exchanges.exchangeName)
})

export const playerExchangeRelations = relations(players, ({many}) => ({
    exchanges: many(exchanges)
}))

export const exchangePlayerRelations = relations(exchanges, ({one}) => ({
    players: one(players)
}))




