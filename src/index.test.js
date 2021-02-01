import typography from './typography'
import { onPopState } from './utils/history'
import { fetchAndPopulate } from './utils/fetch'
import { formElements } from './components'
import '.'

jest.mock('./typography', () => ({
    injectStyles: jest.fn()
}))

jest.mock('./utils/history', () => ({
    onPopState: jest.fn()
}))

jest.mock('./utils/fetch', () => ({
    fetchAndPopulate: jest.fn()
}))

jest.mock('./components', () => ({
    formElements: ['first']
}))

describe('index.js', () => {
    it('injects a typography stylesheet', () => {
        expect(typography.injectStyles).toHaveBeenCalled()
    })

    it('fetches data and populates options for the first field in the form', () => {
        expect(fetchAndPopulate).toHaveBeenCalledWith(formElements[0])
    })

    it('sets up back/forward navigation handling', () => {
        expect(window.onpopstate).toBe(onPopState)
    })
})