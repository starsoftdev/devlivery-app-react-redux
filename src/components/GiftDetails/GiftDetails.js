import React from 'react'
import { Carousel, Modal, Row, Col, Button } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './GiftDetails.css'
import PlusIcon from '../../static/plus.svg'
import messages from '../../routes/giftStore/messages';
import {GIFT_GALLERY_PROP} from '../../constants'

class GiftDetails extends React.Component {
  render() {
    const { giftDetails, visible, setVisible, makeorder, intl } = this.props

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
            {giftDetails[GIFT_GALLERY_PROP].map((image, i) => image.url ? (
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
          <Col md={12}>
            <span className={s.DetailTitle}>{intl.formatMessage(messages.price)}</span><br />
            <span className={s.Detail}>{giftDetails.price_with_tax + " " + giftDetails.currency}</span>
          </Col>
        </Row>

        <Row>
          <Button type='primary' size={'small'} style={{ float: 'right' }} ghost onClick={() => makeorder(giftDetails)}>
            <PlusIcon />
            {intl.formatMessage(messages.makeOrder)}
          </Button>
        </Row>
      </Modal>
    ) : null
  }
}

export default withStyles(s)(GiftDetails)
