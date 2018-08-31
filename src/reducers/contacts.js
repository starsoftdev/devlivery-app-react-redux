import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DATE_FORMAT} from '../constants'
import {message} from 'antd'
import {generateUrl} from '../router'
import {CONTACTS_ROUTE} from '../routes'
import mapValues from 'lodash/mapValues'
import has from 'lodash/has'
import {getBirthday, getFormErrors, getOrdering} from '../utils'
import { navigateToNextRouteName } from './global';
// ------------------------------------
// Constants
// ------------------------------------
export const GET_CONTACTS_REQUEST = 'Contacts.GET_CONTACTS_REQUEST'
export const GET_CONTACTS_SUCCESS = 'Contacts.GET_CONTACTS_SUCCESS'
export const GET_CONTACTS_FAILURE = 'Contacts.GET_CONTACTS_FAILURE'

export const GET_CONTACTSBYNAME_REQUEST = 'Contacts.GET_CONTACTS_REQUEST'
export const GET_CONTACTSBYNAME_SUCCESS = 'Contacts.GET_CONTACTSBYNAME_SUCCESS'
export const GET_CONTACTSBYNAME_FAILURE = 'Contacts.GET_CONTACTSBYNAME_FAILURE'

export const GET_CONTACT_REQUEST = 'Contacts.GET_CONTACT_REQUEST'
export const GET_CONTACT_SUCCESS = 'Contacts.GET_CONTACT_SUCCESS'
export const GET_CONTACT_FAILURE = 'Contacts.GET_CONTACT_FAILURE'

export const ADD_CONTACT_REQUEST = 'Contacts.ADD_CONTACT_REQUEST'
export const ADD_CONTACT_SUCCESS = 'Contacts.ADD_CONTACT_SUCCESS'
export const ADD_CONTACT_FAILURE = 'Contacts.ADD_CONTACT_FAILURE'

export const EDIT_CONTACT_REQUEST = 'Contacts.EDIT_CONTACT_REQUEST'
export const EDIT_CONTACT_SUCCESS = 'Contacts.EDIT_CONTACT_SUCCESS'
export const EDIT_CONTACT_FAILURE = 'Contacts.EDIT_CONTACT_FAILURE'

export const REMOVE_CONTACT_REQUEST = 'Contacts.REMOVE_CONTACT_REQUEST'
export const REMOVE_CONTACT_SUCCESS = 'Contacts.REMOVE_CONTACT_SUCCESS'
export const REMOVE_CONTACT_FAILURE = 'Contacts.REMOVE_CONTACT_FAILURE'

export const GET_OCCASIONS_REQUEST = 'Contacts.GET_OCCASIONS_REQUEST'
export const GET_OCCASIONS_SUCCESS = 'Contacts.GET_OCCASIONS_SUCCESS'
export const GET_OCCASIONS_FAILURE = 'Contacts.GET_OCCASIONS_FAILURE'

export const GET_GROUPS_REQUEST = 'Contacts.GET_GROUPS_REQUEST'
export const GET_GROUPS_SUCCESS = 'Contacts.GET_GROUPS_SUCCESS'
export const GET_GROUPS_FAILURE = 'Contacts.GET_GROUPS_FAILURE'

export const UPLOAD_CONTACTS_REQUEST = 'Contacts.UPLOAD_CONTACTS_REQUEST'
export const UPLOAD_CONTACTS_SUCCESS = 'Contacts.UPLOAD_CONTACTS_SUCCESS'
export const UPLOAD_CONTACTS_FAILURE = 'Contacts.UPLOAD_CONTACTS_FAILURE'

export const IMPORT_CONTACTS_REQUEST = 'Contacts.IMPORT_CONTACTS_REQUEST'
export const IMPORT_CONTACTS_SUCCESS = 'Contacts.IMPORT_CONTACTS_SUCCESS'
export const IMPORT_CONTACTS_FAILURE = 'Contacts.IMPORT_CONTACTS_FAILURE'

export const MAPPING_COLUMNS = 'Contacts.MAPPING_COLUMNS'

