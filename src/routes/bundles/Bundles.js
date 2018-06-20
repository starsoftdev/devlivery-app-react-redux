import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Input, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Bundles.css'
import {clear, getBundles} from '../../reducers/bundles'
import PlusGiftIcon from '../../static/plus_round.svg'
import PlusIcon from '../../static/plus.svg'

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
            <Col key={bundle.id} xs={24} md={12}>
              <div className={s.bundle}>
                <div className={s.bundleContent}>
                  <div className={s.cardWrapper}>
                    <div>
                      <img src={bundle.bundle_card.card.images[0].url} className={s.cardImage}/>
                    </div>
                    <PlusGiftIcon className={s.plusIcon}/>
                  </div>
                  <div className={s.giftWrapper}>
                    <div>
                      <img src={bundle.bundle_gifts[0].gift.image[0].url} className={s.giftImage}/>
                    </div>
                  </div>
                </div>
                <div>
                  <div className={s.bundleActions}>
                    <p className={s.cardInfo}>
                      <span className={s.cardTitle}>{bundle.bundle_card.card.title}</span>
                      <br/>
                      <span className={s.cardPrice}>{bundle.bundle_card.card.price}</span>
                      <span className={s.cardPriceCurrency}>{bundle.bundle_card.card.currency}</span>
                    </p>
                    <Button type='primary' ghost>
                      <PlusIcon/>
                      Make an order
                    </Button>
                  </div>
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
