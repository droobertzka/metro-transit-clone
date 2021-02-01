export const NAME = 'stops'

export const $el = document.getElementById('select-stop')

export const $defaultOption = $el.querySelector('option')

export const valKey = 'place_code'

export const descKey = 'description'

export const getPath = ({ routes, directions }) => {
    return `${NAME}/${routes}/${directions}`
}
