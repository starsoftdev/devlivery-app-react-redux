import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './OrderItems.css'
import { CARD_IMAGES_PROP, GIFT_IMAGES_PROP } from '../../constants'
import { getItemImage } from '../../utils'
import PlusGiftIcon from '../../static/plus_round.svg'
import RemoveIcon from '../../static/remove.svg'
import LeftIcon from '../../static/left-arrow.svg'
import RightIcon from '../../static/right-arrow.svg'
import { Popconfirm } from 'antd'
import messages from './messages'
import cn from 'classnames';

class OrderItems extends React.Component {
  state = {
    giftIndex: 0
  }
  onclickLeft() {
    const {giftIndex} = this.state;
    const {gifts} = this.props;
    this.setState({giftIndex: giftIndex > 0 ? (giftIndex-1):(gifts.length-1)});
  }
  onclickRight() {
    const {giftIndex} = this.state;
    const {gifts} = this.props;
    this.setState({giftIndex: giftIndex < (gifts.length-1) ? (giftIndex+1):0});
  }
  wraptext(str){
    if(str === null || str === undefined)
      return '';
    var maxlen = 20;
    if(this.props.voucher)
      maxlen -= 6;
    if(this.props.donation)
      maxlen -= 6;

    if(str.length > maxlen)
    {
      return str.substr(0,maxlen)+"...";
    }
    return str;
  }
  removeGiftFromBundle(){
    const {gifts} = this.props;
    const {giftIndex} = this.state;
    var gift = null;
    if(gifts.length > 0 && gifts[giftIndex])
    {
      gift = gifts[giftIndex].gift;
    }
    if(gift)
    {
      var filter = gifts.filter(item => item.gift.id !== gift.id).map(item => item.gift.id);
      this.setState({giftIndex:0});
      this.props.syncGifts_Bundle(filter);
    }
  }
  render() {
    const { intl, voucher, donation, card, gifts, removeDontationFromBundle, removeVoucherFromBundle,syncGifts_Bundle } = this.props
    const {giftIndex} = this.state;
    var gift = null;
    if(gifts.length > 0 && gifts[giftIndex])
    {
      gift = gifts[giftIndex].gift;
    }
    
    return (
      <div className={s.container}>
      <div className={cn(s.orderInfo, !gift && !voucher && !donation && s.singleInfo)}>
        <div className={s.cardWrapper}>
          <div
            style={{ backgroundImage: `url(${getItemImage(card, CARD_IMAGES_PROP)})` }}
            className={s.itemImage}
          />
          {(gift || voucher || donation) && (
            <PlusGiftIcon className={s.plusIcon} />
          )}
          <p className={s.cardInfo}>
            <span className={s.cardType}>{card.title}</span>
            <br />
            <span className={s.cardPriceCurrency}>{card.currency}</span>
            <span className={s.cardPrice}>{card.price_with_tax}</span>
          </p>
        </div>
        {gift && (
          <div className={s.cardWrapper}>
            <Popconfirm
              title={intl.formatMessage(messages.confirmRemoving)}
              onConfirm={() => {this.removeGiftFromBundle()}}
              okText={intl.formatMessage(messages.acceptRemoving)}
            >
              <a className={s.removeIcon}>
                <RemoveIcon />
              </a>
            </Popconfirm>
            <div
              style={{ backgroundImage: `url(${getItemImage(gift, GIFT_IMAGES_PROP)})` }}
              className={s.itemImage}
            />
            <div className={s.giftTitle}>
              <div className={s.giftTitleInner}>
                {
                  gifts.length > 0 &&
                  <a className={s.leftIcon} onClick={()=>this.onclickLeft()}>
                    <LeftIcon />
                  </a>
                }
                <p className={s.giftTitleContent}>
                  <span className={s.cardType}>{this.wraptext(gift.title)}</span>
                  <br />
                  <span className={s.cardType}>{"(" +(giftIndex+1)+"/"+gifts.length + ")"}</span>
                  <br />
                  <span className={s.cardPriceCurrency}>{gift.currency}</span>
                  <span className={s.cardPrice}>{gift.price_with_tax}</span>
                </p>
                {
                  gifts.length > 0 &&
                  <a className={s.rightIcon} onClick={()=>this.onclickRight()}>
                    <RightIcon />
                  </a>
                }
              </div>
            </div>
          </div>
        )}
        {voucher && (
          <div className={s.cardWrapper}>
            <Popconfirm
              title={intl.formatMessage(messages.confirmRemoving)}
              onConfirm={() => removeVoucherFromBundle()}
              okText={intl.formatMessage(messages.acceptRemoving)}
            >
              <a className={s.removeIcon}>
                <RemoveIcon />
              </a>
            </Popconfirm>
            <div>
              <span className={s.cardType}>{intl.formatMessage(messages.giver)} :{voucher.from}</span><br />
              {
                voucher.to &&
                <span className={s.cardType}>{intl.formatMessage(messages.receiver)} {voucher.to}</span>
              }
            </div>
            <p className={s.cardInfo}>
              <span className={s.cardType}>{voucher.title}</span>
              <br />
              <span className={s.cardPriceCurrency}>{'CHF'}</span>
              <span className={s.cardPrice}>{voucher.price_with_tax}</span>
            </p>
          </div>
        )}
        {donation && (
          <div className={s.cardWrapper}>
            <Popconfirm
              title={intl.formatMessage(messages.confirmRemoving)}
              onConfirm={() => removeDontationFromBundle()}
              okText={intl.formatMessage(messages.acceptRemoving)}
            >
              <a className={s.removeIcon}>
                <RemoveIcon />
              </a>
            </Popconfirm>

            <div
              style={{ backgroundImage: `url(${getItemImage(donation.organization, 'logo')})`, backgroundSize:'contain' }}
              className={s.itemImage}
            />
            <p className={s.cardInfo}>
              <span className={s.cardType}>{donation.organization.name}</span>
              <br />
              <span className={s.cardPriceCurrency}>{'CHF'}</span>
              <span className={s.cardPrice}>{donation.amount}</span>
              
            </p>
          </div>
        )}
        {/*
          !gift && !voucher && !donation && (
          <div className={s.cardWrapper}>
            <div
              className={s.itemImage}
            />
            <p className={s.cardInfo}>
              <span className={s.cardType}></span>
              <br />
              <span className={s.cardPriceCurrency}></span>
              <span className={s.cardPrice}></span>
            </p>
          </div>
        )*/
        }
      </div>
      </div>
    )
  }
}

export default withStyles(s)(OrderItems)
