import React from 'react'
import {connect} from 'react-redux'
import {Col, Input, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Contacts.css'
import EditIcon from '../../static/edit.svg'
import RemoveIcon from '../../static/remove.svg'
import GridIcon from '../../static/view_card.svg'
import ListIcon from '../../static/view_list.svg'

// TODO get contacts
const contacts = [
  {name: 'Alan Johnson', phone: '+41 79 123 45 67'},
  {name: 'Erika Forster-Vannini', phone: '+41 79 123 45 67'},
  {name: 'Massimo Ceccaroni', phone: '+41 79 123 45 67'},
  {name: 'Christiane Brunner', phone: '+41 79 123 45 67'},
]

class Contacts extends React.Component {
  render() {
    return (
      <div className={s.container}>
        <div className={s.actions}>
          {/*TODO add search icon*/}
          <Input className={s.search} placeholder={'Search'}/>
          <Select className={s.sortBy} placeholder={'Sort by'}>
          </Select>
          <div className={s.views}>
            <a className={s.viewBtn}>
              <GridIcon/>
            </a>
            <a className={s.viewBtn}>
              <ListIcon/>
            </a>
          </div>
        </div>
        <Row type='flex' gutter={20}>
          {contacts.map((contact, i) =>
            <Col key={i} xs={24} sm={12} md={6}>
              <div className={s.contact}>
                <a className={s.editBtn}>
                  <EditIcon/>
                </a>
                <a className={s.removeBtn}>
                  <RemoveIcon/>
                </a>
                <p className={s.contactName}>{contact.name}</p>
                <a href={`tel:${contact.phone}`} className={s.contactPhone}>
                  {contact.phone}
                </a>
              </div>
            </Col>
          )}
        </Row>
      </div>
    )
  }
}

const mapState = state => ({})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(withStyles(s)(Contacts))
