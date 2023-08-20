import {NewPlayer, QueriedPlayer} from "./database-types";
import {db} from "./database";

export class PlayerRepository {
    async getPlayersForExchange(exchangeName: string): Promise<QueriedPlayer[]> {
        return await db.selectFrom('players')
            .where('exchange_name', '=', exchangeName)
            .selectAll()
            .execute()
    }

    async insertPlayers(players: NewPlayer[]) {
        if (players.length > 0) {
            await db.insertInto('players')
                .values(players)
                .executeTakeFirstOrThrow()
        }
    }


}