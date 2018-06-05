import React from 'react'
import {connect} from 'react-redux'
import {HANDWRITTEN, PRINTED, setLetteringTechnique, submitLetteringTechnique} from '../../reducers/purchase'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase2.css'
import {Card} from '../../components'
import ArrowIcon from '../../static/decor_arrow.svg'
import HandwrittenIcon from '../../static/handwritten.svg'
import PrintedIcon from '../../static/printed.svg'
import KeyHandler, {KEYPRESS} from 'react-key-handler'

class Purchase2 extends React.Component {
  render() {
    const {letteringTechnique, setLetteringTechnique, submitLetteringTechnique} = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          <h1 className={s.header}>
            <span className={s.headerPrefix}>
              2
              <ArrowIcon className={s.arrowIcon}/>
            </span>
            Lettering Technique
          </h1>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Card
                title={'Handwritten'}
                onClick={() => setLetteringTechnique(HANDWRITTEN)}
                active={letteringTechnique === HANDWRITTEN}
                keyValue='a'
                svg={HandwrittenIcon}
              />
              <p className={s.description}>
                * Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an took a type specimen book. It has survived
                not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                title={'Printed'}
                onClick={() => setLetteringTechnique(PRINTED)}
                active={letteringTechnique === PRINTED}
                keyValue='b'
                svg={PrintedIcon}
              />
              <p className={s.description}>
                * Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only
                five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              </p>
            </Col>
          </Row>
        </div>
        <div className={s.actions}>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={submitLetteringTechnique}
          />
          <Button
            onClick={submitLetteringTechnique}
            type='primary'
            className={s.submitBtn}
            disabled={!letteringTechnique}
          >
            Submit
          </Button>
        </div>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  letteringTechnique: state.purchase.letteringTechnique,
})

const mapDispatch = {
  setLetteringTechnique,
  submitLetteringTechnique,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase2))
