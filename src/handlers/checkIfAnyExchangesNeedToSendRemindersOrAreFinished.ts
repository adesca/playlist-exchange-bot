import {endExchange, getAllExchangesThatHaventEnded, turnOffReminderSending} from "../store/State";
import {DateTime} from "luxon";
import {EnhancedClient} from "../EnhancedClient";
import {Channel, TextBasedChannel} from "discord.js";

export async function checkIfAnyExchangesNeedToSendRemindersOrAreFinished(client: EnhancedClient) {
    const exchanges = getAllExchangesThatHaventEnded()
    const now = DateTime.now()
    // console.debug(`[${now.toString()}] checking if any exchanges need reminders or are finished`)

    for (const exchange of exchanges) {
        if (exchange.phase === 'initiated' || !exchange.exchangeEndDate) return;

        const reminderDateTime = DateTime.fromSeconds(exchange.exchangeReminderDate)
        const exchangeEndDateTime = DateTime.fromSeconds(exchange.exchangeEndDate)
        const playlistExchangeChannel = checkThatChannelExistsAndIsTextBased(client.channels.cache.get(exchange.channelId))


        if (!exchange.reminderSent && now > reminderDateTime) {
            console.debug('sending reminder')
            turnOffReminderSending(exchange.exchangeName)
            await playlistExchangeChannel.send(`Reminder: the exchange ends <t:${exchangeEndDateTime.toUnixInteger()}:R> `)
        }

        if (!exchange.exchangeEnded && now > exchangeEndDateTime) {
            console.debug('exchange is over')
            endExchange(exchange.exchangeName)
            const reveal = exchange.players.map(player => `- ${player.toString} had ${player.drawnPlayerNickname}`)
            await playlistExchangeChannel.send(`Time for the reveal!\n` + reveal.join('\n'))

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