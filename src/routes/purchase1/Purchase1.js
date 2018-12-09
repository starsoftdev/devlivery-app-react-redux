import React from 'react'
import {connect} from 'react-redux'
import {getOccasions, nextFlowStep, setOccasion,clearVoucherAndDonation} from '../../reducers/purchase'
import {Col, Row, Select, Button} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase1.css'
import {Card, SectionHeader, PurchaseActions} from '../../components'
import {ALPHABET,DEFAULT_OCCASION_TYPE_DE,DEFAULT_OCCASION_TYPE} from '../../constants'
import messages from './messages'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
const SEASONALID = 25;
const SEASONALNAME = 'seasonal';
const SEASONALNAME_DE = 'saisonal';

class Purchase1 extends React.Component {
  constructor(props){
    super(props)
    let type  = props.occasionType;
    if(type === DEFAULT_OCCASION_TYPE && props.intl.locale === 'de-DE')
      type = DEFAULT_OCCASION_TYPE_DE;
    this.state = {
      occasionType: type
    }
    this.selectSeasonal = this.selectSeasonal.bind(this);
  }
  componentWillMount(){
    this.props.clearVoucherAndDonation();
  }
  selectSeasonal(occasionType){
    this.setState({occasionType});
    this.props.getOccasions({occasionType});
  }
  render() {
    const {occasions, occasion, setOccasion, intl, flowIndex, nextFlowStep, occasionTypes, getOccasions} = this.props
    const seasonal_name  = intl.locale === 'de-DE' ? SEASONALNAME_DE: SEASONALNAME;
    
    return (
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
            value={this.state.occasionType}
            onChange={(occasionType) => this.selectSeasonal(occasionType)}
          >
            {occasionTypes.map(item =>
              <Select.Option key={item} value={item}>{item}</Select.Option>
            )}
          </Select>
        </SectionHeader>
        <Row className={s.items} gutter={20} type='flex' align='center'>
          {occasions.sort((a,b)=>parseInt(a.id) > parseInt(b.id) ? 1 : -1).map((item, i) =>
            <Col key={item.id} className={s.itemWrapper} >
              <Card
                className={s.item}
                title={item.title}
                item={item}
                imagesProp={'image'}
                onClick={() => {
                  if(item.title.toLowerCase() == seasonal_name)
                    this.selectSeasonal('Seasonal');
                  else{
                    setOccasion(item)
                    nextFlowStep()
                  }
                }}
                active={occasion && occasion.id === item.id}
                disabled = {!item.has_cards && item.title.toLowerCase() !== seasonal_name}
                //keyValue={ALPHABET[i]}
              />
            </Col>
          )}
        </Row>
        
        <PurchaseActions>
          
        </PurchaseActions>
      </div>
    )
  }
}

const mapState = state => ({
  occasionTypes: state.purchase.occasionTypes,
  occasionType: state.purchase.occasionType,
  occasions: state.purchase.occasions,
  occasion: state.purchase.occasion,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  getOccasions,
  setOccasion,
  nextFlowStep,
  clearVoucherAndDonation
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase1))
