import {applyMiddleware, compose, createStore} from 'redux'
import thunk from 'redux-thunk'
import createHelpers from './createHelpers'
import rootReducer from '../reducers'
import {initialState as purchaseState} from '../reducers/purchase'

export default function configureStore(initialState, helpersConfig) {
  const helpers = createHelpers(helpersConfig)
  const middleware = [
    thunk.withExtraArgument(helpers),
  ]

  let enhancer

  if (__DEV__) {
    // https://github.com/zalmoxisus/redux-devtools-extension#redux-devtools-extension
    let devToolsExtension = f => f
    if (process.env.BROWSER && window.devToolsExtension) {
      devToolsExtension = window.devToolsExtension()
    }

    enhancer = compose(
      applyMiddleware(...middleware),
      devToolsExtension,
    )
  } else {
    enhancer = applyMiddleware(...middleware)
  }

  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, {
    ...initialState,
    // TODO make it generic
    purchase: {...purchaseState, ...initialState.purchase}
    }, enhancer)

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (__DEV__ && module.hot) {
    module.hot.accept('../reducers', () =>
      // eslint-disable-next-line global-require
      store.replaceReducer(require('../reducers').default),
    )
  }

  return store
}
