import {
    $selectRoute,
    $routeOption,
    makeOnLoad,
    makeOnLoadError
} from '../shared/dom'
import { apiPath, fetchOpts, parseResponse } from '../shared/fetch-utils'
import fetchAndRenderDirections from './direction-select'
import get from '../shared/get'

const onLoadRoutes = makeOnLoad({
    $select: $selectRoute,
    $defaultOpt: $routeOption,
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
