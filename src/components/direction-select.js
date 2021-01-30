import {
    $selectDirection,
    $directionOption,
    makeOnLoad,
    makeOnLoadError
} from '../shared/dom'
import { apiPath, fetchOpts, parseResponse } from '../shared/fetch-utils'
import fetchAndRenderStops from './stop-select'
import get from '../shared/get'

const onLoadDirections = (routeId) => makeOnLoad({
    $select: $selectDirection,
    $defaultOpt: $directionOption,
    getVal: get('direction_id'),
    getDesc: get('direction_name'),
    onChange: fetchAndRenderStops.bind(null, routeId)
})

export default (routeId) => {
    fetch(`${apiPath}/directions/${routeId}`, fetchOpts)
        .then(parseResponse)
        .then(onLoadDirections(routeId))
        .catch(makeOnLoadError('directions'))
}
