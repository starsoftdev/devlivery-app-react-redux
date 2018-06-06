import React from 'react'
import {connect} from 'react-redux'
import {setCardStyle, submitCardStyle} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase3.css'
import {Actions, Card, SectionHeader} from '../../components'
import {ALPHABET} from '../../constants'
import ModernCardImage from '../../static/modern_card_style.png'
import FloralCardImage from '../../static/floral_card_style.jpg'
import VintageCardImage from '../../static/vintage_card_style.png'
import KeyHandler, {KEYPRESS} from 'react-key-handler'

const CARD_STYLES = [
  {key: 'modern', title: 'Modern', image: ModernCardImage},
  {key: 'floral', title: 'Floral', image: FloralCardImage},
  {key: 'vintage', title: 'Vintage', image: VintageCardImage},
  {key: 'modern2', title: 'Modern', image: ModernCardImage},
]

class Purchase3 extends React.Component {
  render() {
    const {cardStyle, setCardStyle, submitCardStyle} = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={'Select Style'}
            number={3}
            prefixClassName={s.headerPrefix}
          />
          <Row className={s.items} gutter={20} type='flex' align='center'>
            {CARD_STYLES.map((item, i) =>
              <Col key={item.key} className={s.itemWrapper}>
                <Card
                  className={s.item}
                  title={item.title}
                  image={item.image}
                  onClick={() => setCardStyle(item.key)}
                  active={item.key === cardStyle}
                  keyValue={ALPHABET[i]}
                />
              </Col>
            )}
          </Row>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={submitCardStyle}
          />
          <Button
            type='primary'
            disabled={!cardStyle}
            onClick={submitCardStyle}
          >
            Submit
          </Button>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  cardStyle: state.purchase.cardStyle,
  loading: state.purchase.loading,
})

const mapDispatch = {
  setCardStyle,
  submitCardStyle,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase3))
