export const apiPath = '/nextripv2'

export const fetchOpts = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const parseResponse = (response) =>
    response.ok
        ? response.json()
        : Promise.reject(new Error(response.statusText))
