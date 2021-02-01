// Make this into select module
import { pushState } from '../utils/history'
import { fetchAndPopulate } from '../utils/fetch'
import { formElements, $message, updateForm } from '.'

/** Makes an onChange handler for a <select> with the given name */
const makeOnChange = (name) => ({ target }) => {
    const { value } = target
    const fieldNames = Object.keys(formElements)
    pushState(name, value, fieldNames)
    
    if (value) {
        fetchAndPopulate(fieldNames[fieldNames.indexOf(name) + 1])
            .then(updateForm)
    }
}

/** Adds an <option> element to the given <select> */
const addOption = ($select, value, innerText) => {
    const $defaultOption = document.createElement('option')
    $defaultOption.setAttribute('value', value)
    $defaultOption.innerText = innerText
    $select.appendChild($defaultOption)
}

/** Makes a handler to populate <select> options after successful fetch */
export default (name) => (options) => {
    const { $el, $defaultOption, valKey, descKey } = formElements[name]
    $el.replaceChildren($defaultOption)
    options.forEach((option) => {
        addOption($el, option[valKey], option[descKey])
    })

    $el.onchange = makeOnChange(name)
    $message.classList.add('hidden')
}
