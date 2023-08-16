import {Client, Collection, IntentsBitField} from "discord.js";
import { StartExchangeCommand,} from "./commands/start-exchange";
import {CommandDetails} from "./commands/command-details";

export class EnhancedClient extends  Client {
    public commands = new Collection<string, CommandDetails>()

    constructor() {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMessageReactions
            ]
        });

        this.commands.set(StartExchangeCommand.command.name, StartExchangeCommand)
    }
}