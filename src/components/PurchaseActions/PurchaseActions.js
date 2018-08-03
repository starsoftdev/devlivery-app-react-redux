import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './PurchaseActions.css'
import {Tooltip} from 'antd'
import {
  ADD_BUNDLE_ROUTE,
  CONFIRM_DONATION_ROUTE,
  DONATION_ROUTE,
  PURCHASE10_ROUTE,
  PURCHASE11_ROUTE,
  PURCHASE12_ROUTE,
  PURCHASE13_ROUTE,
  PURCHASE1_ROUTE,
  PURCHASE2_ROUTE,
  PURCHASE3_ROUTE,
  PURCHASE4_ROUTE,
  PURCHASE5_ROUTE,
  PURCHASE6_ROUTE,
  PURCHASE7_ROUTE,
  PURCHASE8_ROUTE,
  PURCHASE9_ROUTE,
  VOUCHER_ROUTE,
} from '../../routes'
import messages from './messages'
import cn from 'classnames'
import {Link} from '../../components'
import {injectIntl} from 'react-intl'

class Purchase extends React.Component {
  render() {
    const {children, intl, flow, currentRouteName} = this.props

    const current = flow.routes.findIndex(item => item === currentRouteName)

    const flowNames = {
      [PURCHASE1_ROUTE]: intl.formatMessage(messages.purchase1),
      [PURCHASE2_ROUTE]: intl.formatMessage(messages.purchase2),
      [PURCHASE3_ROUTE]: intl.formatMessage(messages.purchase3),
      [PURCHASE4_ROUTE]: intl.formatMessage(messages.purchase4),
      [PURCHASE5_ROUTE]: intl.formatMessage(messages.purchase5),
      [PURCHASE6_ROUTE]: intl.formatMessage(messages.purchase6),
      [PURCHASE7_ROUTE]: intl.formatMessage(messages.purchase7),
      [PURCHASE8_ROUTE]: intl.formatMessage(messages.purchase8),
      [PURCHASE9_ROUTE]: intl.formatMessage(messages.purchase9),
      [PURCHASE10_ROUTE]: intl.formatMessage(messages.purchase10),
      [PURCHASE11_ROUTE]: intl.formatMessage(messages.purchase11),
      [PURCHASE12_ROUTE]: intl.formatMessage(messages.purchase12),
      [PURCHASE13_ROUTE]: intl.formatMessage(messages.purchase13),
      [ADD_BUNDLE_ROUTE]: intl.formatMessage(messages.addBundle),
      [DONATION_ROUTE]: intl.formatMessage(messages.donation),
      [CONFIRM_DONATION_ROUTE]: intl.formatMessage(messages.confirmDonation),
      [VOUCHER_ROUTE]: intl.formatMessage(messages.voucher),
    }

    return (
      <div className={s.actionsWrapper}>
        <div className={s.actions} style={{justifyContent: children ? 'space-between' : 'center'}}>
          <div className={s.steps}>
            {flow.routes.map((item, i) => {
              return flow.length - 1 !== i ? (
                <div key={item} className={cn(s.stepWrapper, {
                  [s.current]: i === current,
                  [s.completed]: i < current,
                  [s.pending]: i > current,
                })}>
                  <div className={s.tail}/>
                  <Tooltip title={flowNames[item]}>
                    {i < current ? (
                      <Link to={item} className={s.step}/>
                    ) : (
                      <div className={s.step}/>
                    )}
                  </Tooltip>
                </div>
              ) : null
            })}
          </div>
          {children}
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  flow: state.purchase.flow,
  currentRouteName: state.global.currentRouteName,
})

const mapDispatch = {}

export default injectIntl(connect(mapState, mapDispatch)(withStyles(s)(Purchase)))
