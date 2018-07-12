import React from 'react'
import {connect} from 'react-redux'
import {nextFlowStep, setGift} from '../../reducers/purchase'
import {Button, Col, Layout, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase8.css'
import {Actions, Card, Header, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import cn from 'classnames'
import Preview from './Preview'
import messages from './messages'

class Purchase8 extends React.Component {
  state = {
    previewCollapsed: false,
  }

  onPreviewCollapse = (previewCollapsed) => {
    this.setState({previewCollapsed})
  }

  render() {
    const {previewCollapsed} = this.state
    const {gift, setGift, nextFlowStep, intl, flowIndex, gifts} = this.props

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
            <Header className={s.layoutHeader}/>
            <div className={s.content}>
              <SectionHeader
                header={intl.formatMessage(messages.header)}
                number={flowIndex + 1}
                prefixClassName={s.headerPrefix}
              />
              <Row className={s.items} gutter={20} type='flex' align='center'>
                {gifts.map((item) =>
                  <Col key={item.id} className={s.itemWrapper}>
                    <Card
                      className={s.item}
                      image={item.image[0].url}
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
                      bordered={false}
                      description={item.description}
                      onClick={() => setGift(item.id)}
                      active={item.id === gift}
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
            onKeyHandle={gift && nextFlowStep}
          />
          <Button
            type='primary'
            disabled={!gift}
            onClick={nextFlowStep}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </Actions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  gifts: state.purchase.gifts,
  gift: state.purchase.gift,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  setGift,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase8))
