import { $departures, $message, formElements } from './elements'

const fields = Object.keys(formElements)

/** Adds an <option> element to the given <select> */
const addOption = ($select, value, innerText) => {
    const $option = document.createElement('option')
    $option.setAttribute('value', value)
    $option.innerText = innerText
    $select.appendChild($option)
}

/**
 * Creates new History state, given name of form field, new value, and which
 * fields to keep from current state
 */
const updateState = (name, value, fieldsToKeep) => {
    if (!history.state) {
        return { [name]: value }
    }

    const state = fieldsToKeep.reduce((acc, curr) => {
        return {
            ...acc,
            [curr]: curr === name ? value : history.state[curr]
        }
    }, {})

    return state
}

/** Creates an updated path for History, given the state */
const updatePath = state => fields.reduce((acc, curr) => {
    return state[curr] ? acc + `/${state[curr]}` : acc
}, '')

/** Makes an onChange handler for a <select> with the given name */
const makeOnChange = (name, onChange) => ({ preventPush, target }) => {
    const { value } = target
    const fieldsToHide = fields.concat().reverse()
    const lastField = fieldsToHide[0]
    const fieldsToKeep = fieldsToHide.splice(fieldsToHide.indexOf(name))

    // Disable <select> fields dependent on changed one
    fieldsToHide.forEach(
        (field) => formElements[field].$select.disabled = true
    )

    // If the last <select> is cleared, clear the departures list
    if (
        $departures.children.length > 0 && (
            (name === lastField && !value)
            || fieldsToHide.includes(lastField)
        )
    ) {
        $departures.replaceChildren()
    }

    if (!value) return

    if (!preventPush) {
        const state = updateState(name, value, fieldsToKeep)
        history.pushState(state, undefined, updatePath(state))
    }
    onChange(value)
}

/**
 * Success handler for fetching <select> options
 * @callback onLoadHandler 
 * @param {Object[]} options - objects with value and text for an <option>
 */

/**
 * Makes a success handler for fetching options for a <select>
 * @param {Object} config 
 * @param {string} config.name - the name of the <select> that the data is for
 * @param {function} config.getVal - gets the value for an <option>
 * @param {function} config.getDesc - gets the description for an <option>
 * @param {function} config.onChange - logic to run when the <select> changes
 * @returns {onLoadHandler} - the success handler
 */
export const makeOnLoad = ({
    name,
    getVal,
    getDesc,
    onChange
}) => (options) => {
    const { $select, $option } = formElements[name]
    $select.replaceChildren($option)
    options.forEach((option) => {
        addOption($select, getVal(option), getDesc(option))
    })

    $select.onchange = makeOnChange(name, onChange)
    $select.removeAttribute('disabled')
    $message.classList.add('hidden')
}

/**
 * Error handler for fetching <select> options
 * @callback onLoadErrorHandler 
 * @param {Error} error - the error that occurred
 */

/**
 * Makes an error handler for fetching options for a <select>
 * @param {string} name - the name of the <select>
 * @returns {onLoadErrorHandler} - the error handler
 */
export const makeOnLoadError = (name) => (error) => {
    console.error(error)
    $message.innerHTML = 
        `There was an error loading ${
            name
        }. Please <a href="/">refresh</a> and try again.`
    $message.classList.remove('hidden')
}

/** Updates a <select> if corresponding state changes during onpopstate */
const updateFieldIfStateChanged = ([name, newValue]) => {
    const { $select } = formElements[name]
    if ($select.value === newValue) return

    $select.value = newValue || ''
    $select.onchange({
        target: { value: newValue },
        preventPush: true
    })
}

/** Update the DOM to reflect state when user navigates back/forward */
export const onPopState = ({ state }) => {
    // FIXME: bug w/ route <select> change after all 3 selects are filled out
    const withDefaults = Object.assign({ route: '', direction: '', stop: '' }, state)
    Object.entries(withDefaults).forEach(updateFieldIfStateChanged)
}