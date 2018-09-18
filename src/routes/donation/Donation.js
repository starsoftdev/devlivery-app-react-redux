import React from 'react'
import {connect} from 'react-redux'
import {submitDonation, setDonationOrg} from '../../reducers/purchase'
import {Button, Col, Form, Input, Row, Checkbox} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Donation.css'
import {Actions, Card, PurchaseActions, SectionHeader} from '../../components'
import {ALPHABET} from '../../constants'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'
import formMessages from '../../formMessages'
import {FloatingLabel} from '../../components';

class Donation extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err && this.props.donationOrg) {
        this.props.submitDonation(values)
      }
    })
  }

  render() {
    const {donationOrg, setDonationOrg, donationOrgs, intl, flowIndex, loading, donationAmount, hideAmount} = this.props
    const {getFieldDecorator} = this.props.form
    // TODO make amount input as InputNumber field
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <p>{intl.formatMessage(messages.description)}</p>
          {donationOrgs.length ? (
            <Row className={s.items} gutter={20} type='flex' align='center'>
              {donationOrgs.map((item, i) =>
                <Col key={item.id} className={s.itemWrapper} xs={8}>
                  <Card
                    //className={s.item}
                    title={item.name}
                    item={item}
                    imagesProp={'logo'}
                    onClick={() => setDonationOrg(item)}
                    bordered={false}
                    description={item.description}
                    active={donationOrg && donationOrg.id === item.id}
                    keyValue={ALPHABET[i]}
                  />
                </Col>
              )}
            </Row>
          ) : !loading.donationOrgs ? (
            <div style={{textAlign: 'center'}}>{'No organizations.'}</div>
          ) : null}
          <Form>
            <Form.Item className={s.amount}>
              {getFieldDecorator('donationAmount', {
                initialValue: donationAmount,
                rules: [
                  {required: true, message: intl.formatMessage(formMessages.required)},
                ],
              })(
                <FloatingLabel placeholder={intl.formatMessage(messages.amount)}/>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('hideAmount', {
                initialValue: hideAmount,
              })(
                <Checkbox>{'Hide amount'}</Checkbox>
              )}
            </Form.Item>
          </Form>
        </div>
        <PurchaseActions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={this.handleSubmit}
          />
          <Button
            type='primary'
            disabled={!donationOrg}
            onClick={this.handleSubmit}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </PurchaseActions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  donationOrgs: state.purchase.donationOrgs,
  donationOrg: state.purchase.donationOrg,
  donationAmount: state.purchase.donationAmount,
  hideAmount: state.purchase.hideAmount,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  setDonationOrg,
  submitDonation,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Donation)))
