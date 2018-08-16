import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import nodeFetch from 'node-fetch'
import React from 'react'
import ReactDOM from 'react-dom/server'
import PrettyError from 'pretty-error'
import {IntlProvider} from 'react-intl'
import './serverIntlPolyfill'
import App from './components/App'
import Html from './components/Html'
import {ErrorPageWithoutStyle} from './routes/error/ErrorPage'
import errorPageStyle from './routes/error/ErrorPage.css'
import createFetch from './createFetch'
import router from './router'
import configureStore from './store/configureStore'
import {setConfigVars, setCurrentPathname} from './reducers/global'
import chunks from './chunk-manifest.json'
import config from './config'
import {setLocale} from './reducers/intl'
import compression from 'compression'
import {LOCALE_COOKIE} from './constants'
import {persistCombineReducers, persistStore} from 'redux-persist'
import {CookieStorage, NodeCookiesWrapper} from 'redux-persist-cookie-storage'
import reducers from './reducers'
import Cookies from 'cookies'

const configurePersistor = async (store) => {
  return new Promise((resolve) => {
    const persistor = persistStore(store, {}, () => {
      resolve(persistor)
    })
  })
}

const app = express()

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {}
global.navigator.userAgent = global.navigator.userAgent || 'all'

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(compression())
app.use(express.static(path.resolve(__dirname, 'public')))
// TODO find a way to use universal-cookie-express for redux persist
app.use(Cookies.express())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const cookies = new Cookies(req, res)

    // Universal HTTP client
    const fetch = createFetch(nodeFetch, {
      apiUrl: config.api.url,
      cookies,
    })

    const initialState = {}

    const cookieJar = new NodeCookiesWrapper(cookies)

    const persistConfig = {
      key: 'root',
      storage: new CookieStorage(cookieJar, {
        setCookieOptions: {httpOnly: false}
      }),
      whitelist: [],
    }

    const rootReducer = persistCombineReducers(persistConfig, reducers)

    const store = configureStore(rootReducer, initialState, {
      fetch,
      cookies,
      // I should not use `history` on server.. but how I do redirection? follow universal-router
    })

    // Wait until persistor has completed deserialization
    const persistor = await configurePersistor(store)

    // Force cookies to be set
    await persistor.flush()

    store.dispatch(setCurrentPathname(req.path))
    store.dispatch(setConfigVars({
      apiUrl: config.api.url,
      locales: config.locales,
      stripeApiKey: config.stripe.apiKey,
    }))

    const locale = cookies.get(LOCALE_COOKIE) || config.locales[0]

    const {intl, antLocale} = await store.dispatch(setLocale({locale}))

    const css = new Set()

    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    const insertCss = (...styles) => {
      // eslint-disable-next-line no-underscore-dangle
      styles.forEach(style => css.add(style._getCss()))
    }

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      insertCss,
      fetch,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
      // intl instance as it can be get with injectIntl
      intl,
      antLocale,
      locale,
      // The twins below are wild, be careful!
      pathname: req.path,
      query: req.query,
      cookies,
    }

    const route = await router.resolve(context)

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect)
      return
    }

    const data = {...route}
    data.children = ReactDOM.renderToString(
      <App context={context} store={store}>
        {route.component}
      </App>,
    )
    data.styles = [{id: 'css', cssText: [...css].join('')}]

    const scripts = new Set()
    const addChunk = chunk => {
      if (chunks[chunk]) {
        chunks[chunk].forEach(asset => scripts.add(asset))
      } else if (__DEV__) {
        throw new Error(`Chunk with name '${chunk}' cannot be found`)
      }
    }
    addChunk('client')
    if (route.chunk) addChunk(route.chunk)
    if (route.chunks) route.chunks.forEach(addChunk)

    data.scripts = Array.from(scripts)
    data.app = {
      apiUrl: config.api.url,
      state: context.store.getState(),
      locale,
    }

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />)
    res.status(route.status || 200)
    res.send(`<!doctype html>${html}`)
  } catch (err) {
    next(err)
  }
})

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError()
pe.skipNodeFiles()
pe.skipPackage('express')

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const locale = req.language
  console.error(pe.render(err))
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{id: 'css', cssText: errorPageStyle._getCss()}]} // eslint-disable-line no-underscore-dangle
      app={{lang: locale}}
    >
    {ReactDOM.renderToString(
      <IntlProvider locale={locale}>
        <ErrorPageWithoutStyle error={err}/>
      </IntlProvider>,
    )}
    </Html>,
  )
  res.status(err.status || 500)
  res.send(`<!doctype html>${html}`)
})

//
// Launch the server
// -----------------------------------------------------------------------------
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`)
  })
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot
  module.hot.accept('./router')
}

export default app
