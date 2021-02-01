import * as routes from './route-select'
import * as directions from './direction-select'
import * as stops from './stop-select'
import * as departures from './departures'

export const $message = document.querySelector('.message')

export const formElements = { 
    [routes.NAME]: routes,
    [directions.NAME]: directions,
    [stops.NAME]: stops,
    [departures.NAME]: departures
}

export const updateField = (field, isHidden) => {
    const { $defaultOption, $el, NAME } = field

    // Only <select> form elements have a $defaultOption
    if ($defaultOption) {
        if (isHidden) {
            $el.setAttribute('disabled', true)
        } else {
            $el.removeAttribute('disabled')
        }

        $el.value = history.state && history.state[NAME] || ''
    }

    $el.classList.toggle('hidden', Boolean(isHidden))
}

export const updateForm = () => {
    const fields = Object.values(formElements)
    const firstEmptyFieldIndex = fields.findIndex(
        (field, index) =>
            !history.state 
            || !history.state[field.NAME] 
            || index === fields.length - 1
    )

    fields.forEach((field, index) => {
        const isHidden = index > firstEmptyFieldIndex
        updateField(field, isHidden)
    })
}
