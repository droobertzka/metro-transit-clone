import styles from './styles.css'
import typography from './typography'
import { onPopState } from './utils/history'
import { fetchAndPopulate } from './utils/fetch'
import { formElements } from './components'

typography.injectStyles()
fetchAndPopulate(formElements[0])
window.onpopstate = onPopState
