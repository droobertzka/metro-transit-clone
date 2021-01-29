import styles from './styles.css'
import typography from './typography'

typography.injectStyles()

const $message = document.querySelector('.message')
const $selectRoute = document.getElementById('select-route')
const $routeOption = $selectRoute.querySelector('option')
const $selectDirection = document.getElementById('select-direction')
const $directionOption = $selectDirection.querySelector('option')
const $selectStop = document.getElementById('select-stop')
const $stopOption = $selectStop.querySelector('option')
const $departures = document.querySelector('section')

const apiPath = '/nextripv2'
const fetchOpts = {
    headers: {
        'Content-Type': 'application/json'
    }
}

// Utilities
const parseResponse = (response) =>
    response.ok
        ? response.json()
        : Promise.reject(new Error(response.statusText))

const addOption = ($select, value, innerText) => {
    const $option = document.createElement('option')
    $option.setAttribute('value', value)
    $option.innerText = innerText
    $select.appendChild($option)
}

const makeOnLoadError = (itemsName) => (error) => {
    console.error(error)
    $message.classList.add('warning')
    $message.innerHTML = 
        `There was an error loading ${
            itemsName
        }. Please <a href="/">refresh</a> and try again.`
    $message.classList.remove('hidden')
}

const makeOnLoad = ({
    $select,
    $defaultOpt,
    getVal,
    getDesc,
    onChange
}) => (options) => {
    $select.replaceChildren($defaultOpt)
    options.forEach((option) => {
        addOption($select, getVal(option), getDesc(option))
    })

    if (onChange) {
        $select.onchange = onChange
    }
    $select.removeAttribute('disabled')
    $select.classList.remove('hidden')
    $message.classList.add('hidden')
}

const get = key => obj => obj[key]

// Routes
const onLoadRoutes = makeOnLoad({
    $select: $selectRoute,
    $defaultOpt: $routeOption,
    getVal: get('route_id'),
    getDesc: get('route_label'),
    onChange(event) {
        fetchDirections(event.target.value)
    }
})

const fetchRoutes = () => {
    fetch(`${apiPath}/routes`, fetchOpts)
        .then(parseResponse)
        .then(onLoadRoutes)
        .catch(makeOnLoadError('routes'))
}

// Directions
const onLoadDirections = (routeId) => makeOnLoad({
    $select: $selectDirection,
    $defaultOpt: $directionOption,
    getVal: get('direction_id'),
    getDesc: get('direction_name'),
    onChange(event) {
        fetchStops(routeId, event.target.value)
    }
})

const fetchDirections = (routeId) => {
    fetch(`${apiPath}/directions/${routeId}`, fetchOpts)
        .then(parseResponse)
        .then(onLoadDirections(routeId))
        .catch(makeOnLoadError('directions'))
}

// Stops
const onLoadStops = (routeId, directionId) => makeOnLoad({
    $select: $selectStop,
    $defaultOpt: $stopOption,
    getVal: get('place_code'),
    getDesc: get('description'),
    onChange(event) {
        fetchDepartures(routeId, directionId, event.target.value)
    }
})

const fetchStops = (routeId, directionId) => {
    fetch(`${apiPath}/stops/${routeId}/${directionId}`, fetchOpts)
        .then(parseResponse)
        .then(onLoadStops(routeId, directionId))
        .catch(makeOnLoadError('stops'))
}

// Departures
const onLoadDepartures = ({ stops, departures }) => {
    $departures.replaceChildren()
    const stop = stops && stops[0]
    if (!stop) {
        // TODO: No stop retrieved
        return
    }

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
const fetchDepartures = (routeId, directionId, placeCode) => {
    fetch(`${apiPath}/${routeId}/${directionId}/${placeCode}`)
        .then(parseResponse)
        .then(onLoadDepartures)
        .catch(makeOnLoadError('departures'))
}


// Init
fetchRoutes()