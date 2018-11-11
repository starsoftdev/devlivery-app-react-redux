import React from 'react'
import {connect} from 'react-redux'
import {nextFlowStep, setCardSize} from '../../reducers/purchase'
import {Col, Row, Button} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase4.css'
import {Card, SectionHeader, PurchaseActions} from '../../components'
import {ALPHABET, CARD_SIZES} from '../../constants'
import messages from './messages'
import KeyHandler, {KEYPRESS} from 'react-key-handler'

class Purchase4 extends React.Component {
  render() {
    const {cardSize, setCardSize, nextFlowStep, intl, flowIndex} = this.props

    return (
      <div className={s.content}>
        <SectionHeader
          header={intl.formatMessage(messages.header)}
          number={flowIndex + 1}
          prefixClassName={s.headerPrefix}
        />
        <Row className={s.items} gutter={20} type='flex' align='center'>
          {CARD_SIZES(intl).map((item, i) =>
            <Col key={item.key} className={s.itemWrapper} md={12} lg={6}>
              <Card
                className={s.item}
                title={item.title}
                subtitle={item.subtitle}
                svg={item.svg}
                onClick={() => {
                  setCardSize(item)
                  nextFlowStep()
                }}
                active={cardSize && cardSize.key === item.key}
                keyValue={ALPHABET[i]}
                extra={item.extra}
              />
            </Col>
          )}
        </Row>
        <PurchaseActions>
          
        </PurchaseActions>
      </div>
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
