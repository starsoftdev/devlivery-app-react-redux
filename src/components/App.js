import React from 'react'
import PropTypes from 'prop-types'
import {Provider as ReduxProvider} from 'react-redux'
import {IntlProvider} from 'react-intl'
import {LocaleProvider} from 'antd'
import Raven from 'raven-js';

Raven
    .config('https://0905932c6d084f0482d4ea11b0bc40b8@sentry.io/1272883')
    .install();
    
const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.func.isRequired,
  // Universal HTTP client
  fetch: PropTypes.func.isRequired,
  cookies: PropTypes.object.isRequired,
  // Integrate Redux
  // http://redux.js.org/docs/basics/UsageWithReact.html
  ...ReduxProvider.childContextTypes,
  pathname: PropTypes.string.isRequired,
  query: PropTypes.object,
  // ReactIntl
  intl: IntlProvider.childContextTypes.intl,
  antLocale: LocaleProvider.childContextTypes.antLocale,
  locale: PropTypes.string,
}

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends React.PureComponent {

  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  }

  static childContextTypes = ContextType
  constructor(props)
  {
    super(props)
    
    
  }
  getChildContext() {
    return this.props.context
  }

  render() {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return React.Children.only(this.props.children)
  }

}

export default App
