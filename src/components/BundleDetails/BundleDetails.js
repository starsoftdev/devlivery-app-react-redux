import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './BundleDetails.css'
import {Modal} from 'antd'
import {connect} from 'react-redux'
import {closeBundleDetailsModal} from '../../reducers/bundles'

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
        <div>
          <img src={bundleDetails.bundle_card.card.images[0].url} className={s.cardImage}/>
        </div>
        <h3 className={s.cardTitle}>{bundleDetails.bundle_card.card.title}</h3>
        <p>
          <span className={s.price}>{bundleDetails.bundle_card.card.price}</span>
          <span className={s.currency}>CHF</span>
        </p>
        {bundleDetails.bundle_gifts.map((bundleGift) =>
          <React.Fragment key={bundleGift.id}>
            <div>
              <img src={bundleGift.gift.image[0].url} className={s.giftImage}/>
            </div>
            <h3 className={s.giftTitle}>{bundleGift.gift.title}</h3>
            <p>
              <span className={s.price}>{bundleGift.gift.price}</span>
              <span className={s.currency}>CHF</span>
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
