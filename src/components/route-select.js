import makeRender from './populate-select'

export const NAME = 'routes'

export const $el = document.getElementById('select-route')

export const $defaultOption = $el.querySelector('option')

export const valKey = 'route_id'

export const descKey = 'route_label'

export const getPath = () => NAME

export const render = makeRender(NAME)
