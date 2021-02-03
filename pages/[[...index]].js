import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home({ routeOptions, initDirections, initStops = [], message }) {
  // Data from pathParams
  const router = useRouter()
  const { index: pathParams = [] } = router.query
  const [pathRoute = '', pathDirection = ''] = pathParams

  // State
  const [directionOptions, setDirectionOptions] = useState(initDirections)
  const [selectedRoute, setRoute] = useState(pathRoute)
  const [selectedDirection, setDirection] = useState(pathDirection)
  const [stops, setStops] = useState(initStops)

  // Effects
  useEffect(() => {
    if (pathDirection === selectedDirection) return
    setDirection(pathDirection)
  }, [initDirections, pathDirection])

  useEffect(() => {
    setDirectionOptions(initDirections)
  }, [initDirections])

  useEffect(() => {
    setStops(initStops)
  }, [initStops])

  useEffect(() => {
    if (pathRoute === selectedRoute) return
    setRoute(pathRoute)
  }, [pathRoute])

  // OnChange Handlers
  const onSelectRoute = ({ target }) => {
    router.push('/' + target.value)
    setRoute(target.value)
    setDirection('')
    setStops([])
  }

  const onSelectDirection = ({ target }) => {
    router.push(`${selectedRoute}/${target.value}`)
    setDirection(target.value)
    setStops([])
  }

  // Text
  const directionOption =
    selectedDirection
    && directionOptions
    && directionOptions.find(({ id }) => id === selectedDirection)
  const directionName = directionOption && directionOption.name
  const routeOption = 
    selectedRoute && routeOptions.find(({ id }) => id === selectedRoute)
  const routeName = routeOption && routeOption.name
  const stopsHeading =
    directionName && routeName && `${directionName} ${routeName}`

  // Render
  return (
    <div className={styles.container}>
      <Head>
        <title>NexTrip | Metro Transit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <Image src="/MetroTransitLogo.svg"
            alt="Metro Transit"
            className="logo"
            width={282}
            height={47} />
          {' '}
          <span>NexTrip</span>
        </h1>

        <p className={styles.description}>
          Real-time Departures by Route
        </p>

        {message && <div className="warning">{message}</div>}

        {router.isFallback ? <p className="loading">Loading</p> : <form>
            <label htmlFor="select-route" className="sr-only">Select route</label>
            <select id="select-route"
              name="routes"
              value={selectedRoute || ''}
              onChange={onSelectRoute}
            >
                <option value="">Select route</option>
                {routeOptions && routeOptions.map(({ id, name }) =>
                    <option key={id} value={id}>{name}</option>)
                }
            </select>

            <label htmlFor="select-direction" className="sr-only">Select direction</label>
            <select id="select-direction"
              name="directions"
              className={selectedRoute ? '' : 'hidden'}
              value={selectedDirection || ''}
              onChange={onSelectDirection}
              disabled={!selectedRoute}
            >
                <option value="">Select direction</option>
                {directionOptions && directionOptions.map(({ id, name }) =>
                    <option key={id} value={id}>{name}</option>)
                }
            </select>

        </form>
        }
        {router.isFallback || <section className={selectedRoute && selectedDirection && stops.length ? '' : 'hidden'}>
          { stopsHeading
            && <h2>{stopsHeading} <span className="stop-id">| Stops</span></h2>
          }
          <ul>
            {stops && stops.map(({ id, name }) => 
                <li key={id}>{name} ({id})</li>)
            }
          </ul>
        </section>
        }
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/droobertzka" target="_blank" rel="noopener noreferrer" >
          <em>Powered by:</em> <strong>Droobertzka Dev</strong> (and ☕)
        </a>
      </footer>
    </div>
  )
}

// Shared fetch functions
// TODO: caching
const API = 'https://svc.metrotransit.org/nextripv2'

const fetchRoutes = async () => {
  console.log('fetching routes')
  const res = await fetch(`${API}/routes`)
  const routes = await res.json()
  return routes.map(({ route_id, route_label }) => ({
    id: route_id,
    name: route_label
  }))
}

const fetchDirections = async (routeId) => {
  console.log('fetching directions')
  const res = await fetch(`${API}/directions/${routeId}`)
  const directions = await res.json()
  return directions.map(({ direction_id, direction_name }) => ({
    id: direction_id.toString(),
    name: direction_name
  }))
}

const fetchStops = async (routeId, directionId) => {
  console.log('fetching stops')
  const res = await fetch(`${API}/stops/${routeId}/${directionId}`)
  const stops = await res.json()
  return stops.map(({ place_code, description }) => ({
    id: place_code,
    name: description
  }))
}

export async function getStaticProps(context) {
  const { index: pathParams } = context.params
  const [ selectedRoute = '', selectedDirection = '' ] = pathParams || []

  let error = null
  let routeOptions = []
  try {
    routeOptions = await fetchRoutes()
  } catch (e) {
    error = e.message
  }

  let initDirections = []
  if (selectedRoute) {
    try {
      initDirections = await fetchDirections(selectedRoute)
    } catch (e) {
      error = e.message
    }
  }

  let initStops = []
  if (selectedRoute && selectedDirection) {
    try {
      initStops = await fetchStops(selectedRoute, selectedDirection)
    } catch (e) {
      error = e.message
    }
  }

  return {
    props: {
      routeOptions,
      selectedRoute,
      initDirections,
      selectedDirection,
      initStops,
      message: error
    },
    revalidate: 10
  }
}

export async function getStaticPaths() {
  const routes = await fetchRoutes()

  const fetchAndPairDirections = async (routeId) => {
    const directions = await fetchDirections(routeId)
    return directions.map(({ id }) => [routeId, id])
  }

  const makePath = (pathParams) => ({ params: { index: pathParams } })

  // List of strings
  const routeIds = routes.map(({ id }) => id)

  // List of lists of [routeId, direction] (one list of lists for each routeId)
  const routeIdsWithDirections = await Promise.all(
    routeIds.map(fetchAndPairDirections)
  )

  const paths = [
    ...routeIds.map(rid => makePath([rid])),
    ...routeIdsWithDirections.flat().map(pair => makePath(pair))
  ]

  return { paths, fallback: true }
}
