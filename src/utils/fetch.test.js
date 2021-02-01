import { $message, updateField } from '../components'
import { fetchAndPopulate } from './fetch'

jest.mock('../components', () => ({
    $message: {
        classList: { remove: jest.fn() }
    },
    updateField: jest.fn()
}))

describe('utils/fetch', () => {
    const consoleError = global.console.error
    const formElement = {
        NAME: 'name',
        getPath: jest.fn(() => 'foo/bar'),
        render: jest.fn()
    }
    const mockBadResponseOnce = () => {
        global.fetch.mockResponseOnce((res) => {
            res.ok = false
            return Promise.resolve(res)
        })
    }

    beforeEach(() => {
        global.console.error = () => {}
        jest.clearAllMocks()
        $message.innerHTML = undefined
    })

    afterEach(() => {
        global.console.error = consoleError
    })

    it("makes a fetch using the given form element's getPath function", async () => {
        await fetchAndPopulate(formElement)
        expect(formElement.getPath).toHaveBeenCalledWith(history.state)
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining(formElement.getPath()),
            expect.anything()
        )
    })

    it('passes a JSON content type header', async () => {
        await fetchAndPopulate(formElement)
        const secondFetchArg = global.fetch.mock.calls[0][1]
        expect(secondFetchArg.headers['Content-Type']).toEqual(
            expect.stringContaining('json')
        )
    })

    it('displays an error message if the response is NOT ok', async () => {
        // global.fetch.mockResponseOnce((res) => {
        //     res.ok = false
        //     return Promise.resolve(res)
        // })
        mockBadResponseOnce()
        await fetchAndPopulate(formElement)
        expect($message.innerHTML).toEqual(
            expect.stringContaining(formElement.NAME)
        )
        expect($message.classList.remove).toHaveBeenCalledWith('hidden')
    })

    it('renders the form element with the response data', async () => {
        const EXPECTED = { foo: 'bar' }
        global.fetch.mockResponseOnce(JSON.stringify(EXPECTED))
        await fetchAndPopulate(formElement)
        expect(formElement.render).toHaveBeenCalledWith(
            expect.objectContaining(EXPECTED)
        )
    })

    it('does NOT attempt a render for bad responses', async () => {
        mockBadResponseOnce()
        await fetchAndPopulate(formElement)
        expect(formElement.render).not.toHaveBeenCalled()
    })

    it('updates the field in the DOM', async () => {
        await fetchAndPopulate(formElement)
        expect(updateField).toHaveBeenCalledWith(formElement)
    })

    it('does NOT update the field in the DOM for bad responses', async () => {
        mockBadResponseOnce()
        await fetchAndPopulate(formElement)
        expect(updateField).not.toHaveBeenCalled()
    })
})