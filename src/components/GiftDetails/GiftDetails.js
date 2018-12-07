import React from 'react'
import { Carousel, Modal, Row, Col, Button } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './GiftDetails.css'
import PlusIcon from '../../static/plus.svg'
import messages from '../../routes/giftStore/messages';
import {GIFT_GALLERY_PROP,GIFT_IMAGES_PROP} from '../../constants'

class GiftDetails extends React.Component {
  render() {
    const { giftDetails, visible, setVisible, makeorder, intl, disableMakeOrder } = this.props
    let dataSource = [];
    if(giftDetails)
    {
      if(giftDetails[GIFT_GALLERY_PROP] && giftDetails[GIFT_GALLERY_PROP].length > 0)
        dataSource = giftDetails[GIFT_GALLERY_PROP];
      else dataSource = giftDetails[GIFT_IMAGES_PROP];
    }
    
    return giftDetails ? (
      <Modal
        className={s.DetailModal}
        title={<div className={s.modaltitle}>{giftDetails.title}</div>}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
      >
        <Row className={s.detailRow}>
          <Carousel
            loop
            customPaging={() => (
              <div className={s.dotWrapper}>
                <div className={s.dot} />
              </div>
            )}
          >
            {dataSource.map((image, i) => image.url ? (
              <div key={i}>
                <div style={{ backgroundImage: `url(${image.url})` }} className={s.previewImage} />
              </div>
            ) : null
            )}
          </Carousel>
        </Row>
        <Row className={s.detailRow}>
          <Col md={24}>
            <span className={s.DetailTitle}>{intl.formatMessage(messages.description)}</span><br />
            <span className={s.Detail}>{giftDetails.description}</span>
          </Col>
        </Row>
        <Row className={s.detailRow}>
          <Col md={8}>
            <span className={s.DetailTitle}>{intl.formatMessage(messages.price)}</span><br />
            <span className={s.Detail}>{giftDetails.currency+" "+giftDetails.price_with_tax}</span>
          </Col>
          <Col md={8}>
            <span className={s.DetailTitle}>{intl.formatMessage(messages.stock)}</span><br />
            <span className={s.Detail}>{giftDetails.stock && giftDetails.stock < 0 ? intl.formatMessage(messages.unlimited) : giftDetails.stock}</span>
          </Col>
          <Col md={8}>
            <span className={s.DetailTitle}>{intl.formatMessage(messages.SKU)}</span><br />
            <span className={s.Detail}>{giftDetails.sku}</span>
          </Col>
        </Row>
        {
          disableMakeOrder !== true &&
          <Row>
            <Button type='primary' size={'small'} style={{ float: 'right' }} ghost onClick={() => makeorder(giftDetails)}>
              <PlusIcon />
              {intl.formatMessage(messages.makeOrder)}
            </Button>
          </Row>
        }
      </Modal>
    ) : null
  }
}

export default withStyles(s)(GiftDetails)
