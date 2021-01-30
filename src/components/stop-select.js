import {
    makeOnLoad,
    makeOnLoadError
} from '../shared/events'
import { apiPath, fetchOpts, parseResponse } from '../shared/fetch-utils'
import fetchAndRenderDepartures from './departures'
import get from '../shared/get'

const onLoadStops = (routeId, directionId) => makeOnLoad({
    name: 'stop',
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
