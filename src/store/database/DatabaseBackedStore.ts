import {Exchange, ExchangePlayer} from "../State";
import {DateTime, Duration} from "luxon";
import {db} from "./database";
import {NewExchange, NewPlayer, QueriedExchange} from "./database-types";
import {configuration} from "../../config";
import {PlayerRepository} from "./PlayerRepository";
import {ExchangeRepository} from "./ExchangeRepository";
import {Store} from "../StoreInterface";

export class DatabaseBackedStore implements Store {
    playerRepository = new PlayerRepository();
    exchangeRepository = new ExchangeRepository()
    async getExchangeByNameOrThrow(exchangeName: string) {
        const queriedExchange = await this.exchangeRepository.getExchangeOrThrow(exchangeName)
        return this.convertExchangeEntityToExchange(queriedExchange);
    }

    async getExchangeByNameOrUndefined(exchangeName: string): Promise<Exchange | undefined> {
        const queriedExchange = await this.exchangeRepository.getExchangeEntityByExchangeName(exchangeName)

        if (queriedExchange) return this.convertExchangeEntityToExchange(queriedExchange);
        return Promise.resolve(undefined);
    }

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

        const relatedPlayers = await this.playerRepository.getPlayersForExchange(exchangeEntity.exchange_name)

        exchange.players = relatedPlayers.map(playerEntity => ({
            tag: playerEntity.tag,
            discordId: playerEntity.discord_id,
            serverNickname: playerEntity.server_nickname,
            toString: playerEntity.to_string,
            drawnPlayerNickname: playerEntity.drawn_player_nickname || undefined
        }))

        return exchange;
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

    async getExchangeBySignupMessageIdOrThrow(signupMessageId: string) {
        const exchange = await this.exchangeRepository.getExchangeBySignupMessageIdOrThrow(signupMessageId)
        return this.convertExchangeEntityToExchange(exchange)
    }

    async setExchangeEndDate(exchangeName: string, durationBeforeEndToSendReminder: Duration, exchangeEndDate: DateTime) {
        await db.updateTable('exchanges')
            .set({
                exchange_end_date: exchangeEndDate.toJSDate(),
                exchange_reminder_date: exchangeEndDate.minus(durationBeforeEndToSendReminder).toJSDate()
            })
            .where('exchange_name', '=', exchangeName)
            .executeTakeFirstOrThrow()
    }

    async setExchangePlayers(exchangeName: string, players: ExchangePlayer[]) {
        const exchangeEntity = await this.exchangeRepository.getExchangeOrThrow(exchangeName)
        if (!exchangeEntity) throw new Error("No exchange found with exchange name " + exchangeName)

        const existingPlayers = await this.playerRepository.getPlayersForExchange(exchangeName)
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
                exchange_id: exchangeEntity.id,
                exchange_name: exchangeName
            }
        })

       await this.playerRepository.insertPlayers(newPlayers)

    }
}