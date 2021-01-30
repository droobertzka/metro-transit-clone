import styles from './styles.css'
import typography from './typography'
import fetchAndRenderRoutes from './components/route-select'
import { onPopState } from './shared/events'

typography.injectStyles()
fetchAndRenderRoutes()

window.onpopstate = onPopState
