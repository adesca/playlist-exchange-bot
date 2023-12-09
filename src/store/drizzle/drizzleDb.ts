import {drizzle} from "drizzle-orm/postgres-js";
import {Pool} from "pg";
import {databaseDetails} from "../../config";
import * as schema from './DrizzleEntities'

export const drizzleDB = drizzle(new Pool({
    host: databaseDetails.PGHOST,
    port: databaseDetails.PGPORT,
    database: databaseDetails.PGDATABASE,
    user: databaseDetails.PGUSER,
    password: databaseDetails.PGPASSWORD,
    max: 10,
}), {
    schema
})