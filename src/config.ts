import {z} from "zod";
import {config} from "dotenv";

const SecretsSchema = z.object({
    token: z.string().nonempty(),
    clientId: z.string().nonempty(),
    guildId: z.string().nonempty()
})

const ConfigurationSchema = z.object({
    exchangeLength: z.string().nonempty(),
    remindAt: z.string().nonempty(),
    useInMemoryDatastore: z.string().nonempty().transform(val => val === 'true')
})

const DatabaseSchema = z.object({
    PGHOST: z.string().nonempty().optional(),
    PGDATABASE: z.string().nonempty().optional(),
    PGUSER: z.string().nonempty().optional(),
    PGPORT: z.coerce.number().optional(),
    PGPASSWORD: z.string().optional()
})

const environment = process.env.BOT_ENV
config({
    path: `./env/.env.${environment}`
})


export const secrets = SecretsSchema.parse(process.env)
export const configuration = ConfigurationSchema.parse(process.env)

console.log('using in memory data store? ', configuration.useInMemoryDatastore)
export const databaseDetails = DatabaseSchema.parse(process.env)