
/**
 * Basic elements
 */
export const $message = document.querySelector('.message')

export const $selectRoute = document.getElementById('select-route')

export const $routeOption = $selectRoute.querySelector('option')

export const $selectDirection = document.getElementById('select-direction')

export const $directionOption = $selectDirection.querySelector('option')

export const $selectStop = document.getElementById('select-stop')

export const $stopOption = $selectStop.querySelector('option')

export const $departures = document.querySelector('section')

/**
 * Select data fetch handlers
 * - on success, populate options 
 * - on failure, warn user
 */
const addOption = ($select, value, innerText) => {
    const $option = document.createElement('option')
    $option.setAttribute('value', value)
    $option.innerText = innerText
    $select.appendChild($option)
}

export const makeOnLoadError = (itemsName) => (error) => {
    console.error(error)
    $message.classList.add('warning')
    $message.innerHTML = 
        `There was an error loading ${
            itemsName
        }. Please <a href="/">refresh</a> and try again.`
    $message.classList.remove('hidden')
}

export const makeOnLoad = ({
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

    $select.onchange = (event) => {
        // if default option is selected, do nothing
        if (!event.target.value) return

        onChange(event.target.value)
    }
    $select.removeAttribute('disabled')
    $select.classList.remove('hidden')
    $message.classList.add('hidden')
}
