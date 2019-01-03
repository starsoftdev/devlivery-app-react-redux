import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './BundleDetails.css'
import {Modal} from 'antd'
import {connect} from 'react-redux'
import {closeBundleDetailsModal} from '../../reducers/bundles'
import {getItemImage} from '../../utils'
import {CARD_IMAGES_PROP, GIFT_IMAGES_PROP} from '../../constants'

class BundleDetails extends React.Component {
  render() {
    const {closeBundleDetailsModal, bundleDetails} = this.props
    return (
      <Modal
        visible
        title={bundleDetails.title}
        onOk={closeBundleDetailsModal}
        onCancel={closeBundleDetailsModal}
        width={500}
        footer={null}
      >
        <div style={{backgroundImage: `url(${getItemImage(bundleDetails.bundle_card.card, CARD_IMAGES_PROP)})`}} className={s.itemImage}/>
        <h3 className={s.cardTitle}>{bundleDetails.bundle_card.card.title}</h3>
        <p>
          <span className={s.currency}>CHF </span>
          <span className={s.price}>{bundleDetails.bundle_card.card.price_with_tax}</span>
          
        </p>
        {bundleDetails.bundle_gifts.map((bundleGift) =>
          <React.Fragment key={bundleGift.gift.id}>
            <div style={{backgroundImage: `url(${getItemImage(bundleGift.gift, GIFT_IMAGES_PROP)})`}} className={s.itemImage}/>
            <h3 className={s.giftTitle}>{bundleGift.gift.title}</h3>
            <p>
              <span className={s.currency}>CHF </span>
              <span className={s.price}>{bundleGift.gift.price_with_tax}</span>
            </p>
          </React.Fragment>
        )}
      </Modal>
    )
  }
}

const mapState = state => ({
  bundleDetails: state.bundles.bundleDetails,
})

const mapDispatch = {
  closeBundleDetailsModal,
}

export default connect(mapState, mapDispatch)(withStyles(s)(BundleDetails))
