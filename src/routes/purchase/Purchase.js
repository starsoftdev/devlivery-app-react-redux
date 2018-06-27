import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase.css'
import {Tooltip} from 'antd'
import {
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
  PURCHASE_COMPLETED_ROUTE
} from '../'
import messages from './messages'
import cn from 'classnames'
import {Link} from '../../components'

class Purchase extends React.Component {
  render() {
    const {children, intl, flow, currentRouteName} = this.props

    const current = flow.findIndex(item => item === currentRouteName)

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
    }

    return (
      <React.Fragment>
        <div className={s.content}>
          {children}
        </div>
        {![PURCHASE_COMPLETED_ROUTE].includes(currentRouteName) && (
          <div className={s.actions}>
            <div className={s.steps}>
              {flow.map((item, i) => {
                return (
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
                )
              })}
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  flow: state.purchase.flow,
  currentRouteName: state.global.currentRouteName,
})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase))
