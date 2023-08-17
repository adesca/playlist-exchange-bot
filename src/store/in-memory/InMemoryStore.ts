import {DateTime, Duration} from "luxon";
import {configuration} from "../../config";
import {Exchange, ExchangePlayer} from "../State";
import {Collection} from "discord.js";

export class InMemoryStore {
    public state = new Collection<string, Exchange>()

    getExchangeById(id: string) {
        return this.state.get(id)
    }

    addNewExchange(id: string, exchange: Exchange) {
        this.state.set(id, exchange)
    }

    getAllExchangesThatHaventEnded() {
        return [...this.state.values()]
            .filter(exchange => exchange.phase !== 'initiated')
            .filter(exchange => !exchange.exchangeEnded)
    }

    turnOffReminderSending(id: string) {
        const exchange = this.getExchangeById(id)
        if (exchange) {
            exchange.reminderSent = true
            return;
        } else {
            throw new Error("No exchange found for id " + id)
        }
    }

    endExchange(id: string) {
        const exchange = this.getExchangeById(id)
        if (exchange) {
            exchange.exchangeEnded = true
            return;
        } else {
            throw new Error("No exchange found for id " + id)
        }
    }

    getExchangeOrThrow(exchangeId: string) {
        const potentialExchange = this.state.get(exchangeId)
        if (potentialExchange) return potentialExchange
        throw new Error("No exchange found for server " + exchangeId)
    }

    getExchangeBySignupMessageIdOrThrow(signupMessageId: string) {
        const potentialExchange = [...this.state.values()]
            .filter(exchange => exchange.signupMessageId === signupMessageId)
            .pop()

        if (potentialExchange) return potentialExchange
        throw new Error("No open exchanges found for the reacted message ")
    }

    setExchangeEndDate(exchangeId: string, exchangeLength: Duration, exchangeEndDate: DateTime) {
        const exchange = this.getExchangeById(exchangeId)!
        exchange.exchangeEndDate = exchangeEndDate.toUnixInteger()
        exchange.exchangeReminderDate = exchangeEndDate.minus(Duration.fromISO(configuration.remindAt)).toUnixInteger()

    }

    setExchangePlayers(exchangeName: string, players: ExchangePlayer[]) {
        this.state.get(exchangeName)!.players = players
    }
}