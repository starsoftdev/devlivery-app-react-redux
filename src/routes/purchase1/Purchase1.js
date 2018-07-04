import React from 'react'
import {connect} from 'react-redux'
import {getOccasions, nextFlowStep, setOccasion} from '../../reducers/purchase'
import {Button, Col, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase1.css'
import {Actions, Card, SectionHeader} from '../../components'
import {ALPHABET} from '../../constants'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import messages from './messages'

class Purchase1 extends React.Component {
  render() {
    const {occasions, occasion, setOccasion, intl, flowIndex, nextFlowStep, occasionTypes, getOccasions} = this.props

    return (
      <React.Fragment>
        <div className={s.content}>
          <SectionHeader
            className={s.header}
            header={intl.formatMessage(messages.header)}
            number={flowIndex + 1}
            prefixClassName={s.headerPrefix}
          >
            <Select
              className={s.occasionType}
              allowClear
              placeholder={intl.formatMessage(messages.filterByOccasionType)}
              onChange={(occasionType) => getOccasions({occasionType})}
            >
              {occasionTypes.map(item =>
                <Select.Option key={item} value={item}>{item}</Select.Option>
              )}
            </Select>
          </SectionHeader>
          <Row className={s.items} gutter={20} type='flex' align='center'>
            {occasions.map((item, i) =>
              <Col key={item.id} className={s.itemWrapper}>
                <Card
                  className={s.item}
                  title={item.title}
                  image={item.image.url}
                  onClick={() => setOccasion(item.id)}
                  active={item.id === occasion}
                  keyValue={ALPHABET[i]}
                />
              </Col>
            )}
          </Row>
        </div>
        <Actions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={occasion && nextFlowStep}
          />
          <Button
            disabled={!occasion}
            type='primary'
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
  occasionTypes: state.purchase.occasionTypes,
  occasions: state.purchase.occasions,
  occasion: state.purchase.occasion,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  getOccasions,
  setOccasion,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase1))
