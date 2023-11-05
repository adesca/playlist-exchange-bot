import {StartExchangeCommand} from "./start-exchange";
import {ProgressExchangeCommand} from "./progress-exchange";
import {Collection} from "discord.js";
import {CommandDetails} from "./command-details";
import {ManuallyAddPeopleCommand} from "./manually-add-people-to-exchange";
import {ManuallyUpdateExchangeEndTime} from "./manually-update-exchange-end-time";

export const commands = [
    StartExchangeCommand.command.toJSON(),
    ProgressExchangeCommand.command.toJSON(),
    ManuallyAddPeopleCommand.command.toJSON(),
    ManuallyUpdateExchangeEndTime.command.toJSON()
]

export const commandCollection = new Collection<string, CommandDetails>()
commandCollection.set(StartExchangeCommand.command.name, StartExchangeCommand)
commandCollection.set(ProgressExchangeCommand.command.name, ProgressExchangeCommand)
commandCollection.set(ManuallyAddPeopleCommand.command.name, ManuallyAddPeopleCommand)
commandCollection.set(ManuallyUpdateExchangeEndTime.command.name, ManuallyUpdateExchangeEndTime)
