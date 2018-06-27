import React from 'react'
import {connect} from 'react-redux'
import {setCardSize, submitCardSize} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase4.css'
import {Actions, Card, SectionHeader} from '../../components'
import {ALPHABET} from '../../constants'
import BigCardImage from '../../static/big_card.svg'
import PanelCardImage from '../../static/panel_card.svg'
import GreetingCardImage from '../../static/greeting_card.svg'
import PostcardImage from '../../static/postcard.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'

class Purchase4 extends React.Component {
  render() {
    const {cardSize, setCardSize, submitCardSize, intl, flowIndex} = this.props

    const CARD_SIZES = [
      {key: 'folded_card', title: intl.formatMessage(messages.foldedCard), svg: BigCardImage, extra: '4" x 5"'},
      {key: 'postcard', title: intl.formatMessage(messages.postcard), svg: PostcardImage, extra: '5" x 7"'},
      {key: 'folder_card_without_panel', title: intl.formatMessage(messages.foldedCardWithoutPanel), svg: PanelCardImage, extra: '6" x 6"'},
      {key: 'folder_card2', title: intl.formatMessage(messages.foldedCard), svg: GreetingCardImage, extra: '4" x 9"'},
    ]

    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header= {intl.formatMessage(messages.header)}
            number={flowIndex}
            prefixClassName={s.headerPrefix}
          />
          <Row className={s.items} gutter={20} type='flex' align='center'>
            {CARD_SIZES.map((item, i) =>
              <Col key={item.key} className={s.itemWrapper}>
                <Card
                  className={s.item}
                  title={item.title}
                  svg={item.svg}
                  onClick={() => setCardSize(item.key)}
                  active={item.key === cardSize}
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
            onKeyHandle={submitCardSize}
          />
          <Button
            type='primary'
            disabled={!cardSize}
            onClick={submitCardSize}
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
})

const mapDispatch = {
  setCardSize,
  submitCardSize,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase4))
