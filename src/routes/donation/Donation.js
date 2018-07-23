import React from 'react'
import {connect} from 'react-redux'
import {submitDonation, setDonationOrg} from '../../reducers/purchase'
import {Button, Col, Input, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Donation.css'
import {Actions, Card, SectionHeader} from '../../components'
import {ALPHABET} from '../../constants'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'

class Donation extends React.Component {
  render() {
    const {donationOrg, setDonationOrg, donationOrgs, intl, flowIndex, submitDonation, loading} = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          />
          <p>{intl.formatMessage(messages.description)}</p>
          {!!donationOrgs.length ? (
            <Row className={s.items} gutter={20} type='flex' align='center'>
              {donationOrgs.map((item, i) =>
                <Col key={item.id} className={s.itemWrapper}>
                  <Card
                    className={s.item}
                    title={item.name}
                    image={item.logo && item.logo[0] && item.logo[0].url}
                    onClick={() => setDonationOrg(item.id)}
                    active={item.id === donationOrg}
                    keyValue={ALPHABET[i]}
                  />
                </Col>
              )}
            </Row>
          ) : !loading.donationOrgs ? (
            <div style={{textAlign: 'center'}}>No organizations.</div>
          ) : null}
          <Input placeholder={intl.formatMessage(messages.amount)} className={s.amount}/>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => donationOrg && submitDonation()}
          />
          <Button
            type='primary'
            disabled={!donationOrg}
            onClick={() => submitDonation()}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  donationOrgs: state.purchase.donationOrgs,
  donationOrg: state.purchase.donationOrg,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  setDonationOrg,
  submitDonation,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Donation))
