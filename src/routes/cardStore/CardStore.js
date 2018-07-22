import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './CardStore.css'
import messages from './messages'
import debounce from 'lodash/debounce'
import {CARD_SIZES, DEFAULT_DEBOUNCE_TIME} from '../../constants'
import {getCards, getOccasions} from '../../reducers/cards'
import {Col, Input, Pagination, Row, Select} from 'antd'
import {Card, PaginationItem} from '../../components'

class CardStore extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: undefined,
    }

    this.getCards = debounce(this.props.getCards, DEFAULT_DEBOUNCE_TIME)
  }

  changeSearch = (e) => {
    const search = e.target.value
    this.setState({search})
    this.getCards({search})
  }

  render() {
    const {search} = this.state
    const {cards, cardsCount, getCards, intl, page, pageSize, cardStyles, occasions, getOccasions, occasionTypes, loading} = this.props

    return (
      <div className={s.container}>
        <div className={s.filters}>
          <section>
            <h3 className={s.filterHeader}>{intl.formatMessage(messages.occasion)}</h3>
            <Select
              className={s.occasionType}
              allowClear
              placeholder={intl.formatMessage(messages.occasionType)}
              onChange={(occasionType) => getOccasions({occasionType})}
            >
              {occasionTypes.map(item =>
                <Select.Option key={item} value={item}>{item}</Select.Option>
              )}
            </Select>
            <ul className={s.filterItems}>
              {occasions.map((item) =>
                <li key={item.id}>
                  <a onClick={() => getCards({occasion: item.id})}>{item.title}</a>
                </li>
              )}
            </ul>
          </section>
          <section>
            <h3 className={s.filterHeader}>{intl.formatMessage(messages.size)}</h3>
            <ul className={s.filterItems}>
              {CARD_SIZES(intl).map((item) =>
                <li key={item.key}>
                  <a onClick={() => getCards({cardSize: item.key})}>{item.title}</a>
                </li>
              )}
            </ul>
          </section>
          <section>
            <h3 className={s.filterHeader}>{intl.formatMessage(messages.style)}</h3>
            <ul className={s.filterItems}>
              {cardStyles.map((item) =>
                <li key={item.title}>
                  <a onClick={() => getCards({cardStyle: item.title})}>{item.title}</a>
                </li>
              )}
            </ul>
          </section>
        </div>
        <div className={s.content}>
          <Input.Search
            className={s.search}
            placeholder={intl.formatMessage(messages.search)}
            value={search}
            onChange={this.changeSearch}
          />
          {!!cards.length ? (
            <Row gutter={20} type='flex'>
              {cards.map((item) =>
                <Col key={item.id} xs={24} sm={12} md={8} lg={6} className={s.itemWrapper}>
                  <Card
                    image={item.images[0] && item.images[0].url}
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
                  />
                </Col>
              )}
            </Row>
          ) : !loading.cards ? (
            <div className={s.noData}>{intl.formatMessage(messages.noData)}</div>
          ) : null}
          {!!cards.length && (
            <div className={s.footer}>
              <Pagination
                current={page}
                total={cardsCount}
                pageSize={pageSize}
                onChange={(current) => getCards({pagination: {current}})}
                itemRender={(current, type, el) => <PaginationItem type={type} el={el}/>}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  ...state.cards,
})

const mapDispatch = {
  getCards,
  getOccasions,
}

export default connect(mapState, mapDispatch)(withStyles(s)(CardStore))
