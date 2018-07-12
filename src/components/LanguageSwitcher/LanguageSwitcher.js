import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {connect} from 'react-redux'
import {setLocale} from '../../reducers/intl'
import s from './LanguageSwitcher.css'
import history from '../../history'
import {generateUrl} from '../../router'
import {HOME_ROUTE} from '../../routes'

const localeDict = {
  /* @intl-code-template '${lang}-${COUNTRY}': '${Name}', */
  'en-US': 'English',
  'de-DE': 'Deutsch',
  /* @intl-code-template-end */
}

class LanguageSwitcher extends React.Component {
  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    availableLocales: PropTypes.arrayOf(PropTypes.string).isRequired,
    setLocale: PropTypes.func.isRequired,
  }

  render() {
    const {currentLocale, availableLocales, setLocale} = this.props
    const isSelected = locale => locale === currentLocale
    const localeName = locale => localeDict[locale] || locale

    return (
      <div className={s.container}>
        {availableLocales.map(locale => (
          isSelected(locale) ? (
            <span key={locale} className={s.selectedLocale}>{localeName(locale)}</span>
          ) : (
            <a
              key={locale}
              className={s.locale}
              onClick={() => {
                setLocale({locale})
                history.push(generateUrl(HOME_ROUTE))
              }}
            >
              {localeName(locale)}
            </a>
          )
        ))}
      </div>
    )
  }
}

const mapState = state => ({
  availableLocales: state.global.locales,
  currentLocale: state.intl.locale,
})

const mapDispatch = {
  setLocale,
}

export default connect(mapState, mapDispatch)(withStyles(s)(LanguageSwitcher))
