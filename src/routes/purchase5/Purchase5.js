import React from 'react'
import {connect} from 'react-redux'
import {nextFlowStep, setCard} from '../../reducers/purchase'
import {Button, Col, Layout, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase5.css'
import {Actions, Card, Header, SectionHeader} from '../../components'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import cn from 'classnames'
import Preview from './Preview'
import messages from './messages'

class Purchase5 extends React.Component {
  state = {
    previewCollapsed: false,
  }

  onPreviewCollapse = (previewCollapsed) => {
    this.setState({previewCollapsed})
  }

  render() {
    const {previewCollapsed} = this.state
    const {cards, card, setCard, nextFlowStep, intl, flowIndex} = this.props

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
                {cards.map((item) =>
                  <Col key={item.id} className={s.itemWrapper}>
                    <Card
                      className={s.item}
                      image={item.images[0].url}
                      onClick={() => setCard(item.id)}
                      active={item.id === card}
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
            onKeyHandle={card && nextFlowStep}
          />
          <Button
            type='primary'
            disabled={!card}
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
  cards: state.purchase.cards,
  card: state.purchase.card,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  setCard,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase5))
