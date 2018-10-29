import {DATE_FORMAT,EMPTY_IMAGE} from './constants'
import get from 'lodash/get'
import moment from 'moment'
import isArray from 'lodash/isArray'
import {message} from 'antd'

export const getSuccessMessage = (res) => res && typeof res.data === 'string' ? res.data : null

export const getErrorMessage = (res) => res && (typeof res.data === 'string' || typeof res.errors === 'string') ? res.data||res.errors : 'Something went wrong. Please try again.'

export const showErrorMessage = (res) => {
  if(res)
  {
    if(res.message)
    {
      message.error(JSON.stringify(res.message));
      return;
    }
    if(res.errors && res.errors.validation)
    {
      for(var key in res.errors.validation)
        message.error(res.errors.validation[key]);
      return;
    }
    if(typeof res.errors === 'string')
    {
      message.error(res.errors);
      return;
    }
    if(res.errors && Array.isArray(res.errors))
    {
      message.error(res.errors[0]);
      return;
    }
  }
  message.error('Something went wrong. Please try again.');
}

export const getFormErrors = ({values, errors}) => {
  if (typeof errors === 'object' && errors.validation) {
    // errors on form fields
    const formErrors = {}
    const fields = Object.keys(errors.validation)
    fields.forEach(field => {
      // backend returns wrong field path (e.g. addresses.0.address => addresses[0].address)
      const fieldKey = field.replace(/\.(\d+?)\./g, "[$1].")
      formErrors[fieldKey] = {
        value: get(values, fieldKey),
        errors: [{
          field: fieldKey,
          message: errors.validation[field][0]
        }]
      }
    })
    return {formErrors}
  } else {
    // error on alert
    // TODO error
    return {error: 'Something went wrong. Please try again.'}
  }
}

export const getBirthday = (birthday) => birthday ? moment(birthday,'DD/MM/YYYY').format(DATE_FORMAT) : null

export const getOrdering = (ordering) => {
  const orderDesc = ordering.substring(0, 1) === '-'
  const sorterField = orderDesc ? ordering.substring(1) : ordering
  return ordering ? {
    sort_by: sorterField,
    ...orderDesc ? {order_by: 'desc'} : {},
  } : {}
}

export const createArray = (length) => Array.from(Array(length), (item, i) => i)

export const getEvent = (event, current) => {
  const eventDate = moment(event.contact_specific_date || event.occasion_date, DATE_FORMAT)
  // backend doesn't return recurring events in intuitive way
  if (event.recurring === 'y') {
    return eventDate.month() === current.month() && eventDate.date() === current.date()
  } else if (event.recurring === 'm') {
    return eventDate.date() === current.date()
  } else {
    return eventDate.isSame(current, 'd')
  }
}

export const loadFont = (font) => {
  if (!document.getElementById(font)) {
    const head = document.getElementsByTagName('head')[0]
    const link = document.createElement('link')
    link.id = font
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = `https://fonts.googleapis.com/css?family=${font}`
    link.media = 'all'
    head.appendChild(link)
  }
}

export const getItemImage = (item, imagesProp) =>
{
  const result = imagesProp && item && item[imagesProp] ? (isArray(item[imagesProp]) ? item[imagesProp][0] && item[imagesProp][0].url : item[imagesProp].url) : null
  return result ? result : EMPTY_IMAGE;
}
  
export const  isHavePaymentPermission =(permissions) =>{
    if(permissions.length <= 0 )
      return false;
    if(permissions.hasOwnProperty('Payments'))
    {
      var subPermission = permissions['Payments'].filter(item => item.name === 'Can pay' || item.name === 'Can pay with budget');
      if (subPermission.length > 0)
        return true;
      return false;
    }
    return false;
  }
