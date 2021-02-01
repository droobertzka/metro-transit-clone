import { pushState } from '../utils/history'
import { fetchAndPopulate } from '../utils/fetch'
import { $message, updateForm } from '.'

/** Adds an <option> element to the given <select> */
const addOption = ($select, value, innerText) => {
    const $defaultOption = document.createElement('option')
    $defaultOption.setAttribute('value', value)
    $defaultOption.innerText = innerText
    $select.appendChild($defaultOption)
}

/** Makes a handler to populate <select> options after successful fetch */
const makeRender = (formElement) => (options) => {
    const { $el, $defaultOption, valKey, descKey } = formElement
    $el.replaceChildren($defaultOption)
    options.forEach((option) => {
        addOption($el, option[valKey], option[descKey])
    })

    $message.classList.add('hidden')
}

/** Makes <select> onchange handler to push state and perform next fetch */
const makeOnChange = (formElement, nextFormElement) => ({ target }) => {
    const { value } = target
    pushState(formElement.NAME, value)
    if (!value) return

    fetchAndPopulate(nextFormElement)
        .then(updateForm)
}

/** Mutates <select> form elements to add render and onchange handlers */
const addRenderAndOnChange = (formElement, index, formElements) => {
    if (!formElement.$defaultOption) return

    formElement.render = makeRender(formElement)
    const nextFormElement = formElements[index + 1]
    formElement.$el.onchange = makeOnChange(formElement, nextFormElement)
}

/** Add render and onchange handlers to <select> form elements */
export default (formElements) => {
    formElements.forEach(addRenderAndOnChange)
    return formElements
}
