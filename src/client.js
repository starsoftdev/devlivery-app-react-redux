import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import deepForceUpdate from 'react-deep-force-update'
import queryString from 'query-string'
import {addLocaleData} from 'react-intl'
// This is so bad: requiring all locale if they are not needed?
/* @intl-code-template import ${lang} from 'react-intl/locale-data/${lang}' */
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'
/* @intl-code-template-end */
import App from './components/App'
import createFetch from './createFetch'
import configureStore from './store/configureStore'
import history from './history'
import {updateMeta} from './DOMUtils'
import router from './router'
import {setCurrentPathname} from './reducers/global'
import {getIntl} from './reducers/intl'
import Cookies from 'universal-cookie'
import pick from 'lodash/pick'
import {STATE_COOKIE} from './constants'
import Raven from 'raven-js';

!__DEV__ && Raven
    .config('https://0905932c6d084f0482d4ea11b0bc40b8@sentry.io/1272883',{
      release: '28d432cab74611e88f564201c0a8d039'
    })
    .install();
/* @intl-code-template addLocaleData(${lang}) */
addLocaleData(en)
addLocaleData(de)
/* @intl-code-template-end */

/* eslint-disable global-require */

// Global (context) variables that can be easily accessed from any React component
// https://facebook.github.io/react/docs/context.html
const cookies = new Cookies()

const whatwgFetch = createFetch(fetch, {
  apiUrl: window.App.apiUrl,
  cookies,
})

const store = configureStore(window.App.state, {history, fetch: whatwgFetch, cookies})

store.subscribe(() => {
  // pick values because cookie has limited size
  const purchase = pick(store.getState().purchase, [
    //'occasion',
    'occasionId',
    'letteringTechnique',
    'flow',
    'flowIndex',
    //'card',
    'cardId',
    'cardColor',
    'cardStyle',
    'cardSize',
    'cardSizeKey',
    'orientation',
    //'cardDetails',
    //'gift',
    'giftType',
    'bundleId',
    'orderId',
    'donationOrg',
    'paymentMethod',
    'occasionType',
    'hideAmount',
    'deliveryLocation',
    'deliveryTime',
    //'voucher',
    //'fontFamilies',
    //'newrecipient'
    'saved'
  ])
  // TODO make it generic
  cookies.set(STATE_COOKIE, {purchase}, {path: '/'})
})

const {intl, antLocale} = store.dispatch(getIntl())

const insertCss = (...styles) => {
  // eslint-disable-next-line no-underscore-dangle
  const removeCss = styles.map(x => x._insertCss())
  return () => {
    removeCss.forEach(f => f())
  }
}

const context = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss,
  // Universal HTTP client
  fetch: whatwgFetch,
  // Initialize a new Redux store
  // http://redux.js.org/docs/basics/UsageWithReact.html
  store,
  storeSubscription: null,
  // intl instance as it can be get with injectIntl
  intl,
  antLocale,
  cookies,
}

const container = document.getElementById('app')
let currentLocation = history.location
let appInstance

const scrollPositionsHistory = {}

// Re-render the app when window.location changes
async function onLocationChange(location, action) {
  // Remember the latest scroll position for the previous location
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  }
  // Delete stored scroll position for next page if any
  if (action === 'PUSH') {
    delete scrollPositionsHistory[location.key]
  }
  currentLocation = location

  const {intl, antLocale} = store.dispatch(getIntl())

  context.intl = intl
  context.antLocale = antLocale

  if (currentLocation !== null) {
    store.dispatch(setCurrentPathname(location.pathname))
  }

  const isInitialRender = !action
  try {
    context.pathname = location.pathname
    context.query = queryString.parse(location.search)
    context.locale = store.getState().intl.locale

    // Traverses the list of routes in the order they are defined until
    // it finds the first route that matches provided URL path string
    // and whose action method returns anything other than `undefined`.
    const route = await router.resolve(context)

    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      return
    }

    if (route.redirect) {
      history.replace(route.redirect)
      return
    }

    const renderReactApp = isInitialRender ? ReactDOM.hydrate : ReactDOM.render
    appInstance = renderReactApp(
      <App context={context}>{route.component}</App>,
      container,
      () => {
        if (isInitialRender) {
          if (window.history && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual'
          }

          const elem = document.getElementById('css')
          if (elem) elem.parentNode.removeChild(elem)
          return
        }
        document.title = route.title

        updateMeta('description', route.description)
        // Update necessary tags in <head> at runtime here, ie:
        // updateMeta('keywords', route.keywords)
        // updateCustomMeta('og:url', route.canonicalUrl)
        // updateCustomMeta('og:image', route.imageUrl)
        // updateLink('canonical', route.canonicalUrl)
        // etc.

        let scrollX = 0
        let scrollY = 0
        const pos = scrollPositionsHistory[location.key]
        if (pos) {
          scrollX = pos.scrollX
          scrollY = pos.scrollY
        } else {
          const targetHash = location.hash.substr(1)
          if (targetHash) {
            const target = document.getElementById(targetHash)
            if (target) {
              scrollY = window.pageYOffset + target.getBoundingClientRect().top
            }
          }
        }

        // Restore the scroll position if it was saved into the state
        // or scroll to the given #hash anchor
        // or scroll to top of the page
        window.scrollTo(scrollX, scrollY)
      },
    )
  } catch (error) {
    if (__DEV__) {
      throw error
    }

    console.error(error)

    // Do a full page reload if error occurs during client-side navigation
    if (!isInitialRender && currentLocation.key === location.key) {
      console.error('RSK will reload your page after error')
      window.location.reload()
    }
  }
}

let isHistoryObserved = false
export default function main() {
  // Handle client-side navigation by using HTML5 History API
  // For more information visit https://github.com/mjackson/history#readme
  currentLocation = history.location
  if (!isHistoryObserved) {
    isHistoryObserved = true
    history.listen(onLocationChange)
  }
  onLocationChange(currentLocation)
}

// globally accesible entry point
window.RSK_ENTRY = main

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./router', () => {
    if (appInstance && appInstance.updater.isMounted(appInstance)) {
      // Force-update the whole tree, including components that refuse to update
      deepForceUpdate(appInstance)
    }

    onLocationChange(currentLocation)
  })
}
