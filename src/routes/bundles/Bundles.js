import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Input, Pagination, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Bundles.css'
import {clear, getBundles} from '../../reducers/bundles'
import PlusGiftIcon from '../../static/plus_round.svg'
import PlusIcon from '../../static/plus.svg'
import {PaginationItem} from '../../components'
import debounce from 'lodash/debounce'

// TODO add Create Bundle
// TODO add Make an Order
class Bundles extends React.Component {
  changeSearch = (e) => {
    const search = e.target.value
    this.setState({search})
    this.getBundles({search})
  }

  constructor(props) {
    super(props)

    this.state = {
      search: undefined,
    }

    this.getBundles = debounce(this.props.getBundles, 800)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  render() {
    const {search} = this.state
    // TODO add loading
    const {bundlesCount, bundles, page, pageSize, loading, getBundles} = this.props

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>Created Bundles</h1>
          {/*TODO add search icon*/}
          <Input
            className={s.search}
            placeholder={'Search'}
            value={search}
            onChange={this.changeSearch}
          />
          <Button type='primary' ghost>
            <PlusIcon/>
            Create Bundle
          </Button>
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
                      <span className={s.cardTitle}>{bundle.title}</span>
                      <br/>
                      <span className={s.cardPrice}>{bundle.total}</span>
                      <span className={s.cardPriceCurrency}>CHF</span>
                    </div>
                    <Button type='primary' ghost>
                      <PlusIcon/>
                      Make an Order
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>
        <div className={s.footer}>
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
