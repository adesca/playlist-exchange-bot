import {drizzleDB} from "./drizzleDb";
import {eq} from "drizzle-orm";
import {exchanges} from "./DrizzleEntities";

export async function getExchangeWithPlayers(exchangeName: string) {
    return await drizzleDB.query.exchanges
        .findFirst({
        with: {
            players: true
        },
            where: eq(exchanges.exchangeName, exchangeName)
    })

}