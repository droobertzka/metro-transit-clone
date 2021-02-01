import { $message, updateField } from '../components'

const API_PATH = '/nextripv2'

const fetchOpts = {
    headers: {
        'Content-Type': 'application/json'
    }
}

const parseResponse = (response) =>
    response.ok
        ? response.json()
        : Promise.reject(new Error(response.statusText))

/** Makes a handler for errors fetching options for a <select> */
const makeOnLoadError = (name) => (error) => {
    console.error(error)
    $message.innerHTML =
        `There was an error loading ${
            name
        }. Please <a href="/">refresh</a> and try again.`
    $message.classList.remove('hidden')
}

/** Fetches data for a form element and populates it in the DOM */
export const fetchAndPopulate = (formElement) => {
    const path = `${API_PATH}/${formElement.getPath(history.state)}`

    return fetch(path, fetchOpts)
        .then(parseResponse)
        .then(formElement.render)
        .then(() => {
            updateField(formElement)
        })
        .catch(makeOnLoadError(formElement.NAME))
}
