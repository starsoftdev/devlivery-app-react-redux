import React from 'react'
import {connect} from 'react-redux'
import {nextFlowStep, setCardSize} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase4.css'
import {Actions, Card, SectionHeader} from '../../components'
import {ALPHABET, CARD_SIZES} from '../../constants'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'

class Purchase4 extends React.Component {
  render() {
    const {cardSize, setCardSize, nextFlowStep, intl, flowIndex} = this.props

    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <Row className={s.items} gutter={20} type='flex' align='center'>
            {CARD_SIZES(intl).map((item, i) =>
              <Col key={item.key} className={s.itemWrapper}>
                <Card
                  className={s.item}
                  title={item.title}
                  svg={item.svg}
                  onClick={() => setCardSize(item)}
                  active={cardSize && cardSize.key === item.key}
                  keyValue={ALPHABET[i]}
                  extra={item.extra}
                />
              </Col>
            )}
          </Row>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => cardSize && nextFlowStep()}
          />
          <Button
            type='primary'
            disabled={!cardSize}
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
  cardSize: state.purchase.cardSize,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  setCardSize,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase4))
