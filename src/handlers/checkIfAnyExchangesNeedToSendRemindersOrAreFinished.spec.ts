import {Collection} from "discord.js";
import {
    checkIfAnyExchangesNeedToSendRemindersOrAreFinished
} from "./checkIfAnyExchangesNeedToSendRemindersOrAreFinished";
import {beforeEach, Mock} from "vitest";
import {DateTime} from "luxon";
import {endExchange, Exchange, getAllExchangesThatHaventEnded, turnOffReminderSending} from "../State";
import {EnhancedClient} from "../EnhancedClient";

describe('checkIfAnyExchangesNeedToSendRemindersOrAreFinished', () => {
    vi.mock('../State', () => ({
        getAllExchangesThatHaventEnded: vi.fn(),
        turnOffReminderSending: vi.fn(),
        endExchange: vi.fn()
    }))

    const fakeClient = {
        channels: {
            cache: new Collection<string, { send: Mock, isTextBased: () => boolean }>
        }
    }

    beforeEach(() => {
        fakeClient.channels.cache.set("channel-id", {send: vi.fn(), isTextBased: () => true})
    })

    describe('reminder messages', () => {
        it('should send a reminder message if the reminder time has passed and we havent sent a reminder', () => {
            vi.spyOn(DateTime, 'now')
                .mockReturnValue(DateTime.fromObject({year: 2023}))

            const getExchangesMock = vi.mocked(getAllExchangesThatHaventEnded)
            const exchange = createGenericExchange()
            exchange.guildId = 'guild-id'
            exchange.reminderSent = false
            exchange.exchangeReminderDate = DateTime.fromObject({year: 2021}).toUnixInteger()
            getExchangesMock.mockReturnValueOnce([exchange])

            checkIfAnyExchangesNeedToSendRemindersOrAreFinished(fakeClient as unknown as EnhancedClient)

            expect(fakeClient.channels.cache.get('channel-id')!.send)
                .toHaveBeenCalledWith(`Reminder: the exchange ends <t:1641016800:R> `)
            expect(turnOffReminderSending).toHaveBeenCalledWith('guild-id')
        });

        it('should NOT send a reminder message if the reminder time has passed and we HAVE sent a reminder already', () => {
            vi.spyOn(DateTime, 'now')
                .mockReturnValue(DateTime.fromObject({
                    year: 2023, month: 8, day: 16, hour: 14, minute: 37, second: 15
                }))

            const exchangeEndDate = DateTime.fromObject({year: 2023, month: 8, day: 16, hour: 14, minute: 38,})

            const getExchangesMock = vi.mocked(getAllExchangesThatHaventEnded)
            getExchangesMock.mockReturnValue([{
                channelId: 'channel-id',
                exchangeReminderDate: DateTime.fromObject({year: 2023, month: 8, day: 16, hour: 14, minute: 25,}).toUnixInteger(),
                exchangeEndDate: exchangeEndDate.toUnixInteger(),
                reminderSent: true
            } as Exchange])


            checkIfAnyExchangesNeedToSendRemindersOrAreFinished(fakeClient as unknown as EnhancedClient)

            expect(fakeClient.channels.cache.get('channel-id')!.send).not.toHaveBeenCalled()
        });

        it('should NOT send a reminder message if the reminder time has NOT passed and we havent sent a reminder already', () => {
            vi.spyOn(DateTime, 'now')
                .mockReturnValue(DateTime.fromObject({
                    year: 2022, month: 8, day: 16, hour: 14, minute: 37, second: 15
                }))

            const getExchangesMock = vi.mocked(getAllExchangesThatHaventEnded)
            getExchangesMock.mockReturnValue([{
                exchangeReminderDate: DateTime.fromObject({year: 2023, month: 8, day: 16, hour: 14, minute: 25}).toUnixInteger(),
                reminderSent: false,

                channelId: 'channel-id',
                exchangeEnded: true,
                exchangeEndDate: DateTime.fromObject({year: 2022}).toUnixInteger(),
            } as Exchange])


            checkIfAnyExchangesNeedToSendRemindersOrAreFinished(fakeClient as unknown as EnhancedClient)

            expect(fakeClient.channels.cache.get('channel-id')!.send).not.toHaveBeenCalled()
        });

    });

    describe('Game over message', () => {
        it('should send a "game over message" if the ending time has passed and we havent sent the message', () => {
            vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromObject({year: 2023}))

            const getExchangesMock = vi.mocked(getAllExchangesThatHaventEnded)
            const exchange = createGenericExchange()
            exchange.guildId = "ended-exchange"
            exchange.exchangeEnded = false
            exchange.exchangeEndDate = DateTime.fromObject({year: 2022}).toUnixInteger()
            getExchangesMock.mockReturnValue([exchange])


            checkIfAnyExchangesNeedToSendRemindersOrAreFinished(fakeClient as unknown as EnhancedClient)

            expect(endExchange).toHaveBeenCalledWith("ended-exchange")
            expect(fakeClient.channels.cache.get('channel-id')!.send).toHaveBeenCalledWith("Times up!")
        });

        it('should NOT send a game over message if the message time has passed and we HAVE sent a message already', () => {
            vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromObject({year: 2023}))


            const getExchangesMock = vi.mocked(getAllExchangesThatHaventEnded)
            const exchange = createGenericExchange()
            exchange.exchangeEnded = true
            exchange.exchangeEndDate = DateTime.fromObject({year: 2022}).toUnixInteger()
            getExchangesMock.mockReturnValue([exchange])


            checkIfAnyExchangesNeedToSendRemindersOrAreFinished(fakeClient as unknown as EnhancedClient)

            expect(fakeClient.channels.cache.get('channel-id')!.send).not.toHaveBeenCalled()
        });

        it('should NOT send a game over message if the message time has NOT passed and we havent sent a message already', () => {
            vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromObject({year: 2023}))


            const getExchangesMock = vi.mocked(getAllExchangesThatHaventEnded)
            const exchange = createGenericExchange()
            exchange.exchangeEnded = false
            exchange.exchangeEndDate = DateTime.fromObject({year: 2024}).toUnixInteger()
            getExchangesMock.mockReturnValue([exchange])


            checkIfAnyExchangesNeedToSendRemindersOrAreFinished(fakeClient as unknown as EnhancedClient)

            expect(fakeClient.channels.cache.get('channel-id')!.send).not.toHaveBeenCalled()
        });

    });
});

function createGenericExchange() {
    return {
        guildId: 'guild-id',
        exchangeReminderDate: DateTime.fromObject({year: 2023, month: 8, day: 16, hour: 14, minute: 25}).toUnixInteger(),
        reminderSent: false,

        channelId: 'channel-id',
        exchangeEnded: false,
        exchangeEndDate: DateTime.fromObject({year: 2022}).toUnixInteger(),
    } as Exchange
}
