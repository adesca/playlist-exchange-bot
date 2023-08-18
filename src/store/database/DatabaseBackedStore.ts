import {Exchange, ExchangePlayer} from "../State";
import {DateTime, Duration} from "luxon";
import {db} from "./database";
import {NewExchange, NewPlayer, QueriedExchange} from "./database-types";
import {configuration} from "../../config";

export class DatabaseBackedStore {
    async convertExchangeEntityToExchange(exchangeEntity: QueriedExchange) {
        const exchange = new Exchange(exchangeEntity.signup_message_id, exchangeEntity.guild_id,
            exchangeEntity.channel_id, exchangeEntity.exchange_name)

        exchange.reminderSent = exchangeEntity.reminder_sent || false;
        exchange.exchangeEnded = exchangeEntity.exchange_ended || false;

        exchange.phase = exchangeEntity.phase


        if (exchangeEntity.exchange_reminder_date) {
            exchange.exchangeReminderDate = DateTime.fromJSDate(exchangeEntity.exchange_reminder_date)
        }
        if (exchangeEntity.exchange_end_date) {
            exchange.exchangeEndDate = DateTime.fromJSDate(exchangeEntity.exchange_end_date)
        }

        const relatedPlayers = await this.getPlayersForExchange(exchangeEntity.id)

        exchange.players = relatedPlayers.map(playerEntity => ({
            tag: playerEntity.tag,
            discordId: playerEntity.discord_id,
            serverNickname: playerEntity.server_nickname,
            toString: playerEntity.to_string,
            drawnPlayerNickname: playerEntity.drawn_player_nickname || undefined
        }))

        return exchange;
    }

    private async getPlayersForExchange(exchangeId: string) {
        return await db.selectFrom('players')
            .selectAll()
            .where('exchange_id', '=', exchangeId)
            .execute()
    }

    private async getExchangeEntityByName(name: string) {
        return await db
            .selectFrom('exchanges')
            .selectAll()
            .where('exchange_name', '=', name)
            .executeTakeFirst()
    }

    async getExchangeByNameOrUndefined(name: string) {
        const exchange = await this.getExchangeEntityByName(name)

        if (!exchange) return undefined

        return this.convertExchangeEntityToExchange(exchange)
    }

    async addNewExchangeWithoutPlayers(exchangeName: string, exchange: Exchange) {
        const insertedExchange: NewExchange = {
            phase: exchange.phase,
            exchange_end_date: exchange.exchangeEndDate.toJSDate(),
            exchange_reminder_date: exchange.exchangeReminderDate.toJSDate(),

            reminder_sent: exchange.reminderSent,
            exchange_ended: exchange.exchangeEnded,

            signup_message_id: exchange.signupMessageId,
            guild_id: exchange.guildId,
            channel_id: exchange.channelId,
            exchange_name: exchangeName
        }

        await db
            .insertInto('exchanges')
            .values(insertedExchange)
            .execute()
    }

    async getAllExchangesThatHaventEnded() {
        const exchangeEntities = await db.selectFrom('exchanges')
            .selectAll()
            .where('phase', '!=', 'initiated')
            .where('exchange_ended', '=', false)
            .execute()

        return Promise.all(exchangeEntities.map(async exchange => {
            return await this.convertExchangeEntityToExchange(exchange)
        }))
    }

    async turnOffReminderSending(exchangeName: string) {
        await db.updateTable('exchanges')
            .set({
                reminder_sent: true
            })
            .where('exchange_name', '=', exchangeName)
            .executeTakeFirstOrThrow()
    }

    async progressExchangeOrThrow(exchangeName: string, newPhase: 'collecting playlists') {
        await db.updateTable('exchanges')
            .set({
                phase: newPhase
            })
            .where('exchange_name', '=', exchangeName)
            .executeTakeFirstOrThrow()
    }
    async endExchange(exchangeName: string) {
        await db.updateTable('exchanges')
            .set({
                exchange_ended: true
            })
            .where('exchange_name', '=', exchangeName)
            .executeTakeFirstOrThrow()
    }

    async getExchangeOrThrow(exchangeName: string) {
        const potentialExchange = await this.getExchangeByNameOrUndefined(exchangeName)
        if (potentialExchange) return potentialExchange
        throw new Error("No exchange found for exchange name " + exchangeName)
    }

    async getExchangeBySignupMessageIdOrThrow(signupMessageId: string) {
        const exchange = await db
            .selectFrom('exchanges')
            .selectAll()
            .where('signup_message_id', '=', signupMessageId)
            .executeTakeFirstOrThrow(() => new Error("No open exchanges found for the reacted message "))

        return this.convertExchangeEntityToExchange(exchange)
    }

    async setExchangeEndDate(exchangeName: string, exchangeLength: Duration, exchangeEndDate: DateTime) {
        await db.updateTable('exchanges')
            .set({
                exchange_end_date: exchangeEndDate.toJSDate(),
                exchange_reminder_date: exchangeEndDate.minus(Duration.fromISO(configuration.remindAt)).toJSDate()
            })
            .where('exchange_name', '=', exchangeName)
            .executeTakeFirstOrThrow()
    }

    async setExchangePlayers(exchangeName: string, players: ExchangePlayer[]) {
        const exchangeEntity = await this.getExchangeEntityByName(exchangeName)
        if (!exchangeEntity) throw new Error("No exchange found with exchange name " + exchangeName)

        const existingPlayers = await this.getPlayersForExchange(exchangeEntity.id)
        for (const existingPlayer of existingPlayers) {
            await db.deleteFrom('players')
                .where('players.id', '=', existingPlayer.id)
                .executeTakeFirst()
        }

        const newPlayers: NewPlayer[] = players.map(player => {
            return {
                tag: player.tag,
                server_nickname: player.serverNickname,
                discord_id: player.discordId,
                to_string: player.toString,
                drawn_player_nickname: player.drawnPlayerNickname,
                exchange_id: exchangeEntity.id
            }
        })

        if (newPlayers.length > 0) {
            await db.insertInto('players')
                .values(newPlayers)
                .executeTakeFirstOrThrow()
        }

    }
}