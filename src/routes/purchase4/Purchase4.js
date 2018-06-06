import React from 'react'
import {connect} from 'react-redux'
import {setCardSize, submitCardSize} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase4.css'
import {Card} from '../../components'
import {ALPHABET} from '../../constants'
import ArrowIcon from '../../static/decor_arrow.svg'
import BigCardImage from '../../static/big_card.svg'
import PanelCardImage from '../../static/panel_card.svg'
import GreetingCardImage from '../../static/greeting_card.svg'
import PostcardImage from '../../static/postcard.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'

const CARD_STYLES = [
  {key: 'folded_card', title: 'Folded Card', svg: BigCardImage, extra: '4" x 5"'},
  {key: 'postcard', title: 'Postcard', svg: PostcardImage, extra: '5" x 7"'},
  {key: 'folder_card_without_panel', title: 'Folded Card without Panel', svg: PanelCardImage, extra: '6" x 6"'},
  {key: 'folder_card2', title: 'Folded Card', svg: GreetingCardImage, extra: '4" x 9"'},
]

class Purchase4 extends React.Component {
  render() {
    const {cardSize, setCardSize, submitCardSize} = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          <h1 className={s.header}>
            <span className={s.headerPrefix}>
              4
              <ArrowIcon className={s.arrowIcon}/>
            </span>
            Choose the Format
          </h1>
          <Row className={s.items} gutter={20} type='flex' align='center'>
            {CARD_STYLES.map((item, i) =>
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
        <div className={s.actions}>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={submitCardSize}
          />
          <Button
            type='primary'
            className={s.submitBtn}
            disabled={!cardSize}
            onClick={submitCardSize}
          >
            Submit
          </Button>
        </div>
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
