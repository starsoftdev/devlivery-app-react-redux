import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Input, Pagination, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Bundles.css'
import {clear, getBundles, openBundleDetailsModal, removeBundle} from '../../reducers/bundles'
import PlusGiftIcon from '../../static/plus_round.svg'
import PlusIcon from '../../static/plus.svg'
import {BundleDetails, PaginationItem} from '../../components'
import debounce from 'lodash/debounce'
import messages from './messages'
import {CARD_IMAGES_PROP, DEFAULT_DEBOUNCE_TIME, GIFT_IMAGES_PROP} from '../../constants'
import {EDIT_BUNDLE_FLOW} from '../'
import {setBundle, setFlow, setSavedValue} from '../../reducers/purchase'
import RemoveIcon from '../../static/remove.svg'
import {getItemImage} from '../../utils'

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

    this.getBundles = debounce(this.props.getBundles, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  render() {
    const {search} = this.state
    // TODO add loading
    const {bundlesCount, bundles, page, pageSize, loading, getBundles, intl, setBundle, setFlow, setSavedValue, removeBundle, openBundleDetailsModal, bundleDetailsModalOpened} = this.props
    
    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
          <Input.Search
            className={s.search}
            placeholder={intl.formatMessage(messages.search)}
            value={search}
            onChange={this.changeSearch}
          />
          <Button type='primary' ghost onClick={() => {
            setFlow(EDIT_BUNDLE_FLOW)
            setSavedValue(1);
          }}>
            <PlusIcon/>
            {intl.formatMessage(messages.addBundle)}
          </Button>
        </div>
        <Row type='flex' gutter={20}>
          {bundles.map((bundle) =>
            <Col key={bundle.id} xs={24} md={12}>
              <div className={s.bundle}>
                <a className={s.removeBtn} onClick={() => removeBundle(bundle)}>
                  <RemoveIcon/>
                </a>
                <a className={s.bundleContent} onClick={() => openBundleDetailsModal(bundle)}>
                  <div className={s.cardWrapper}>
                    <div style={{backgroundImage: `url(${getItemImage(bundle.bundle_card.card, CARD_IMAGES_PROP)})`}} className={s.itemImage}/>
                    {bundle.bundle_gifts[0] && (
                      <PlusGiftIcon className={s.plusIcon}/>
                    )}
                  </div>
                  {bundle.bundle_gifts[0] && (
                    <div className={s.giftWrapper}>
                      <div style={{backgroundImage: `url(${getItemImage(bundle.bundle_gifts[0].gift, GIFT_IMAGES_PROP)})`}} className={s.itemImage}/>
                    </div>
                  )}
                </a>
                <div>
                  <div className={s.bundleActions}>
                    <div className={s.cardInfo}>
                      <a className={s.cardTitle} onClick={() => openBundleDetailsModal(bundle)}>{bundle.title}</a>
                      <br/>
                      <span className={s.cardPrice}>{bundle.total}</span>
                      <span className={s.cardPriceCurrency}>CHF</span>
                    </div>
                    <Button type='primary' ghost onClick={() => setBundle(bundle)}>
                      <PlusIcon/>
                      {intl.formatMessage(messages.makeOrder)}
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
            showTotal={(total, range) => intl.formatMessage(messages.tableItems, {
              range0: range[0],
              range1: range[1],
              total
            })}
            pageSize={pageSize}
            showSizeChanger
            onChange={(page, pageSize) => getBundles({page, pageSize})}
            onShowSizeChange={(page, pageSize) => getBundles({page, pageSize})}
            itemRender={(current, type, el) => <PaginationItem type={type} el={el}/>}
          />
        </div>
        {bundleDetailsModalOpened && <BundleDetails/>}
      </div>
    )
  }
}

const mapState = state => ({
  ...state.bundles,
})

const mapDispatch = {
  getBundles,
  setBundle,
  setFlow,
  removeBundle,
  openBundleDetailsModal,
  clear,
  setSavedValue
}

export default connect(mapState, mapDispatch)(withStyles(s)(Bundles))
