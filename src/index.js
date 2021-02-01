import styles from './styles.css'
import typography from './typography'
import { onPopState } from './utils/history'
import { fetchAndPopulate } from './utils/fetch'
import { NAME as routeSelectName } from './components/route-select'

typography.injectStyles()
fetchAndPopulate(routeSelectName)
window.onpopstate = onPopState
