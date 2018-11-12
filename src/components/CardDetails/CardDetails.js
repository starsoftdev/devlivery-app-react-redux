import React from 'react'
import { Carousel, Modal,Row,Col,Button } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './CardDetails.css'
import PlusIcon from '../../static/plus.svg'
import messages from '../../routes/cardStore/messages';

class CardDetails extends React.Component {
  render() {
    const { cardDetails,visible,setVisible,makeorder,intl,occasionTitle } = this.props
    
    return cardDetails ? (
      <Modal
        className={s.DetailModal}
        title={<div className={s.modaltitle}>{cardDetails.title}</div>}
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
            {[...cardDetails.front_image, ...cardDetails.images].map((image, i) => image.url ? (
              <div key={i}>
                <div style={{ backgroundImage: `url(${image.url})` }} className={s.previewImage} />
              </div>
            ) : null
            )}
          </Carousel>
        </Row>
        <Row className={s.detailRow}>
          <Col md={12}>
            <span className={s.DetailTitle}>{intl.formatMessage(messages.style)}</span><br />
            <span className={s.Detail}>{cardDetails.style}</span>
          </Col>
          <Col md={12}>
            <span className={s.DetailTitle}>{intl.formatMessage(messages.occasion)}</span><br />
            <span className={s.Detail}>{occasionTitle}</span>
          </Col>
        </Row>
        <Row className={s.detailRow}>
          <Col md={12}>
            <span className={s.DetailTitle}>{intl.formatMessage(messages.size)}</span><br />
            <span className={s.Detail}>{cardDetails.size}</span>
          </Col>
          <Col md={12}>
            <span className={s.DetailTitle}>{intl.formatMessage(messages.price)}</span><br />
            <span className={s.Detail}>{cardDetails.price_with_tax + " " + cardDetails.currency}</span>
          </Col>
        </Row>

        <Row>
          <Button type='primary' size={'small'} style={{ float: 'right' }} ghost onClick={() => makeorder(cardDetails)}>
            <PlusIcon />
            {intl.formatMessage(messages.makeOrder)}
          </Button>
        </Row>
      </Modal>
    ) : null
  }
}

export default withStyles(s)(CardDetails)
