import {
    makeOnLoad,
    makeOnLoadError
} from '../shared/events'
import { apiPath, fetchOpts, parseResponse } from '../shared/fetch-utils'
import fetchAndRenderDirections from './direction-select'
import get from '../shared/get'

const onLoadRoutes = makeOnLoad({
    name: 'route',
    getVal: get('route_id'),
    getDesc: get('route_label'),
    onChange: fetchAndRenderDirections
})

export default () => {
    fetch(`${apiPath}/routes`, fetchOpts)
        .then(parseResponse)
        .then(onLoadRoutes)
        .catch(makeOnLoadError('routes'))
}
