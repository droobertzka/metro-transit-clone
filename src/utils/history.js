import { formElements, updateForm } from '../components'
import { fetchAndPopulate } from './fetch'

const names = formElements.map(({ NAME }) => NAME)

/**
 * Creates new History state, given name of form field, new value, and which
 * fields to keep from current state
 */
const updateState = (name, value) => {
    if (!history.state) {
        return { [name]: value }
    }

    // Copy then mutate
    const fieldsToKeep = names.concat()
    fieldsToKeep.splice(names.indexOf(name) + 1)
    const lastFormElementName = names[names.length - 1]
    const initState = fieldsToKeep.length === names.length - 1
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
const updatePath = (state) => names.reduce((acc, curr, i) => {
    return state[curr] && i !== names.length - 1 ? acc + `/${state[curr]}` : acc
}, '')

/**
 * Pushes new state to History given the name and value of what changed and a
 * list of all the form elements
 */
export const pushState = (name, value) => {
    const state = updateState(name, value)
    const path = updatePath(state)
    history.pushState(state, undefined, path)
}

/** Update the DOM to reflect state when user navigates back/forward */
export const onPopState = ({ state }) => {
    if (!state) {
        updateForm()
        return
    }

    const fetches = Object.keys(state).map((name) => {
        const match = formElements.find(({ NAME }) => NAME === name)
        return fetchAndPopulate(match)
    })

    return Promise.all(fetches).then(updateForm)
}
