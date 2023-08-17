import {DateTime} from "luxon";
import {Exchange, getAllExchangesThatHaventEnded} from "../State";
import {InMemoryStore} from "./InMemoryStore";

describe('getAllExchangesThatHaventEnded', () => {
    const inMemoryStore = new InMemoryStore()

    it('should return only exchanges that have not ended and have not had their ended flag flipped on', () => {
        inMemoryStore.state.set('has-not-ended', {
            exchangeEnded: false
        } as Exchange)
        inMemoryStore.state.set('should-have-ended', {
            exchangeEnded: true
        } as Exchange)

        const exchanges = getAllExchangesThatHaventEnded()
        expect(exchanges).toEqual([
            {exchangeEnded: false},
        ])
    });

    it('should not return exchanges that have only been initialized', () => {
        inMemoryStore.state.set('some-id', {
            phase: 'initiated',
            exchangeEndDate: DateTime.fromObject({year: 2100}).toUnixInteger()
        } as Exchange)

        const exchanges = getAllExchangesThatHaventEnded()
        expect(exchanges).toEqual([])
    });
});