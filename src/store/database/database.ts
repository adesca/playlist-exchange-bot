import {Kysely, PostgresDialect} from "kysely";
import {Pool} from "pg";
import {Database} from "./database-types";
import {databaseDetails} from "../../config";

const dialect = new PostgresDialect({
    pool: new Pool({
        host: databaseDetails.PGHOST,
        port: databaseDetails.PGPORT,
        database: databaseDetails.PGDATABASE,
        user: databaseDetails.PGUSER,
        password: databaseDetails.PGPASSWORD,
        max: 10,
    })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
    dialect,
    log(event) {
        if (event.level === 'query') {
            // console.log(event.query.sql, event.query.parameters)
        }
    }
})