import React from 'react'
import {connect} from 'react-redux'
import {setGift, submitGift} from '../../reducers/purchase'
import {Button, Col, Layout, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase8.css'
import {Actions, Card, Link, SectionHeader} from '../../components'
import Gift1Image from '../../static/gift1.png'
import Gift2Image from '../../static/gift2.png'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {HOME_ROUTE} from '../'
import Logo from '../../static/logo.svg'
import cn from 'classnames'
import Preview from './Preview'
import messages from './messages'

const CARD_STYLES = [
  {key: 'gift1', title: 'Rich Foodie', price: '95.00', currency: 'CHF', image: Gift1Image},
  {key: 'gift2', title: 'Fine Foodie', price: '78.00', currency: 'CHF', image: Gift2Image},
  {key: 'gift3', title: 'Rich Foodie', price: '70.00', currency: 'CHF', image: Gift1Image},
  {key: 'gift4', title: 'Christmas Basket', price: '95.00', currency: 'CHF', image: Gift2Image},
]

class Purchase8 extends React.Component {
  state = {
    previewCollapsed: false,
  }

  onPreviewCollapse = (previewCollapsed) => {
    this.setState({previewCollapsed})
  }

  render() {
    const {previewCollapsed} = this.state
    const {gift, setGift, submitGift, intl} = this.props

    return (
      <React.Fragment>
        <div className={s.container}>
          {previewCollapsed && (
            <Button
              type='primary'
              className={s.previewBtn}
              onClick={() => this.onPreviewCollapse(false)}
            >
              Preview
            </Button>
          )}
          <Layout.Content className={cn(s.contentWrapper, !previewCollapsed && s.withPreview)}>
            <div className={s.layoutHeader}>
              <Link to={HOME_ROUTE}>
                <Logo/>
              </Link>
            </div>
            <div className={s.content}>
              <SectionHeader
                header={intl.formatMessage(messages.header)}
                number={8}
                prefixClassName={s.headerPrefix}
              />
              <Row className={s.items} gutter={20} type='flex' align='center'>
                {CARD_STYLES.map((item) =>
                  <Col key={item.key} className={s.itemWrapper}>
                    <Card
                      className={s.item}
                      image={item.image}
                      title={
                        <React.Fragment>
                          {item.title}
                          <br/>
                          <span className={s.price}>
                            {item.price}
                            <span className={s.currency}>{item.currency}</span>
                          </span>
                        </React.Fragment>
                      }
                      onClick={() => setGift(item.key)}
                      active={item.key === gift}
                    />
                  </Col>
                )}
              </Row>
            </div>
          </Layout.Content>
          <Preview onCollapse={this.onPreviewCollapse} collapsed={previewCollapsed}/>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={submitGift}
          />
          <Button
            type='primary'
            disabled={!gift}
            onClick={submitGift}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  gift: state.purchase.gift,
  loading: state.purchase.loading,
})

const mapDispatch = {
  setGift,
  submitGift,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase8))
