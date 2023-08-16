import {endExchange, getAllExchangesThatHaventEnded, turnOffReminderSending} from "../State";
import {DateTime} from "luxon";
import {EnhancedClient} from "../EnhancedClient";
import {Channel, TextBasedChannel} from "discord.js";

export async function checkIfAnyExchangesNeedToSendRemindersOrAreFinished(client: EnhancedClient) {
    const exchanges = getAllExchangesThatHaventEnded()
    const now = DateTime.now()
    console.log(`[${now.toString()}] checking if any exchanges need reminders or are finished`)

    for (const exchange of exchanges) {
        if (exchange.phase === 'initiated' || !exchange.exchangeEndDate) return;

        const reminderDateTime = DateTime.fromSeconds(exchange.exchangeReminderDate)
        const exchangeEndDateTime = DateTime.fromSeconds(exchange.exchangeEndDate)
        const playlistExchangeChannel = checkThatChannelExistsAndIsTextBased(client.channels.cache.get(exchange.channelId))


        // if (now.startOf('minute') == reminderDateTime.startOf('minute')) {
        // TODO add a test to cover edge case where exchange hasn't progressed
        if (!exchange.reminderSent && now > reminderDateTime) {
            console.log('sending reminder')
            turnOffReminderSending(exchange.guildId)
            await playlistExchangeChannel.send(`Reminder: the exchange ends <t:${exchangeEndDateTime.toUnixInteger()}:R> `)
        }

        // if (now.startOf('minute') == exchangeEndDateTime.startOf('minute')) {
        if (!exchange.exchangeEnded && now > exchangeEndDateTime) {
            console.log('exchange is over')
            endExchange(exchange.guildId)
            await playlistExchangeChannel.send(`Times up!`)

        }
    }
}

function checkThatChannelExistsAndIsTextBased(potentialChannel: Channel | undefined): TextBasedChannel {
    if (!potentialChannel) {
        console.error("Channel does not exist ")
        throw new Error("Channel does not exist")
    }

    if (!potentialChannel.isTextBased()) {
        console.error("Channel is not text based")
        throw new Error("Channel is not text based")
    }

    return potentialChannel
}