export const OPEN_UPLOADED_CONTACTS_MODAL = 'Contacts.OPEN_UPLOADED_CONTACTS_MODAL'
export const CLOSE_UPLOADED_CONTACTS_MODAL = 'Contacts.CLOSE_UPLOADED_CONTACTS_MODAL'
export const CHANGE_SELECTED_CONTACTS = 'Contacts.CHANGE_SELECTED_CONTACTS'

export const SAVE_FIELDS = 'Contacts.SAVE_FIELDS'

export const CLEAR = 'Contacts.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getContacts = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CONTACTS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {search, page, pageSize, ordering} = getState().contacts

  return fetch(`/view-contacts?${qs.stringify({
    ...search ? {
      name: search
    } : {},
    ...getOrdering(ordering),
    ...ordering.includes('dob') ? {
      upcoming: '',
    } : {},
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_CONTACTS_SUCCESS, res}),
    failure: () => dispatch({type: GET_CONTACTS_FAILURE}),
  })
}
export const getContactsByName = (title) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CONTACTSBYNAME_REQUEST, title})
  const {token} = dispatch(getToken())
  return fetch(`/contacts-by-group?${qs.stringify({
    title,
    take: 1000,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_CONTACTSBYNAME_SUCCESS, res}),
    failure: () => dispatch({type: GET_CONTACTSBYNAME_FAILURE}),
  })
}
export const getContact = (contactId) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CONTACT_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/contacts?${qs.stringify({
    filter_key: 'id',
    filter_value: contactId,
    with: 'reminders,groups,addresses'
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({type: GET_CONTACT_SUCCESS, contact: res.data && res.data[0]})
    },
    failure: () => dispatch({type: GET_CONTACT_FAILURE})
  })
}

export const getRemindersArray = (reminders) => {
  return reminders.filter(item => {
    // if one of the property undefined/null - don't send item
    return (item.custom_title || item.occasion_id) && item.date
  }).map(item => ({
    recurring: item.recurring,
    // if user provided new occasion title
    ...isNaN(+item.occasion_id) ? {
      custom_title: item.occasion_id
    } : {
      occasion_id: +item.occasion_id
    },
    date: item.date.format(DATE_FORMAT)
  }))
}

export const getGroupsArray = (groups) => {
  // if one of the property undefined/null - don't send item
  return groups.filter(item => !Object.values(item).includes(undefined) && !Object.values(item).includes(null))
}

export const getAddressesArray = (addresses) => {
  // if 'address' is empty - don't send item
  var result = addresses.filter(item => !!item.address).map(({address2, ...item}) => {
    return address2 ? {
      ...item,
      address: `${item.address}\n${address2}`
    } : item
  })
  return result.map(item =>{
    if(item.title === 'office' && item.address)
      return {
        ...item,
        company_name: item.address
      }
    return item;
  });
}

export const addContact = (values, form, callback) => (dispatch, getState, {fetch}) => {
  dispatch({type: ADD_CONTACT_REQUEST})
  const {dob, reminders, groups, addresses, ...otherValues} = values
  const {token} = dispatch(getToken())
  return fetch(`/add-contact-manually`, {
    method: 'POST',
    body: {
      ...otherValues,
      contact: {
        ...otherValues.contact,
        ...dob ? {
          dob: dob.format(DATE_FORMAT)
        } : {},
      },
      addresses: getAddressesArray(addresses),
      reminders: getRemindersArray(reminders),
      groups: getGroupsArray(groups),
    },
    token,
    success: (res) => {
      dispatch({type: ADD_CONTACT_SUCCESS, res})
      if (form) form.resetFields()
      if (callback) callback()
    },
    failure: (res) => {
      dispatch({type: ADD_CONTACT_FAILURE})
      const {formErrors} = getFormErrors({...res, values})
      if (formErrors)
        form.setFields(formErrors)
      else
        message.error('Something went wrong. Please try again.')
    }
  })
}

