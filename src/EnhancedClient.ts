import {Client, Collection, IntentsBitField} from "discord.js";
import {
    CommandDetails,
    StartExchangeCommand,
} from "./commands/start-exchange";

export class EnhancedClient extends  Client {
    public commands = new Collection<string, CommandDetails>()

    constructor() {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,

            ]
        });

        this.commands.set(StartExchangeCommand.command.name, StartExchangeCommand)
    }
}