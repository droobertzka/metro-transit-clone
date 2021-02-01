// This is now a History state module
import { updateForm } from '../components'
import { NAME as departuresName } from '../components/departures'
import { fetchAndPopulate } from './fetch'

/**
 * Creates new History state, given name of form field, new value, and which
 * fields to keep from current state
 */
const updateState = (name, value, fieldNames) => {
    if (!history.state) {
        return { [name]: value }
    }

    // Copy then mutate
    const fieldsToKeep = fieldNames.concat()
    fieldsToKeep.splice(fieldNames.indexOf(name) + 1)
    const lastFormElementName = fieldNames[names.length - 1]
    const initState = fieldsToKeep.length === fieldNames.length - 1
        ? { [lastFormElementName]: true }
        : {}

    const state = fieldsToKeep.reduce((acc, curr) => {
        return {
            ...acc,
            [curr]: curr === name ? value : history.state[curr]
        }
    }, initState)

    return state
}

/** Creates an updated path for History, given the state */
const updatePath = (state, fieldNames) => fieldNames.reduce((acc, curr) => {
    return state[curr] && curr !== departuresName ? acc + `/${state[curr]}` : acc
}, '')

/**
 * Pushes new state to History given the name and value of what changed and a
 * list of all the form elements
 */
export const pushState = (name, value, fieldNames) => {
    const state = updateState(name, value, fieldNames)
    const path = updatePath(state, fieldNames)
    history.pushState(state, undefined, path)
}

/** Update the DOM to reflect state when user navigates back/forward */
export const onPopState = ({ state }) => {
    if (!state) {
        updateForm()
        return
    }

    const fetches = Object.keys(state).map((name) => fetchAndPopulate(name))
    Promise.all(fetches).then(updateForm)
}
