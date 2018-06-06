import React from 'react'
import {connect} from 'react-redux'
import {setCardSize, submitCardSize} from '../../reducers/purchase'
import {Button, Carousel, Col, Layout, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase5.css'
import {Card, Link} from '../../components'
import ArrowIcon from '../../static/decor_arrow.svg'
import Card1Image from '../../static/modern_card_style.png'
import Card2Image from '../../static/vintage_card_style.png'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {HOME_ROUTE} from '../'
import Logo from '../../static/logo.svg'
import cn from 'classnames'
import Preview from './Preview'

const CARD_STYLES = [
  {key: 'card1', image: Card1Image},
  {key: 'card2', image: Card2Image},
  {key: 'card3', image: Card1Image},
  {key: 'card4', image: Card2Image},
  {key: 'card5', image: Card1Image},
  {key: 'card6', image: Card2Image},
]

class Purchase5 extends React.Component {
  state = {
    previewCollapsed: false,
  }

  onPreviewCollapse = (previewCollapsed) => {
    this.setState({previewCollapsed})
  }

  render() {
    const {previewCollapsed} = this.state
    const {cardSize, setCardSize, submitCardSize} = this.props

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
              <h1 className={s.header}>
                <span className={s.headerPrefix}>
                  5
                  <ArrowIcon className={s.arrowIcon}/>
                </span>
                Choose Card
              </h1>
              <Row className={s.items} gutter={20} type='flex' align='center'>
                {CARD_STYLES.map((item) =>
                  <Col key={item.key} className={s.itemWrapper}>
                    <Card
                      className={s.item}
                      image={item.image}
                      onClick={() => setCardSize(item.key)}
                      active={item.key === cardSize}
                    />
                  </Col>
                )}
              </Row>
            </div>
          </Layout.Content>
          <Preview onCollapse={this.onPreviewCollapse} collapsed={previewCollapsed}/>
        </div>
        <div className={s.actions}>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={submitCardSize}
          />
          <Button
            type='primary'
            className={s.submitBtn}
            disabled={!cardSize}
            onClick={submitCardSize}
          >
            Submit
          </Button>
        </div>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  cardSizes: state.purchase.cardSizes,
  cardSize: state.purchase.cardSize,
  loading: state.purchase.loading,
})

const mapDispatch = {
  setCardSize,
  submitCardSize,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase5))
