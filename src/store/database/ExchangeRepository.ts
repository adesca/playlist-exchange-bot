import {db} from "./database";
import {QueriedExchange} from "./database-types";

export class ExchangeRepository {
    async getExchangeOrThrow(exchangeName: string) {
        const potentialExchange = await this.getExchangeEntityByExchangeName(exchangeName)
        if (potentialExchange) return potentialExchange
        throw new Error("No exchange found for exchange name " + exchangeName)
    }

    async getExchangeBySignupMessageIdOrThrow(signupMessageId: string): Promise<QueriedExchange> {
        return await db
            .selectFrom('exchanges')
            .selectAll()
            .where('signup_message_id', '=', signupMessageId)
            .executeTakeFirstOrThrow(() => new Error("No open exchanges found for the reacted message "))

    }

    private async getExchangeEntityByExchangeName(name: string) {
        return await db
            .selectFrom('exchanges')
            .selectAll()
            .where('exchange_name', '=', name)
            .executeTakeFirst()
    }
}