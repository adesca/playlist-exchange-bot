import {Client, Collection, IntentsBitField} from "discord.js";
import {CommandDetails} from "./commands/command-details";
import {commandCollection} from "./commands/commands-export";

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

        this.commands = commandCollection
        console.log('running with ', this.commands.size, ' commands: ', [...this.commands.keys()])

    }
}