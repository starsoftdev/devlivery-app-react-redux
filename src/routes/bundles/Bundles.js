import React from 'react'
import {connect} from 'react-redux'
import {Calendar, Col, Input, Row, Table} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Bundles.css'
import {clear, getBundles} from '../../reducers/bundles'
import cardImage from '../../static/modern_card_style.png'
import giftImage from '../../static/gift1.png'
import PlusIcon from '../../static/plus_round.svg'

class Bundles extends React.Component {
  render() {
    const {bundlesCount, bundles, page, pageSize, loading} = this.props

    // TODO add pagination

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>Created Bundles</h1>
          {/*TODO add search icon*/}
          <Input className={s.search} placeholder={'Search'}/>
        </div>
        <Row type='flex' gutter={20}>
          {bundles.map((bundle) =>
            <Col key={bundle.id} xs={24} sm={12}>
              <div className={s.orderInfo}>
                <div className={s.cardWrapper}>
                  <div>
                    <img src={cardImage} className={s.cardImage}/>
                  </div>
                  <PlusIcon className={s.plusIcon}/>
                  <p className={s.cardInfo}>
                    <span className={s.cardType}>Christmas Card</span>
                    <br/>
                    <span className={s.cardPrice}>20.00</span>
                    <span className={s.cardPriceCurrency}>CHF</span>
                  </p>
                </div>
                <div className={s.giftWrapper}>
                  <div>
                    <img src={giftImage} className={s.giftImage}/>
                  </div>
                  <p className={s.cardInfo}>
                    <span className={s.cardType}>Fine Foodie</span>
                    <br/>
                    <span className={s.cardPrice}>78.00</span>
                    <span className={s.cardPriceCurrency}>CHF</span>
                  </p>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </div>
    )
  }
}

const mapState = state => ({
  ...state.bundles,
})

const mapDispatch = {
  getBundles,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Bundles))
