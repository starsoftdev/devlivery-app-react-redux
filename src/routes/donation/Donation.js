import React from 'react'
import { connect } from 'react-redux'
import { submitDonation, setDonationOrg,getDonationOrgs } from '../../reducers/purchase'
import { Button, Col, Form, Input, Row, Checkbox, Pagination, message } from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Donation.css'
import { Actions, Card, PurchaseActions, SectionHeader,PaginationItem } from '../../components'
import { ALPHABET } from '../../constants'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import messages from './messages'
import formMessages from '../../formMessages'
import { FloatingLabel } from '../../components';
const DONATION_STATE = 'donation_state'
class Donation extends React.Component {
  state = {
    donationOrg: null,
    amountValue: '',
    hideAmount: false
  }
  constructor(props){
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit = (e,refresh=false) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err && this.state.donationOrg) {
        if(values['donationAmount'] < 0)
        {
          this.props.form.setFields({
            donationAmount: {
              value: values['donationAmount'],
              errors: [new Error('This field must be positive.')],
            },
          });
          return;
        }
        if(values['donationAmount'] == 0)
        {
          this.props.form.setFields({
            donationAmount: {
              value: values['donationAmount'],
              errors: [new Error('Sorry, but donation needs to be bigger than 0')],
            },
          });
          return;
        }
        this.props.setDonationOrg(this.state.donationOrg);
        localStorage.setItem(DONATION_STATE, JSON.stringify(values));
        this.props.submitDonation(values,refresh)
      } else {
        this.props.setDonationOrg(null);
        localStorage.removeItem(DONATION_STATE);
        this.props.submitDonation(null,refresh)
      }
    })
  }
  componentWillMount() {
    this.loadLocalStorage();
  }
  async loadLocalStorage() {
    var initState = await localStorage.getItem(DONATION_STATE);
    initState = JSON.parse(initState);
    this.setState({ ...initState, donationOrg: this.props.donationOrg});
  }
  render() {
    const { setDonationOrg, donationOrgs, intl, flowIndex, loading, donationAmount, hideAmount, doCount, doPage, doPageSize, getDonationOrgs } = this.props
    const { getFieldDecorator } = this.props.form
    const { donationOrg } = this.state;
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
                    onClick={() => {
                      if(donationOrg && donationOrg.id === item.id)
                      {
                        this.setState({donationOrg:null})
                      }
                      else this.setState({donationOrg:item})}
                    }
                    bordered={false}
                    description={item.description}
                    active={donationOrg && donationOrg.id === item.id}
                    keyValue={ALPHABET[i]}
                    imageStyle = {{backgroundSize:'contain'}}
                  />
                </Col>
              )}
            </Row>
          ) : !loading.donationOrgs ? (
            <div style={{ textAlign: 'center' }}>{'No organizations.'}</div>
          ) : null}
          <div className={s.footer}>
            <Pagination
              hideOnSinglePage
              current={doPage}
              total={doCount}
              pageSize={doPageSize}
              onChange={(current) => getDonationOrgs({pagination: {current}})}
              itemRender={(current, type, el) => <PaginationItem type={type} el={el}/>}
            />
          </div>
          <Form>
            <Form.Item className={s.amount}>
              {getFieldDecorator('donationAmount', {
                initialValue: donationAmount,
                rules: [
                  { required: true, message: 'Sorry, you must select a donation amount.' },
                ],
              })(
                <Input type='number' placeholder={intl.formatMessage(messages.amount)} />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('hideAmount', {
                initialValue: hideAmount,
                valuePropName: 'checked',
              })(
                <Checkbox>{intl.formatMessage(messages.hideamount)}</Checkbox>
              )}
            </Form.Item>
          </Form>
        </div>
        <PurchaseActions>
          <Button
            type='primary'
            onClick={(e)=>this.handleSubmit(e,true)}
          >
            {'SAVE AND BUY MORE PRODUCTS'}
          </Button>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={(e)=>this.handleSubmit(e)}
          />
          <Button
            type='primary'
            disabled={!donationOrg}
            onClick={(e)=>this.handleSubmit(e)}
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
  doPage: state.purchase.doPage,
  doPageSize: state.purchase.doPageSize,
  doCount: state.purchase.doCount
})

const mapDispatch = {
  setDonationOrg,
  submitDonation,
  getDonationOrgs
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(Donation)))
