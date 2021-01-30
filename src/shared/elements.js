export const $message = document.querySelector('.message')

const $selectRoute = document.getElementById('select-route')

const $selectDirection = document.getElementById('select-direction')

const $selectStop = document.getElementById('select-stop')

export const formElements = {
    route: {
        $select: $selectRoute,
        $option: $selectRoute.querySelector('option')
    },
    direction: {
        $select: $selectDirection,
        $option: $selectDirection.querySelector('option')
    },
    stop: {
        $select: $selectStop,
        $option: $selectStop.querySelector('option')
    }
}

export const $departures = document.querySelector('section')
