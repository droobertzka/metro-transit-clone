import makeRender from './populate-select'

export const NAME = 'directions'

export const $el = document.getElementById('select-direction')

export const $defaultOption = $el.querySelector('option')

export const valKey = 'direction_id'

export const descKey = 'direction_name'

export const getPath = ({ routes }) => `${NAME}/${routes}`

export const render = makeRender(NAME)