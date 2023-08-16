import {StartExchangeCommand} from "./start-exchange";
import {ProgressExchangeCommand} from "./progress-exchange";
import {Collection} from "discord.js";
import {CommandDetails} from "./command-details";

export const commands = [
    StartExchangeCommand.command.toJSON(),
    ProgressExchangeCommand.command.toJSON()
]

export const commandCollection = new Collection<string, CommandDetails>()
commandCollection.set(StartExchangeCommand.command.name, StartExchangeCommand)
commandCollection.set(ProgressExchangeCommand.command.name, ProgressExchangeCommand)
