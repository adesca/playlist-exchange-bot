import {REST, Routes} from "discord.js";
import {secrets} from "./config";
import {commands} from "./commands/commands-export";


const rest = new REST().setToken(secrets.token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(secrets.clientId, secrets.guildId),
            { body: commands },
        ) as unknown[];

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();