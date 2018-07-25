import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './OrderDetails.css'
import {Modal, List, Row, Col, Avatar} from 'antd'
import {connect} from 'react-redux'
import {closeOrderDetailsModal} from '../../reducers/orders'

class OrderDetails extends React.Component {

  render() {

    const {closeOrderDetailsModal, orderData} = this.props

    if(orderData != undefined){
      var completed_at = orderData.completed_at;
      var order_number = orderData.order_number;
      var payment_method = orderData.payment_method? orderData.payment_method: 'N/A';
      var status = orderData.status;
      var total_price = orderData.total;
      var gifts = orderData.items.gifts;
    }

    return (
      <Modal
        visible
        title={`Order Details / #` + order_number}
        onOk={ closeOrderDetailsModal}
        onCancel={ closeOrderDetailsModal}
        width={850}
        footer={null}
      >
        <Row >
          <Col span={17}>
            <List
              header={
                <div style={{display: 'inline-flex', marginBottom: 5, padding: 5, background: 'lightgray'}}>
                  <div style={{paddingLeft: 30}}>Product</div>
                  <div style={{paddingLeft: 235}}>Quantity</div>
                  <div style={{paddingLeft: 80, paddingRight: 30}}>Price</div>
                </div>
              }
              itemLayout="horizontal"
              dataSource={gifts}
              renderItem={item => (
                <List.Item style={{display: 'inline-flex', width: 500, marginTop: 10}}>
                  <List.Item.Meta style={{display: 'inline-flex', width: 300}}
                    avatar={<Avatar src={ item.gift.image[0].url} />}
                    title={item.gift.title}
                    description={item.gift.description}
                  />
                  <div style={{display: 'inline-flex', paddingLeft: 25}}>
                    <div style={{paddingLeft: 10, paddingTop: 30}} >{item.quantity}</div>
                    <div style={{paddingLeft: 80, paddingTop: 30}} >{item.gift.price + ' CHF'}</div>
                  </div>
                </List.Item>
              )}
            />
          </Col>
          <Col span={6}>
            <List
              header={
                <div style={{display: 'inline-flex', marginBottom: 5, padding: 5, background: 'lightgray', paddingRight: 70}}>
                  <div style={{paddingLeft: 30}}>Order Summary</div>
                </div>
              }
              style={{ background: '#f8f8f8'}}
              itemLayout="horizontal"
              dataSource={gifts}
              renderItem={item => (
                <List.Item style={{display: 'inline-flex', width: 200}}>
                  <div style={{display: 'inline-flex', paddingLeft: 5}}>
                    <div style={{paddingLeft: 5,  paddingTop: 15}} >{'Completed Date'}</div>
                    <div style={{paddingLeft: 20, paddingTop: 15}} >{ completed_at}</div>
                  </div>
                  <div style={{display: 'inline-flex', paddingLeft: 5}}>
                    <div style={{paddingLeft: 5,  paddingTop: 15}} >{'Status'}</div>
                    <div style={{paddingLeft: 85, paddingTop: 15}} >{ status}</div>
                  </div>
                  <div style={{display: 'inline-flex', paddingLeft: 5}}>
                    <div style={{paddingLeft: 5,  paddingTop: 15}} >{'Payment method'}</div>
                    <div style={{paddingLeft: 20, paddingTop: 15}} >{ payment_method}</div>
                  </div>
                  <div style={{display: 'inline-flex', paddingLeft: 5}}>
                    <div style={{paddingLeft: 5,  paddingTop: 15}} >{'TOTAL'}</div>
                    <div style={{paddingLeft: 65, paddingTop: 15}} >{ total_price + ' CHF'}</div>
                  </div>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Modal>
    )
  }
}

const mapState = state => ({
  selectedOrder: state.orders.selectedOrder,
  orderData: state.orders.orderDataById,
})

const mapDispatch = {
  closeOrderDetailsModal,
}

export default connect(mapState, mapDispatch)(withStyles(s)(OrderDetails))
