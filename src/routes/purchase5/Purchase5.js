import React from 'react'
import {connect} from 'react-redux'
import {getCards, nextFlowStep, setCard} from '../../reducers/purchase'
import {Button, Col, Layout, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase5.css'
import {Card, Header, SectionHeader} from '../../components'
import cn from 'classnames'
import Preview from './Preview'
import messages from './messages'

// TODO remove no cards label
class Purchase5 extends React.Component {
  state = {
    previewCollapsed: false,
  }

  onPreviewCollapse = (previewCollapsed) => {
    this.setState({previewCollapsed})
  }

  render() {
    const {previewCollapsed} = this.state
    const {cards, card, setCard, nextFlowStep, intl, flowIndex, loading, getCards, cardColors, cardColor} = this.props

    return (
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
              className={s.header}
              prefixClassName={s.headerPrefix}
            >
              <Select
                className={s.color}
                allowClear
                //placeholder={intl.formatMessage(messages.color)}
                onChange={(cardColor) => getCards({cardColor})}
                value = {cardColor ? cardColor:intl.formatMessage(messages.color)}
              >
                {cardColors.map(item =>
                  <Select.Option key={item.title} value={item.title}>{item.title}</Select.Option>
                )}
              </Select>
            </SectionHeader>
            {!!cards.length ? (
              <Row className={s.items} gutter={20} type='flex' align='center'>
                {cards.map((item) =>
                  <Col key={item.id} className={s.itemWrapper}>
                    <Card
                      className={s.item}
                      image={item.images[0] && item.images[0].url}
                      title={
                        <span className={s.price}>
                            {item.price}
                          <span className={s.currency}>{item.currency}</span>
                          </span>
                      }
                      bordered={false}
                      description={item.description}
                      onClick={() => {
                        setCard(item)
                        nextFlowStep()
                      }}
                      active={card && card.id === item.id}
                    />
                  </Col>
                )}
              </Row>
            ) : !loading.cards ? (
              <div style={{textAlign: 'center'}}>No cards.</div>
            ) : null}
          </div>
        </Layout.Content>
        <Preview onCollapse={this.onPreviewCollapse} collapsed={previewCollapsed}/>
      </div>

    )
  }
}

const mapState = state => ({
  cards: state.purchase.cards,
  card: state.purchase.card,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
  cardColors: state.purchase.cardColors,
  cardColor: state.purchase.cardColor
})

const mapDispatch = {
  setCard,
  nextFlowStep,
  getCards,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase5))
