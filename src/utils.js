import {DATE_FORMAT} from './constants'
import get from 'lodash/get'

export const getSuccessMessage = (res) => res && typeof res.data === 'string' ? res.data : null

export const getErrorMessage = (res) => res && typeof res.data === 'string' ? res.data : 'Something went wrong. Please try again.'

export const getFormErrors = ({values, errors}) => {
  if (errors.validation) {
    // errors on form fields
    const formErrors = {}
    const fields = Object.keys(errors.validation)
    fields.forEach(field => {
      // backend returns wrong field path (e.g. addresses.0.address => addresses[0].address)
      const fieldKey = field.replace(/\.(\d+?)\./g, "[$1].")
      console.log(fieldKey, values)
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

export const getBirthday = (birthday) => birthday ? birthday.format(DATE_FORMAT) : null

export const getOrdering = (ordering) => {
  const orderDesc = ordering.substring(0, 1) === '-'
  const sorterField = orderDesc ? ordering.substring(1) : ordering
  return ordering ? {
    sort_by: sorterField,
    ...orderDesc ? {order_by: 'desc'} : {},
  } : {}
}

export const createArray = (length) => Array.from(Array(length), (item, i) => i)
