import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './OrderItems.css'
import {CARD_IMAGES_PROP, GIFT_IMAGES_PROP} from '../../constants'
import {getItemImage} from '../../utils'
import PlusGiftIcon from '../../static/plus_round.svg'

class OrderItems extends React.Component {
  render() {
    const {voucher, donation, card, gift,giftcount} = this.props

    return (
      <div className={s.orderInfo}>
        <div className={s.cardWrapper}>
          <div
            style={{backgroundImage: `url(${getItemImage(card, CARD_IMAGES_PROP)})`}}
            className={s.itemImage}
          />
          {(gift || voucher || donation) && (
            <PlusGiftIcon className={s.plusIcon}/>
          )}
          <p className={s.cardInfo}>
            <span className={s.cardType}>{card.title}</span>
            <br/>
            <span className={s.cardPrice}>{card.price}</span>
            <span className={s.cardPriceCurrency}>{card.currency}</span>
          </p>
        </div>
        {gift && (
          <div className={s.cardWrapper}>
            <div
              style={{backgroundImage: `url(${getItemImage(gift, GIFT_IMAGES_PROP)})`}}
              className={s.itemImage}
            />
            <p className={s.cardInfo}>
              <span className={s.cardType}>{"GIFT ("+giftcount+")"}</span>
              <br/>
              <span className={s.cardPrice}>{gift.price}</span>
              <span className={s.cardPriceCurrency}>{gift.currency}</span>
            </p>
          </div>
        )}
        {voucher && (
          <div className={s.cardWrapper}>
            <div>
              <span className={s.cardType}>From: {voucher.from}</span><br/>
              <span className={s.cardType}>To: {voucher.to}</span>
            </div>
            <p className={s.cardInfo}>
              <span className={s.cardType}>{voucher.title}</span>
              <br/>
              <span className={s.cardPrice}>{voucher.price}</span>
              <span className={s.cardPriceCurrency}>{'CHF'}</span>
            </p>
          </div>
        )}
        {donation && (
          <div className={s.cardWrapper}>
            <div
              style={{backgroundImage: `url(${getItemImage(donation.organization, 'logo')})`}}
              className={s.itemImage}
            />
            <p className={s.cardInfo}>
              <span className={s.cardType}>{donation.organization.name}</span>
              <br/>
              <span className={s.cardPrice}>{donation.amount}</span>
              <span className={s.cardPriceCurrency}>{'CHF'}</span>
            </p>
          </div>
        )}
        {!gift && !voucher && !donation && (
          <div className={s.cardWrapper}>
            <div
              className={s.itemImage}
            />
            <p className={s.cardInfo}>
              <span className={s.cardType}></span>
              <br/>
              <span className={s.cardPrice}></span>
              <span className={s.cardPriceCurrency}></span>
            </p>
          </div>
        )}
      </div>
    )
  }
}

export default withStyles(s)(OrderItems)