export const editContact = (values, form, redrict) => (dispatch, getState, {fetch, history}) => {
  dispatch({type: EDIT_CONTACT_REQUEST})
  const {token} = dispatch(getToken())
  const {contact} = getState().contacts

  const {dob, reminders, groups, addresses, ...otherValues} = values

  return fetch(`/edit-contact`, {
    method: 'POST',
    body: {
      ...otherValues,
      contact: {
        id: contact.id,
        ...otherValues.contact,
        dob: getBirthday(dob),
      },
      addresses: getAddressesArray(addresses),
      reminders: getRemindersArray(reminders),
      groups: getGroupsArray(groups),
    },
    token,
    success: () => {
      dispatch({type: EDIT_CONTACT_SUCCESS})
      message.success('Contact was successfully updated',redrict)
      if(redrict)
      {
        //on Edit Contact Page
        dispatch(navigateToNextRouteName(redrict));
      }
      else{
        dispatch(navigateToNextRouteName(generateUrl(CONTACTS_ROUTE)));
      }
    },
    failure: (res) => {
      dispatch({type: EDIT_CONTACT_FAILURE})
      const {formErrors} = getFormErrors({...res, values})
      if (formErrors)
        form.setFields(formErrors)
      else
        message.error('Something went wrong. Please try again.')
    }
  })
}

export const removeContact = (contact) => (dispatch, getState, {fetch}) => {
  dispatch({type: REMOVE_CONTACT_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/contacts/${contact.id}`, {
    method: 'DELETE',
    token,
    success: () => {
      dispatch({type: REMOVE_CONTACT_SUCCESS})
      dispatch(getContacts())
    },
    failure: () => dispatch({type: REMOVE_CONTACT_FAILURE}),
  })
}

export const getOccasions = ({search} = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_OCCASIONS_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/occasions?${qs.stringify({
    take: 10,
    ...search ? {
      filter_key: 'title',
      filter_value: search,
    } : {},
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_OCCASIONS_SUCCESS, occasions: res.data}),
    failure: () => dispatch({type: GET_OCCASIONS_FAILURE})
  })
}

export const getGroups = ({search} = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_GROUPS_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/contact-groups?${qs.stringify({
    take: 10,
    ...search ? {
      filter_key: 'title',
      filter_value: search,
    } : {},
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_GROUPS_SUCCESS, groups: res.data}),
    failure: () => dispatch({type: GET_GROUPS_FAILURE})
  })
}

export const uploadContacts = (file, fileType) => (dispatch, getState, {fetch}) => {
  dispatch({type: UPLOAD_CONTACTS_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/contact/import`, {
    method: 'POST',
    contentType: 'multipart/form-data',
    body: {
      file,
      file_type: fileType,
    },
    token,
    success: ({data}) => {
      dispatch({type: UPLOAD_CONTACTS_SUCCESS, uploadedContacts: data.contacts})
      if (data.db_columns) {
        dispatch({type: MAPPING_COLUMNS, mappingColumns: data})
      }
    },
    failure: () => dispatch({type: UPLOAD_CONTACTS_FAILURE}),
  })
}

export const importContacts = (columnsMapping, callback) => (dispatch, getState, {fetch}) => {
  dispatch({type: IMPORT_CONTACTS_REQUEST})
  const {token} = dispatch(getToken())
  const {uploadedContacts, selectedContacts} = getState().contacts
  // TODO modify contacts obj for vcf/xls
  const contacts = uploadedContacts
    .filter((contact, i) => selectedContacts.includes(i))
    .map(contact => {
      const {street, city, country, state, postal_code, ...otherFields} = mapValues(columnsMapping, (value) => contact[value])
      const addresses = [{address: street, city, country, state, postal_code}]
      return {...otherFields, addresses}
    })

  return fetch(`/contact/import-final`, {
    method: 'POST',
    body: {
      contacts,
    },
    token,
    success: (res) => {
      dispatch({type: IMPORT_CONTACTS_SUCCESS})
      callback()
    },
    failure: (err) => {
      if(err.errors && err.errors.validation)
      {
        for (var key in err.errors.validation) {
          message.error(err.errors.validation[key])
        }
      }
      if(err.message)
        message.error(err.message)
      dispatch({type: IMPORT_CONTACTS_FAILURE})
    },
  })
}

export const openUploadedContactsModal = () => ({type: OPEN_UPLOADED_CONTACTS_MODAL})

export const closeUploadedContactsModal = () => ({type: CLOSE_UPLOADED_CONTACTS_MODAL})

export const changeSelectedContacts = (selectedContacts) => ({type: CHANGE_SELECTED_CONTACTS, selectedContacts})

export const saveFields = (fields) => (dispatch, getState) => {
  dispatch({type: SAVE_FIELDS, fields})
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    contacts: false,
    addingContact: false,
    editingContact: false,
    removingContact: false,
    occasions: false,
    groups: false,
  },
  contacts: [],
  contactsCount: 0,
  page: 1,
  pageSize: 12,
  occasions: [],
  groups: [],
  contact: null,
  mappingColumns: null,
  uploadedContacts: [],
  uploadedContactsModalOpened: false,
  selectedContacts: [],
  ordering: 'first_name',
  fields: {},
}

