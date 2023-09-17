import {DateTime, Duration} from "luxon";
import {configuration} from "../../config";
import {Exchange, ExchangePlayer} from "../State";
import {Collection} from "discord.js";
import {Store} from "../StoreInterface";

export class InMemoryStore implements Store {
    public state = new Collection<string, Exchange>()

    async progressExchangeOrThrow(name: string, newPhase: 'collecting playlists') {
        (await this.getExchangeOrThrow(name)).phase = newPhase
    }

    async getExchangeByNameOrUndefined(name: string) {
        return this.state.get(name)
    }

    async addNewExchangeWithoutPlayers(id: string, exchange: Exchange) {
        this.state.set(id, exchange)
    }

    async getAllExchangesThatHaventEnded() {
        return [...this.state.values()]
            .filter(exchange => exchange.phase !== 'initiated')
            .filter(exchange => !exchange.exchangeEnded)
    }

    async turnOffReminderSending(id: string) {
        const exchange = await this.getExchangeByNameOrUndefined(id)
        if (exchange) {
            exchange.reminderSent = true
            return;
        } else {
            throw new Error("No exchange found for id " + id)
        }
    }

    async endExchange(id: string) {
        const exchange =  await this.getExchangeByNameOrUndefined(id)
        if (exchange) {
            exchange.exchangeEnded = true
            return;
        } else {
            throw new Error("No exchange found for id " + id)
        }
    }

    async getExchangeOrThrow(exchangeId: string) {
        const potentialExchange = this.state.get(exchangeId)
        if (potentialExchange) return potentialExchange
        throw new Error("No exchange found for server " + exchangeId)
    }

    async getExchangeBySignupMessageIdOrThrow(signupMessageId: string) {
        const potentialExchange = [...this.state.values()]
            .filter(exchange => exchange.signupMessageId === signupMessageId)
            .pop()

        if (potentialExchange) return potentialExchange
        throw new Error("No open exchanges found for the reacted message ")
    }

     async setExchangeEndDate(exchangeId: string, exchangeLength: Duration, exchangeEndDate: DateTime) {
        const exchange =  await this.getExchangeByNameOrUndefined(exchangeId)
         if (exchange) {
            exchange.exchangeEndDate = exchangeEndDate
            exchange.exchangeReminderDate = exchangeEndDate.minus(Duration.fromISO(configuration.remindAt))
         } else {
             throw new Error("No exchange was found with id " + exchangeId)
         }

    }

    async setExchangePlayers(exchangeName: string, players: ExchangePlayer[]) {
        this.state.get(exchangeName)!.players = players
    }

    async getExchangeByNameOrThrow(exchangeName: string): Promise<Exchange> {
        return this.getExchangeOrThrow(exchangeName)
    }
}