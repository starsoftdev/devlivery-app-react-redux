import React from 'react'
import PropTypes from 'prop-types'
import {Provider as ReduxProvider} from 'react-redux'
import {IntlProvider} from 'react-intl'
import {LocaleProvider} from 'antd'
import IdleTimer from 'react-idle-timer'
import { DAY, TOKEN_COOKIE, STATE_COOKIE } from '../constants'

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
    this.idleTimer = null
    this.onAction = this._onAction.bind(this)
    this.onActive = this._onActive.bind(this)
    this.onIdle = this._onIdle.bind(this)
    
  }
  _onAction(e) {
    //console.log('user did something', e)
    const token = this.props.context.cookies.get(TOKEN_COOKIE, { path: '/' })
    if(token !== null && token !== undefined)
    {
      this.props.context.cookies.set(TOKEN_COOKIE, token, {maxAge: DAY, path: '/'})
    }
  }
  _onActive(e) {
    //console.log('user is active', e)
    //console.log('time remaining', this.idleTimer.getRemainingTime())
  }
  _onIdle(e) {
    //console.log('user is idle', e)
    //console.log('last active', this.idleTimer.getLastActiveTime())
    this.props.context.cookies.remove(TOKEN_COOKIE, { path: '/' })
    this.props.context.cookies.remove(STATE_COOKIE, { path: '/' })
  }
  getChildContext() {
    return this.props.context
  }
  getChildComponent() {
    return React.Children.only(this.props.children)
  }
  render() {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return (
      <div>
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={250}
          timeout={1000 * 60 * 60} />
        {this.getChildComponent()}
      </div>
    )
  }

}

export default App