export default createReducer(initialState, {
  [GET_CONTACTS_REQUEST]: (state, {params}) => ({
    search: has(params, 'search') ? params.search : state.search,
    ordering: has(params, 'ordering') ? params.ordering : state.ordering,
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : 12,
    loading: {
      ...state.loading,
      contacts: true,
    },
  }),
  [GET_CONTACTS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    contacts: data,
    contactsCount: total,
    loading: {
      ...state.loading,
      contacts: false,
    },
  }),
  [GET_CONTACTS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      contacts: false,
    },
  }),
  [GET_CONTACTSBYNAME_REQUEST]: (state, {params}) => ({
    loading: {
      ...state.loading,
      contactsByname: true,
    },
  }),
  [GET_CONTACTSBYNAME_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    contacts: data,
    contactsCount: total,
    loading: {
      ...state.loading,
      contactsByname: false,
    },
  }),
  [GET_CONTACTSBYNAME_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      contactsByname: false,
    },
  }),
  [GET_CONTACT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      contact: true,
    },
  }),
  [GET_CONTACT_SUCCESS]: (state, {contact}) => ({
    contact,
    loading: {
      ...state.loading,
      contact: false,
    },
  }),
  [GET_CONTACT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      contact: false,
    },
  }),
  [ADD_CONTACT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      addingContact: true,
    },
  }),
  [ADD_CONTACT_SUCCESS]: (state, action) => ({
    fields: {},
    loading: {
      ...state.loading,
      addingContact: false,
    },
    newContact: action.res.data
  }),
  [ADD_CONTACT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      addingContact: false,
    },
  }),
  [EDIT_CONTACT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      editingContact: true,
    },
  }),
  [EDIT_CONTACT_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      editingContact: false,
    },
  }),
  [EDIT_CONTACT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      editingContact: false,
    },
  }),
  [REMOVE_CONTACT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      removingContact: true,
    },
  }),
  [REMOVE_CONTACT_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      removingContact: false,
    },
  }),
  [REMOVE_CONTACT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      removingContact: false,
    },
  }),
  [GET_OCCASIONS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      occasions: true,
    },
  }),
  [GET_OCCASIONS_SUCCESS]: (state, {occasions}) => ({
    occasions,
    loading: {
      ...state.loading,
      occasions: false,
    },
  }),
  [GET_OCCASIONS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      occasions: false,
    },
  }),
  [GET_GROUPS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      groups: true,
    },
  }),
  [GET_GROUPS_SUCCESS]: (state, {groups}) => ({
    groups,
    loading: {
      ...state.loading,
      groups: false,
    },
  }),
  [GET_GROUPS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      groups: false,
    },
  }),
  [MAPPING_COLUMNS]: (state, {mappingColumns}) => ({
    mappingColumns,
  }),
  [OPEN_UPLOADED_CONTACTS_MODAL]: (state, action) => ({
    uploadedContactsModalOpened: true,
  }),
  [CLOSE_UPLOADED_CONTACTS_MODAL]: (state, action) => ({
    uploadedContactsModalOpened: false,
  }),
  [UPLOAD_CONTACTS_SUCCESS]: (state, {uploadedContacts}) => ({
    uploadedContacts,
    selectedContacts: uploadedContacts.map((item, i) => i),
  }),
  [CHANGE_SELECTED_CONTACTS]: (state, {selectedContacts}) => ({
    selectedContacts,
  }),
  [IMPORT_CONTACTS_SUCCESS]: (state, action) => ({
    uploadedContacts: [],
    selectedContacts: [],
    mappingColumns: null,
  }),
  [SAVE_FIELDS]: (state, {fields}) => ({
    fields: {
      ...state.fields,
      ...fields,
    },
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
