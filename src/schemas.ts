import {z} from "zod";

export const SecretsSchema = z.object({
    token: z.string().nonempty(),
    clientId: z.string().nonempty(),
    guildId: z.string().nonempty()
})