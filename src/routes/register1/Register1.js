import React from 'react'
import {connect} from 'react-redux'
import {INDIVIDUAL_ACCOUNT, setAccountType, TEAM_ACCOUNT} from '../../reducers/register'
import {Button, Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Register1.css'
import {Link} from '../../components'
import {REGISTER2_ROUTE} from '../'
import ArrowIcon from '../../static/decor_arrow.svg'
import IndividualIcon from '../../static/individual.svg'
import TeamIcon from '../../static/team.svg'
import CheckIcon from '../../static/card_checkmark.svg'
import cn from 'classnames'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import history from '../../history'
import {generateUrl} from '../../router'

const Card = ({title, children, active, onClick, keyValue}) =>
  <div className={cn(s.card, active && s.active)} onClick={onClick}>
    {active && <CheckIcon className={s.cardCheckIcon}/>}
    {children}
    <h3 className={s.cardHeader}>
      {keyValue && (
        <React.Fragment>
          <span className={s.cardKey}>{keyValue}</span>
          <KeyHandler keyEventName={KEYPRESS} keyValue={keyValue} onKeyHandle={onClick}/>
        </React.Fragment>
      )}
      {title && <span className={s.cardTitle}>{title}</span>}
    </h3>
  </div>

class Register1 extends React.Component {
  render() {
    const {setAccountType, accountType} = this.props
    return (
      <React.Fragment>
        <div className={s.content}>
          <h1 className={s.header}>
            <span className={s.headerPrefix}>
              1
              <ArrowIcon className={s.arrowIcon}/>
            </span>
            Type of Account
          </h1>
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Card
                title={'Individual'}
                onClick={() => setAccountType(INDIVIDUAL_ACCOUNT)}
                active={accountType === INDIVIDUAL_ACCOUNT}
                keyValue='a'
              >
                <IndividualIcon className={s.icon}/>
              </Card>
              <p className={s.description}>
                * Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an took a type specimen book. It has survived
                not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                title={'Team'}
                onClick={() => setAccountType(TEAM_ACCOUNT)}
                active={accountType === TEAM_ACCOUNT}
                keyValue='b'
              >
                <TeamIcon className={s.icon}/>
              </Card>
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
            onKeyHandle={() => accountType && history.push(generateUrl(REGISTER2_ROUTE))}
          />
          <Link to={REGISTER2_ROUTE} disabled={!accountType}>
            <Button type='primary' className={s.submitBtn}>
              Submit
            </Button>
          </Link>
        </div>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  accountType: state.register.accountType,
})

const mapDispatch = {
  setAccountType,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Register1))
