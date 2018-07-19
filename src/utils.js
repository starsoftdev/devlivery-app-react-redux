import {DATE_FORMAT} from './constants'

export const getSuccessMessage = (res) => res && typeof res.data === 'string' ? res.data : null

export const getErrorMessage = (res) => res && typeof res.data === 'string' ? res.data : 'Something went wrong. Please try again.'

export const getBirthday = (birthday) => birthday ? birthday.format(DATE_FORMAT) : null
