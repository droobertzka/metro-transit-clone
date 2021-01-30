import { $departures, makeOnLoadError } from '../shared/dom'
import { apiPath, fetchOpts, parseResponse } from '../shared/fetch-utils'

const onLoadDepartures = ({ stops, departures }) => {
    $departures.replaceChildren() // Admittedly not cross-compatible
    const stop = stops && stops[0]
    if (!stop) {
        // TODO: No stop retrieved
        return
    }

    // Add header to departure section
    const { description, stop_id } = stop
    const $header = document.createElement('h2')
    $header.innerHTML = `${description} <span class="stop-id">Stop #: ${
        stop_id
    }</span>`
    $departures.appendChild($header)

    if (!departures || departures.length < 1) {
        // TODO: No departures
        return
    }

    // Populate departures
    const $list = document.createElement('ul')
    departures.forEach((departure) => {
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
    })
    $departures.appendChild($list)
}

export default (routeId, directionId, placeCode) => {
    fetch(`${apiPath}/${routeId}/${directionId}/${placeCode}`, fetchOpts)
        .then(parseResponse)
        .then(onLoadDepartures)
        .catch(makeOnLoadError('departures'))
}
