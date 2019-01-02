import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Input, Pagination, Row, Popconfirm } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Bundles.css'
import { clear, getBundles, openBundleDetailsModal, removeBundle } from '../../reducers/bundles'
import PlusGiftIcon from '../../static/plus_round.svg'
import PlusIcon from '../../static/plus.svg'
import { BundleDetails, PaginationItem } from '../../components'
import debounce from 'lodash/debounce'
import messages from './messages'
import { CARD_IMAGES_PROP, DEFAULT_DEBOUNCE_TIME, GIFT_IMAGES_PROP } from '../../constants'
import { EDIT_BUNDLE_FLOW } from '../'
import { setBundle, setFlow, setSavedValue } from '../../reducers/purchase'
import RemoveIcon from '../../static/remove.svg'
import { getItemImage } from '../../utils'
import LeftIcon from '../../static/left-arrow.svg'
import RightIcon from '../../static/right-arrow.svg'

const pageSizeOptions = ['4','8','12','16'];
class BundleItem extends React.Component {
  state = {
    giftIndex: 0
  }
  onclickLeft(e) {
    e.stopPropagation();
    const {giftIndex} = this.state;
    const gifts = this.props.bundle.bundle_gifts;
    this.setState({giftIndex: giftIndex > 0 ? (giftIndex-1):(gifts.length-1)});
  }
  onclickRight(e) {
    e.stopPropagation();
    const {giftIndex} = this.state;
    const gifts = this.props.bundle.bundle_gifts;
    this.setState({giftIndex: giftIndex < (gifts.length-1) ? (giftIndex+1):0});
  }
  render() {
    const {bundle,intl,openBundleDetailsModal,removeBundle,setBundle} = this.props;
    return (
      <Col xs={24} md={12}>
        <div className={s.bundle}>
          <Popconfirm
            title={intl.formatMessage(messages.confirmRemoving)}
            onConfirm={() => removeBundle(bundle)}
            okText={intl.formatMessage(messages.acceptRemoving)}
          >
            <a className={s.removeBtn} >
              <RemoveIcon />
            </a>
          </Popconfirm>
          <div className={s.bundleContent} onClick={() => openBundleDetailsModal(bundle)}>
            <div className={s.cardWrapper}>
              <div style={{ backgroundImage: `url(${getItemImage(bundle.bundle_card.card, CARD_IMAGES_PROP)})` }} className={s.itemImage} />
              {bundle.bundle_gifts[0] && (
                <PlusGiftIcon className={s.plusIcon} />
              )}
            </div>
            {bundle.bundle_gifts[this.state.giftIndex] && (
              <div className={s.giftWrapper}>
                <div style={{ backgroundImage: `url(${getItemImage(bundle.bundle_gifts[this.state.giftIndex].gift, GIFT_IMAGES_PROP)})` }} className={s.itemImage} />
                {
                  bundle.bundle_gifts && bundle.bundle_gifts.length > 1 &&
                  <div className={s.buttonBar}>
                    <div className={s.leftIcon} onClick={(e)=>this.onclickLeft(e)}>
                      <LeftIcon />
                    </div>
                    <div className={s.rightIcon} onClick={(e)=>this.onclickRight(e)}>
                      <RightIcon />
                    </div>
                  </div>
                }
              </div>
            )}
            {bundle.voucher && (
              <div className={s.cardWrapper}>
                <div>
                  <span className={s.cardType}>{intl.formatMessage(messages.giver)}: {bundle.voucher.from}</span><br />
                  <span className={s.cardType}>{intl.formatMessage(messages.receiver)}: {bundle.voucher.to}</span>
                </div>
              </div>
            )}
            {bundle.donation && (
              <div className={s.cardWrapper}>
                <div
                  style={{ backgroundImage: `url(${getItemImage(bundle.donation.organization, 'logo')})`, backgroundSize:'contain' }}
                  className={s.itemImage}
                />
              </div>
            )}
          </div>
          <div>
            <div className={s.bundleActions}>
              <div className={s.cardInfo}>
                <a className={s.cardTitle} onClick={() => openBundleDetailsModal(bundle)}>{bundle.title}</a>
                <br />
                <span className={s.cardPriceCurrency}>CHF</span>
                <span className={s.cardPrice}>{bundle.total}</span>
              </div>
              <Button type='primary' ghost onClick={() => setBundle(bundle)}>
                <PlusIcon />
                {intl.formatMessage(messages.makeOrder)}
              </Button>
            </div>
          </div>
        </div>
      </Col>
    );
  }
}
class Bundles extends React.Component {
  changeSearch = (e) => {
    const search = e.target.value
    this.setState({ search })
    this.getBundles({ search })
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
    const { search } = this.state
    // TODO add loading
    const { bundlesCount, bundles, page, pageSize, loading, getBundles, intl, setBundle, setFlow, setSavedValue, removeBundle, openBundleDetailsModal, bundleDetailsModalOpened } = this.props

    return (
      <div className={s.container}>
        <div className={s.actions}>
          <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
          <Input.Search
            className={intl.locale === 'de-DE' ? s.search_de : s.search}
            placeholder={intl.formatMessage(messages.search)}
            value={search}
            onChange={this.changeSearch}
          />
          <Button className={s.createbundlebtn} type='primary' ghost onClick={() => {
            setFlow(EDIT_BUNDLE_FLOW)
            setSavedValue(1);
          }}>
            <PlusIcon />
            {intl.formatMessage(messages.addBundle)}
          </Button>
        </div>
        <Row type='flex' gutter={20}>
          {bundles.map((bundle) =>
            <BundleItem 
              key={bundle.id}
              bundle = {bundle}
              intl = {intl}
              openBundleDetailsModal = {openBundleDetailsModal}
              removeBundle = {removeBundle}
              setBundle = {setBundle}
              />
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
            onChange={(page, pageSize) => getBundles({ page, pageSize })}
            onShowSizeChange={(page, pageSize) => getBundles({ page, pageSize })}
            itemRender={(current, type, el) => <PaginationItem type={type} el={el} />}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
        {bundleDetailsModalOpened && <BundleDetails />}
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
