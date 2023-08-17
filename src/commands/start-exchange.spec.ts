import {generateRandomSentence} from "./dictionary-util";
import {addNewExchange, Exchange, getExchangeById} from "../store/State";
import {StartExchangeCommand} from "./start-exchange";
import {ChatInputCommandInteraction} from "discord.js";

describe('startExchangeCommandExecute', () => {
    vi.mock('./dictionary-util', () => ({
        generateRandomSentence: vi.fn()
    }))

    vi.mock('../State', async () => {
        const actual = await vi.importActual('../State') as Record<string, any>

        return {
            ...actual,
            getExchangeById: vi.fn(),
            addNewExchange: vi.fn(),
        }
    })

    it('should generate a new random name for the exchange if a name is taken',async () => {
        const mockedGenerateRandomSentence = vi.mocked(generateRandomSentence)
        const mockedGetExchangeById = vi.mocked(getExchangeById)
        const mockedAddExchange = vi.mocked(addNewExchange)

        mockedGenerateRandomSentence
            .mockReturnValueOnce("already exists")
            .mockReturnValueOnce("does not exist")
        mockedGetExchangeById.mockImplementation(id => {
            if (id === 'already exists') return {} as Exchange
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
