import React from 'react'
import {connect} from 'react-redux'
import {HANDWRITTEN, nextFlowStep, PRINTED, setLetteringTechnique} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase2.css'
import {Actions, Card, SectionHeader} from '../../components'
import HandwrittenIcon from '../../static/handwritten.svg'
import PrintedIcon from '../../static/printed.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import {FormattedMessage} from 'react-intl'

class Purchase2 extends React.Component {
  render() {
    const {letteringTechnique, setLetteringTechnique, intl, nextFlowStep, flowIndex, user} = this.props

    const handwrittenDisabled = !user || !user.is_subscribed

    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <Row className={s.items} gutter={20} type='flex' align='center'>
            <Col className={s.itemWrapper}>
              <Card
                className={s.item}
                title={intl.formatMessage(messages.handwritten)}
                onClick={() => setLetteringTechnique(HANDWRITTEN)}
                active={letteringTechnique === HANDWRITTEN}
                keyValue='a'
                svg={HandwrittenIcon}
                disabled={handwrittenDisabled}
              />
              <p className={s.description}>
                {handwrittenDisabled && (
                  <React.Fragment>
                    <FormattedMessage
                      {...messages.handwrittenDisabled}
                      values={{email: <a href='mailto:support@byzumi.ch'>{'support@byzumi.ch'}</a>}}
                    />
                    <br/>
                    <br/>
                  </React.Fragment>
                )}
                {intl.formatMessage(messages.handwrittenDescription)}
              </p>
            </Col>
            <Col className={s.itemWrapper}>
              <Card
                className={s.item}
                title={intl.formatMessage(messages.printed)}
                onClick={() => setLetteringTechnique(PRINTED)}
                active={letteringTechnique === PRINTED}
                keyValue='b'
                svg={PrintedIcon}
              />
              <p className={s.description}>
                {intl.formatMessage(messages.printedDescription)}
              </p>
            </Col>
          </Row>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => letteringTechnique && nextFlowStep()}
          />
          <Button
            disabled={!letteringTechnique}
            type='primary'
            onClick={() => nextFlowStep()}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  letteringTechnique: state.purchase.letteringTechnique,
  flowIndex: state.purchase.flowIndex,
  user: state.global.user,
})

const mapDispatch = {
  setLetteringTechnique,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase2))
