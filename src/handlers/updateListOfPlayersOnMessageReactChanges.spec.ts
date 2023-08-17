import {beforeEach, describe, expect, test} from "vitest";
import {Exchange, state} from "../State";
import {updateListOfPlayersOnMessageReactChanges} from "./updateListOfPlayersOnMessageReactChanges";
import {Collection, MessageReaction} from "discord.js";

describe('updateListOfPlayers', () => {
    let fakeExchange;

    beforeEach(() => {
        fakeExchange = new Exchange("some-id", "guild-id", "channel-id", "random name")
        state.set("some-id", fakeExchange)
    })

    test('should set the players on the exchange', () => {
        const fakeInteraction = {
            message: {id: 'some-id'},
            users: {cache: new Collection<string, unknown>().set("1", {tag: 'fake-user'})}
        } as MessageReaction
        updateListOfPlayersOnMessageReactChanges(fakeInteraction)

        expect(state.get('some-id')?.players)
            .toEqual([{tag: 'fake-user'}])
    });

    test('GIVEN an interaction should not add any bot reactions to the exchange', () => {
        const fakeInteraction = {
            message: {id: 'some-id'},
            users: {cache: new Collection<string, unknown>().set("1", {tag: 'a-bot', bot: true})}
        } as MessageReaction
        updateListOfPlayersOnMessageReactChanges(fakeInteraction)

        expect(state.get('some-id')?.players)
            .toEqual([])
    });


    test(`GIVEN message being reacted to isn't used for tracking exchange participation THEN should NOT update the exchange players`, () => {
        const fakeInteraction = {
            message: {id: 'an id not in the exchange'},
            users: {cache: new Collection<string, unknown>().set("1", {tag: 'user that should not be added'})}
        } as MessageReaction

        updateListOfPlayersOnMessageReactChanges(fakeInteraction)

        expect(state.get(fakeInteraction.message.id)).toBeUndefined()
    });
})