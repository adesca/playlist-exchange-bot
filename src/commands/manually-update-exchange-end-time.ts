import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {
    Exchange,
    getExchangeByNameOrThrow,
    getExchangeByNameOrUndefined,
    getExchangeBySignupMessageIdOrThrow, setExchangeEndDate,
    setExchangePlayers
} from "../store/State";
import {DateTime, Duration} from "luxon";

const DATE_NAME = "date";
const EXCHANGE_NAME = "exchange-name";
const TIME_NAME = "time";
const REMINDER_HOURS_NAME = "reminder-hours"

const manuallyUpdateExchangeEndTime = new SlashCommandBuilder()
    .setName("update-exchange-end-time")
    .setDescription("Update end time for an existing exchange")
    .addStringOption(option =>
        option
            .setName(EXCHANGE_NAME)
            .setDescription("The name of the exchange you're changing the end time for")
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName(DATE_NAME)
            .setDescription("Day that you want the exchange to end (must be in the future, format: D/MM/YY)")
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName(TIME_NAME)
            .setDescription("Time you want the exchange to end (must be in the format HH:MM, in 24 hour format, CST)")
            .setRequired(true))
    .addNumberOption(option =>
        option
            .setName(REMINDER_HOURS_NAME)
            .setDescription("How many hours before the end of the exchange to send a reminder")
            .setRequired(false))

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({content: 'Working on it!', ephemeral: true})

    const input = await verifyInputArgs(interaction)
    const durationBeforeExchangeEnd = Duration.fromObject({hours: input.hoursBeforeExchangeToSendReminder})

    await setExchangeEndDate(input.exchange.exchangeName, durationBeforeExchangeEnd, input.newEndDate)


    await interaction.channel!.send(`Exchange end date was updated. 
    The exchange will now wrap in <t:${input.newEndDate.toUnixInteger()}:R>,` +
    ` and drawn players will be revealed around <t:${input.newEndDate.toUnixInteger()}:f>`)
}

export const ManuallyUpdateExchangeEndTime = {
    command: manuallyUpdateExchangeEndTime as SlashCommandBuilder,
    execute: execute
}

interface Retval {
    newEndDate: DateTime,
    exchange: Exchange,
    hoursBeforeExchangeToSendReminder: number
    verificationFailed: boolean
}

async function verifyInputArgs(interaction: ChatInputCommandInteraction): Promise<Retval> {
    const retval: Retval = {verificationFailed: false} as Retval


    retval.hoursBeforeExchangeToSendReminder = interaction.options.getNumber(REMINDER_HOURS_NAME) || 24

    const inputNewEndDate = interaction.options.getString(DATE_NAME)!
    const inputNewEndTime = interaction.options.getString(TIME_NAME)!
    try {
        retval.newEndDate = DateTime.fromFormat(`${inputNewEndDate} ${inputNewEndTime}`, "d/M/yy H:m",
            {zone: "America/Chicago"})
    } catch (e) {
        console.log(`Failed to parse "${inputNewEndDate} ${inputNewEndTime}"`)
        await interaction.reply({content: `Failed to parse "${inputNewEndDate} ${inputNewEndTime}"`, ephemeral: true})
        retval.verificationFailed = true
        return retval;
    }

    const exchangeName = interaction.options.getString(EXCHANGE_NAME)!
    try {
        retval.exchange = await getExchangeByNameOrThrow(exchangeName)
    } catch (e) {

        console.log('Failed to retrieve exchange with name ' + exchangeName)
        await interaction.reply({content: "Couldn't find an exchange named " + exchangeName, ephemeral: true})
        retval.verificationFailed = true
        return retval;
    }

    return retval;
}