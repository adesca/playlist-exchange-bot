import {generateRandomSentence} from "./dictionary-util";
import {addNewExchangeWithoutPlayers, Exchange, getExchangeByNameOrUndefined} from "../store/State";
import {StartExchangeCommand} from "./start-exchange";
import {ChatInputCommandInteraction} from "discord.js";

describe('startExchangeCommandExecute', () => {
    vi.mock('./dictionary-util', () => ({
        generateRandomSentence: vi.fn()
    }))

    vi.mock('../State', async () => {
        const actual = await vi.importActual('../State') as Record<string, unknown>

        return {
            ...actual,
            getExchangeById: vi.fn(),
            addNewExchange: vi.fn(),
        }
    })

    it('should generate a new random name for the exchange if a name is taken',async () => {
        const mockedGenerateRandomSentence = vi.mocked(generateRandomSentence)
        const mockedGetExchangeById = vi.mocked(getExchangeByNameOrUndefined)
        const mockedAddExchange = vi.mocked(addNewExchangeWithoutPlayers)

        mockedGenerateRandomSentence
            .mockReturnValueOnce("already exists")
            .mockReturnValueOnce("does not exist")
        mockedGetExchangeById.mockImplementation(id => {
            let retval = undefined;
            if (id === 'already exists') retval = {} as Exchange

            return Promise.resolve(retval)
        })

        const fakeInteraction = generateFakeInteraction()
        await StartExchangeCommand.execute(fakeInteraction)

        expect(mockedAddExchange).toHaveBeenCalledWith("does not exist", expect.any(Exchange))
    });
});

function generateFakeInteraction() {
    return {
        user: {toString: () => "<@string>"} as unknown,

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        reply: vi.fn().mockResolvedValue({}) as unknown,
        followUp: vi.fn().mockResolvedValue({
            react: () => {
            }
        }) as unknown,

        guildId: 'guildId',
    } as ChatInputCommandInteraction
}
