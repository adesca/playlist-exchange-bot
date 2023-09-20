import {Events} from "discord.js";
import {EnhancedClient} from "./EnhancedClient";
import {updateListOfPlayersOnMessageReactChanges} from "./handlers/updateListOfPlayersOnMessageReactChanges";
import {secrets} from "./config";
import {Duration} from "luxon";
import {
    checkIfAnyExchangesNeedToSendRemindersOrAreFinished
} from "./handlers/checkIfAnyExchangesNeedToSendRemindersOrAreFinished";

const client = new EnhancedClient()

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}2`);
});

client.on(Events.MessageReactionAdd, updateListOfPlayersOnMessageReactChanges)

client.on(Events.MessageReactionRemove, updateListOfPlayersOnMessageReactChanges)

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
        } else {
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
})

// Log in to Discord with your client's token
client.login(secrets.token);

const handle = setInterval(checkIfAnyExchangesNeedToSendRemindersOrAreFinished,
    Duration.fromObject({seconds: 15}).as('milliseconds'), client)
process.on('exit', () => {
    clearInterval(handle)
    console.log('exiting')
})