import {DateTime, Duration} from "luxon";
import {Exchange, ExchangePlayer} from "./State";

export interface Store {
     getExchangeByNameOrUndefined(exchangeName: string): Promise<Exchange | undefined>

     addNewExchangeWithoutPlayers(exchangeName: string, exchange: Exchange): Promise<void>

     getAllExchangesThatHaventEnded(): Promise<Exchange[]>

     turnOffReminderSending(exchangeName: string): Promise<void>

     endExchange(guildId: string): Promise<void>

     getExchangeByNameOrThrow(exchangeName: string): Promise<Exchange>

     progressExchangeOrThrow(exchangeName:string, newPhase: 'collecting playlists'): Promise<void>

     getExchangeBySignupMessageIdOrThrow(signupMessageId: string): Promise<Exchange>

     setExchangeEndDate(exchangeId: string, durationBeforeEndToSendReminder: Duration, exchangeEndDate: DateTime): Promise<void>

     setExchangePlayers(exchangeName: string, players: ExchangePlayer[]): Promise<void>
}