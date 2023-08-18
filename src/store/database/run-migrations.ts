import * as path from "path";
import { databaseDetails} from "../../config";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {run} from 'sql-migrations'

run({
    migrationsDir: path.resolve(__dirname, 'migrations'), // This is the directory that should contain your SQL migrations.
    host: databaseDetails.PGHOST, // Database host
    port: databaseDetails.PGPORT, // Database port
    db: databaseDetails.PGDATABASE, // Database name
    user: databaseDetails.PGUSER, // Database username
    password: databaseDetails.PGPASSWORD, // Database password
    adapter: 'pg', // Database adapter: pg, mysql
})

