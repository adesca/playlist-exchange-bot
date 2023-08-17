import * as path from "path";
import { databaseDetails} from "../../config";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {run} from 'sql-migrations'

run({
    migrationsDir: path.resolve(__dirname, 'migrations'), // This is the directory that should contain your SQL migrations.
    host: databaseDetails.databaseHost, // Database host
    port: databaseDetails.port, // Database port
    db: databaseDetails.database, // Database name
    user: databaseDetails.user, // Database username
    password: databaseDetails.password, // Database password
    adapter: 'pg', // Database adapter: pg, mysql
})

