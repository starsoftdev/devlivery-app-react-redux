import React from 'react'
import {connect} from 'react-redux'
import {nextFlowStep} from '../../reducers/purchase'
import {Button} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase13.css'
import {Actions, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'

class Purchase13 extends React.Component {
  render() {
    const {nextFlowStep, flowIndex} = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={'Credit Card Information'}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={nextFlowStep}
          />
          <Button
            onClick={nextFlowStep}
            type='primary'
          >
            Pay
          </Button>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase13))
