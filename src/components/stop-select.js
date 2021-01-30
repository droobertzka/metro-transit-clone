import {
    $selectStop,
    $stopOption,
    makeOnLoad,
    makeOnLoadError
} from '../shared/dom'
import { apiPath, fetchOpts, parseResponse } from '../shared/fetch-utils'
import fetchAndRenderDepartures from './departures'
import get from '../shared/get'

const onLoadStops = (routeId, directionId) => makeOnLoad({
    $select: $selectStop,
    $defaultOpt: $stopOption,
    getVal: get('place_code'),
    getDesc: get('description'),
    onChange: fetchAndRenderDepartures.bind(null, routeId, directionId)
})

export default (routeId, directionId) => {
    fetch(`${apiPath}/stops/${routeId}/${directionId}`, fetchOpts)
        .then(parseResponse)
        .then(onLoadStops(routeId, directionId))
        .catch(makeOnLoadError('stops'))
}
