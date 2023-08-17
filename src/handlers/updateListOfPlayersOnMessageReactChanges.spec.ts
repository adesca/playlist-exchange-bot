import {describe, expect, test} from "vitest";
import {setExchangePlayers} from "../store/State";
import {updateListOfPlayersOnMessageReactChanges} from "./updateListOfPlayersOnMessageReactChanges";
import {Collection, MessageReaction} from "discord.js";

describe('updateListOfPlayers', () => {

    vi.mock('../State', async () => {
        const actual = await vi.importActual('../State') as Record<string, unknown>

        return {
            ...actual,
            getExchangeById: vi.fn(),
            setExchangePlayers: vi.fn(),
        }
    })

    test('should set the players on the exchange', () => {
        const mockedSetExchangePlayers = vi.mocked(setExchangePlayers)
        const fakeInteraction = {
            message: {id: 'some-id'},
            users: {cache: new Collection<string, unknown>().set("1", {tag: 'fake-user'})}
        } as MessageReaction
        updateListOfPlayersOnMessageReactChanges(fakeInteraction)

        expect(mockedSetExchangePlayers)
            .toHaveBeenCalledWith(expect.stringContaining('-'), [{tag: 'fake-user'}])
    });

    test('GIVEN an interaction should not add any bot reactions to the exchange', () => {
        const mockedSetExchangePlayers = vi.mocked(setExchangePlayers)

        const fakeInteraction = {
            message: {id: 'some-id'},
            users: {cache: new Collection<string, unknown>().set("1", {tag: 'a-bot', bot: true})}
        } as MessageReaction
        updateListOfPlayersOnMessageReactChanges(fakeInteraction)

        expect(mockedSetExchangePlayers).not.toHaveBeenCalled()
    });


    test(`GIVEN message being reacted to isn't used for tracking exchange participation THEN should NOT update the exchange players`, () => {
        const mockedSetExchangePlayers = vi.mocked(setExchangePlayers)

        const fakeInteraction = {
            message: {id: 'an id not in the exchange'},
            users: {cache: new Collection<string, unknown>().set("1", {tag: 'user that should not be added'})}
        } as MessageReaction

        updateListOfPlayersOnMessageReactChanges(fakeInteraction)

        expect(mockedSetExchangePlayers).not.toHaveBeenCalled()
    });
})