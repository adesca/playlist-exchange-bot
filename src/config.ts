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
    useInMemoryDatastore: z.coerce.boolean()
})

const DatabaseSchema = z.object({
    databaseHost: z.string().nonempty().optional(),
    database: z.string().nonempty().optional(),
    user: z.string().nonempty().optional(),
    port: z.coerce.number().optional(),
    password: z.string().optional()
})

const environment = process.env.BOT_ENV
config({
    path: `./env/.env.${environment}`
})


export const secrets = SecretsSchema.parse(process.env)
export const configuration = ConfigurationSchema.parse(process.env)

console.log('using in memory data store? ', configuration.useInMemoryDatastore)
export const databaseDetails = DatabaseSchema.parse(process.env)