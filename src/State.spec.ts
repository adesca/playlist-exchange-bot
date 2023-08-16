import {DateTime} from "luxon";
import {Exchange, getAllExchangesThatHaventEnded, state} from "./State";

describe('getAllExchangesThatHaventEnded', () => {
    it('should return only exchanges that have not ended and have not had their ended flag flipped on', () => {
        state.set('has-not-ended', {
            exchangeEnded: false
        } as Exchange)
        state.set('should-have-ended', {
            exchangeEnded: true
        } as Exchange)

        const exchanges = getAllExchangesThatHaventEnded()
        expect(exchanges).toEqual([
            {exchangeEnded: false},
        ])
    });

    it('should not return exchanges that have only been initialized', () => {
        state.set('some-id', {
            phase: 'initiated',
            exchangeEndDate: DateTime.fromObject({year: 2100}).toUnixInteger()
        } as Exchange)

        const exchanges = getAllExchangesThatHaventEnded()
        expect(exchanges).toEqual([])
    });
});