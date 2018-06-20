import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Input, Row, Pagination} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Bundles.css'
import {clear, getBundles} from '../../reducers/bundles'
import PlusGiftIcon from '../../static/plus_round.svg'
import PlusIcon from '../../static/plus.svg'
import {PaginationItem} from '../../components'

class Bundles extends React.Component {
  render() {
    // TODO add loading
    const {bundlesCount, bundles, page, pageSize, loading, getBundles} = this.props

    return (
      <div className={s.container}>
        <div className={s.headerWrapper}>
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
                    <div className={s.cardInfo}>
                      <span className={s.cardTitle}>{bundle.bundle_card.card.title}</span>
                      <br/>
                      <span className={s.cardPrice}>{bundle.bundle_card.card.price}</span>
                      <span className={s.cardPriceCurrency}>{bundle.bundle_card.card.currency}</span>
                    </div>
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
        <div className={s.actions}>
          <Pagination
            current={page}
            total={bundlesCount}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            pageSize={pageSize}
            showSizeChanger
            onChange={(page, pageSize) => getBundles({page, pageSize})}
            onShowSizeChange={(page, pageSize) => getBundles({page, pageSize})}
            itemRender={(current, type, el) => <PaginationItem type={type} el={el}/>}
          />
        </div>
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
