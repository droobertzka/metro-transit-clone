import { formElements, updateForm } from '../components'
import { fetchAndPopulate } from './fetch'
import { pushState, onPopState } from './history'

jest.mock('../components', () => ({
    formElements: [
        { NAME: 'first' },
        { NAME: 'second' },
        { NAME: 'last' }
    ],
    updateForm: jest.fn()
}))

jest.mock('./fetch', () => ({
    fetchAndPopulate: jest.fn()
}))

describe('utils/history', () => {
    const name1 = formElements[0].NAME
    const name2 = formElements[1].NAME
    const nameLast = formElements[2].NAME
    const originalPushState = global.history.pushState
    const mockPushState = jest.fn()

    beforeEach(() => {
        global.history.replaceState({}, undefined)
        global.history.pushState = mockPushState
        jest.clearAllMocks()
    })

    afterEach(() => {
        global.history.pushState = originalPushState
    })

    describe('pushState', () => {

        it('adds the value to History state using the given key', () => {
            const key = name1
            const value = 'foo'
            pushState(name1, value)

            const firstArg = global.history.pushState.mock.calls[0][0]
            expect(firstArg).toEqual(expect.objectContaining({ [name1]: value }))
        })

        it('works even when History state is initially null', () => {
            global.history.replaceState(null, undefined)
            const value = 'foo'
            pushState(name1, value)

            const firstArg = global.history.pushState.mock.calls[0][0]
            expect(firstArg).toEqual(expect.objectContaining({ [name1]: value }))
        })

        it('keeps values of previous fields in the History state', () => {
            const EXPECTED = { [name1]: 'foo' }
            global.history.replaceState(EXPECTED, undefined)
            pushState(name2, 'bar')

            const firstArg = global.history.pushState.mock.calls[0][0]
            expect(firstArg).toEqual(expect.objectContaining(EXPECTED))
        })

        it('adds the last form element name to History when pushing the 2nd to last field to state', () => {
            global.history.replaceState({ [name1]: 'foo' }, undefined)
            pushState(name2, 'bar')

            const firstArg = global.history.pushState.mock.calls[0][0]
            expect(firstArg).toEqual(expect.objectContaining({
                [nameLast]: expect.anything()
            }))
        })

        it('updates the path with the new state values in order, leaving off the last form element', () => {
            const FIRSTVAL = 'foo'
            const SECONDVAL = 'bar'
            global.history.replaceState({ [name1]: FIRSTVAL }, undefined)
            pushState(name2, SECONDVAL)

            const thirdArg = global.history.pushState.mock.calls[0][2]
            expect(thirdArg).toEqual(expect.stringContaining(FIRSTVAL))
            expect(thirdArg).toEqual(expect.stringContaining(SECONDVAL))
        })
    })

    describe('onPopState', () => {
        it('updates the form and does NOT fetch anything if the History state is empty', () => {
            onPopState({ state: null })
            expect(updateForm).toHaveBeenCalledTimes(1)
            expect(fetchAndPopulate).not.toHaveBeenCalled()
        })

        it('uses History state to fetch and populate each form element', () => {
            const state = {}
            formElements.forEach(({ NAME }) => {
                state[NAME] = 'value'
            })
            onPopState({ state })
            expect(fetchAndPopulate).toHaveBeenCalledTimes(formElements.length)
            formElements.forEach((formElement) => {
                expect(fetchAndPopulate).toHaveBeenCalledWith(formElement)
            })
        })

        it('updates the form after all fetching and populating is complete', async () => {
            const state = {}
            formElements.forEach(({ NAME }) => {
                state[NAME] = 'value'
                fetchAndPopulate.mockResolvedValueOnce(undefined)
            })
            await onPopState({ state })
            expect(updateForm).toHaveBeenCalledTimes(1)
        })
    })
})