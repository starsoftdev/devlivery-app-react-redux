import createReducer from '../createReducer'
import {IntlProvider} from 'react-intl'
import {LocaleProvider} from 'antd'
import en from 'antd/lib/locale-provider/en_US'
import de from 'antd/lib/locale-provider/de_DE'
import {LOCALE_COOKIE, YEAR} from '../constants'

const antLocales = {
  /* @intl-code-template '${lang}-${COUNTRY}', */
  en,
  de,
  /* @intl-code-template-end */
}
// ------------------------------------
// Constants
// ------------------------------------
export const SET_LOCALE_START = 'Intl.SET_LOCALE_START'
export const SET_LOCALE_SUCCESS = 'Intl.SET_LOCALE_SUCCESS'
export const SET_LOCALE_FAILURE = 'Intl.SET_LOCALE_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
export const getIntlFromState = (state) => {
  const intl = (state && state.intl) || {}
  const {initialNow, locale, messages} = intl
  const localeMessages = (messages && messages[locale]) || {}
  const defaultLocale = state.global.locales[0]
  // TODO do not create new provider if exists - https://github.com/yahoo/react-intl/issues/416#issuecomment-223039994
  const provider = new IntlProvider({
    initialNow,
    locale,
    messages: localeMessages,
    defaultLocale,
  })
  const antdProvider = new LocaleProvider({
    locale: antLocales[locale.substring(0, 2)]
  })
  return {
    intl: provider.getChildContext().intl,
    antLocale: antdProvider.getChildContext().antLocale
  }
}

export const getIntl = () => (dispatch, getState) => {
  return getIntlFromState(getState())
}

export const setLocale = ({locale}) => (dispatch, getState) => {
  dispatch({type: SET_LOCALE_START, locale})
  try {
    // TODO improve it by fetching and caching
    const data = require(`../messages/${locale}.json`)
    const messages = data.reduce((msgs, msg) => {
      msgs[msg.id] = msg.message // eslint-disable-line no-param-reassign
      return msgs
    }, {})

    dispatch(setLocaleSuccess(locale, messages))
    // return bound intl instance at the end
    return getIntlFromState(getState())
  } catch (error) {
    dispatch(setLocaleFailure(locale, error))
    return null
  }
}

export const setLocaleSuccess = (locale, messages) => (dispatch, getState, {history, cookies}) => {
  dispatch({type: SET_LOCALE_SUCCESS, locale, messages})
  if (process.env.BROWSER) {
    cookies.set(LOCALE_COOKIE, locale, {maxAge: YEAR, path: '/'})
    //history.replace('/')
    window.location.reload();
  }
}

export const setLocaleFailure = (locale, error) => ({type: SET_LOCALE_FAILURE, locale, error})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  locale: null,
  messages: {}
}

export default createReducer(initialState, {
  [SET_LOCALE_START]: (state, {locale}) => ({
    locale: locale || state.locale,
  }),
  [SET_LOCALE_SUCCESS]: (state, {locale, messages}) => ({
    locale,
    messages: {
      ...state.messages,
      [locale]: messages,
    },
  }),
  [SET_LOCALE_FAILURE]: (state, action) => ({}),
})
