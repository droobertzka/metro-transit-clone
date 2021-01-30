import { makeOnLoadError } from '../shared/events'
import { $departures } from '../shared/elements'
import { apiPath, fetchOpts, parseResponse } from '../shared/fetch-utils'

const populateDeparture = ($list) => (departure) => {
    const {
        route_short_name,
        terminal,
        description,
        departure_text
    } = departure
    const atOrIn = departure_text.toLowerCase().includes('min')
        ? 'in'
        : 'at'
    const $item = document.createElement('li')
    $item.innerHTML = `<strong>${
            route_short_name}${terminal || ''
        }</strong> departs for <strong>${
            description
        }</strong> ${atOrIn} <strong>${departure_text}</strong>`
    $list.appendChild($item)
}

const onLoadDepartures = ({ stops, departures }) => {
    $departures.replaceChildren() // Admittedly not cross-compatible
    const stop = stops && stops[0]
    const $header = document.createElement('h2')
    if (!stop) {
        $header.innerText = 'No data available for this stop'
        return
    }

    // Add header to departure section
    const { description, stop_id } = stop
    $header.innerHTML = `${description} <span class="stop-id">Stop #: ${
        stop_id
    }</span>`
    $departures.appendChild($header)

    const $list = document.createElement('ul')
    if (departures && departures.length > 0) {
        departures.forEach(populateDeparture($list))
    } else {
        const $item = document.createElement('li')
        $item.innerText = 'No departures at this time'
        $list.appendChild($item)
        $departures.appendChild($list)
    }

    $departures.appendChild($list)
}

export default (routeId, directionId, placeCode) => {
    fetch(`${apiPath}/${routeId}/${directionId}/${placeCode}`, fetchOpts)
        .then(parseResponse)
        .then(onLoadDepartures)
        .catch(makeOnLoadError('departures'))
}
