import {z} from "zod";
import {config} from "dotenv";

const SecretsSchema = z.object({
    token: z.string().nonempty(),
    clientId: z.string().nonempty(),
    guildId: z.string().nonempty(),
    exchangeLength: z.string().nonempty()
})

config({
    path: './env/.env.local'
})
export const secrets = SecretsSchema.parse(process.env)