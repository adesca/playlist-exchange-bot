import {z} from "zod";
import {config} from "dotenv";

const SecretsSchema = z.object({
    token: z.string().nonempty(),
    clientId: z.string().nonempty(),
    guildId: z.string().nonempty()
})

const ConfigurationSchema = z.object({
    exchangeLength: z.string().nonempty(),
    remindAt: z.string().nonempty()
})

const environment = process.env.BOT_ENV
config({
    path: `./env/.env.${environment}`
})

export const secrets = SecretsSchema.parse(process.env)
export const configuration = ConfigurationSchema.parse(process.env)