import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DATE_FORMAT,BIRTH_GERMAN,BIRTH_EN} from '../constants'
import {message} from 'antd'
import {generateUrl} from '../router'
import {CONTACTS_ROUTE} from '../routes'
import mapValues from 'lodash/mapValues'
import has from 'lodash/has'
import {getBirthday, getFormErrors, getOrdering, showErrorMessage} from '../utils'
import { navigateToNextRouteName } from './global';
import { SET_NEW_RECIPIENT } from './purchase';
import moment from 'moment'
import formMessages from '../formMessages'
import {getIntl} from './intl';
// ------------------------------------
// Constants
// ------------------------------------
export const GET_CONTACTS_REQUEST = 'Contacts.GET_CONTACTS_REQUEST'
export const GET_CONTACTS_SUCCESS = 'Contacts.GET_CONTACTS_SUCCESS'
export const GET_CONTACTS_FAILURE = 'Contacts.GET_CONTACTS_FAILURE'

export const GET_CONTACTSBYNAME_REQUEST = 'Contacts.GET_CONTACTSBYNAME_REQUEST'
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

export const SET_CHANGE_EDITFORM = "Contacts.SET_CHANGE_EDITFORM"
export const SET_ADD_EDITFORM = "Contacts.SET_ADD_EDITFORM"
export const SET_BIRTHDAY_SETUP = "Contacts.SET_BIRTHDAY_SETUP"

export const CLEAR = 'Contacts.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getContacts = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CONTACTS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {search} = params;
  const { page, pageSize, ordering} = getState().contacts
  
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
    failure: (err) => dispatch({type: GET_CONTACTS_FAILURE}),
  })
}
export const getContactsByName = (title,callback) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CONTACTSBYNAME_REQUEST, title})
  const {token} = dispatch(getToken())
  
  return fetch(`/contacts-by-group?${qs.stringify({
    title,
    take: 1000,
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      //dispatch({type: GET_CONTACTS_SUCCESS, res})
      if(callback)
        callback(res.data);
    },
    failure: (err) => {
      showErrorMessage(err);
      //dispatch({type: GET_CONTACTS_FAILURE})
    },
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
      if(res.data && res.data[0] && res.data[0].dob)
        dispatch(setupBirthday(true));
      else dispatch(setupBirthday(false));
    },
    failure: () => dispatch({type: GET_CONTACT_FAILURE})
  })
}
export const setContact = (contact) => (dispatch, getState, {fetch}) => {
  if(contact && contact.id)
    dispatch({type: GET_CONTACT_SUCCESS, contact})
}
export const getRemindersArray = (reminders) => {
  if(reminders === null || reminders === undefined)
    return [];
   
  return reminders.filter(item => {
    // if one of the property undefined/null - don't send item
    return (item.custom_title || item.occasion_id) && item.date && (item.occasion_id !== BIRTH_GERMAN) && (item.occasion_id !== BIRTH_EN)
  }).map(item => ({
    ...(item.recurring && item.recurring !== undefined && item.recurring !== '1') ?
    {recurring: item.recurring}:{},
    // if user provided new occasion title
    ...isNaN(+item.occasion_id) ? {
      custom_title: item.occasion_id
    } : {
      occasion_id: +item.occasion_id
    },
    date: moment(item.date, 'DD-MM-YYYY').format(DATE_FORMAT)
  }))
}

export const getGroupsArray = (groups) => {
  // if one of the property undefined/null - don't send item
  return groups.filter(item => !Object.values(item).includes(undefined) && !Object.values(item).includes(null))
}

export const getAddressesArray = (addresses) => {
  // if 'address' is empty - don't send item
  var result = addresses.filter(item => !!item.address).map(({address2, ...item}) => {
    if(address2)
    {
      if(item.title === 'office' && item.address)
      {
        return {
          ...item,
          address: `${address2}`,
          company_name: item.address
        }
      }
      else return {
          ...item,
          address: `${item.address}\n${address2}`,
        }
    }
    return item
  })
  return result;
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
          dob: moment(dob,'DD-MM-YYYY').format(DATE_FORMAT)
        } : {},
      },
      addresses: getAddressesArray(addresses),
      ...(reminders && reminders!== undefined) ?
      {
        reminders: getRemindersArray(reminders),
      }:{},
      groups: getGroupsArray(groups),
    },
    token,
    success: (res) => {
      const changedAddForm = false;
      dispatch({type:SET_ADD_EDITFORM,changedAddForm});

      dispatch({type: ADD_CONTACT_SUCCESS, res})
      if (form) form.resetFields()
      if (callback) callback(res.data)
      var newrecipient = [res.data.id];
      dispatch({type:SET_NEW_RECIPIENT,newrecipient})
    },
    failure: (res) => {
      dispatch({type: ADD_CONTACT_FAILURE})
      const {formErrors} = getFormErrors({...res, values})
      if (formErrors)
      {
        try{
          form.setFields(formErrors)
        }
        catch(e){
          message.error('Something went wrong. Please try again.')
        }
      }
      else
        message.error('Something went wrong. Please try again.')
    }
  })
}
export const setChangingStatusEditForm = (changedForm) => (dispatch, getState, {fetch, history}) => {
  dispatch({type:SET_CHANGE_EDITFORM,changedForm});
}
export const setChangingStatusAddForm = (changedAddForm) => (dispatch, getState, {fetch, history}) => {
  dispatch({type:SET_ADD_EDITFORM,changedAddForm});
}
export const editContact = (values, form, redrict,callback) => (dispatch, getState, {fetch, history}) => {
  const {intl} = dispatch(getIntl());
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
    success: (res) => {
      dispatch({type: EDIT_CONTACT_SUCCESS})
      
      if(callback == null && getState().contacts.changedForm === true)
      {
        message.success(intl.formatMessage(formMessages.updated_contact),redrict)
      }

      const changedForm = false;
      dispatch({type:SET_CHANGE_EDITFORM,changedForm});

      if(redrict)
      {
        //on Edit Contact Page
        dispatch(navigateToNextRouteName(redrict));
      }
      else{
        if(callback)
          callback();
        else dispatch(navigateToNextRouteName(generateUrl(CONTACTS_ROUTE)));
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

export const removeContact = (contact,noRefresh) => (dispatch, getState, {fetch}) => {
  dispatch({type: REMOVE_CONTACT_REQUEST})
  const {token} = dispatch(getToken())
  const {ordering, search} = getState().contacts;

  return fetch(`/contacts/${contact.id}`, {
    method: 'DELETE',
    token,
    success: () => {
      dispatch({type: REMOVE_CONTACT_SUCCESS})
      dispatch(getContacts({ordering, search}))
      if(noRefresh)
      {

      }
      else dispatch(navigateToNextRouteName(generateUrl(CONTACTS_ROUTE)));
    },
    failure: () => dispatch({type: REMOVE_CONTACT_FAILURE}),
  })
}

export const getOccasions = ({search} = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_OCCASIONS_REQUEST})
  const {token} = dispatch(getToken())
 
  const {setupBirthday} = getState().contacts;
  /*
  var url = `/occasions?${qs.stringify({
    //take: 10,
    ...search ? {
      filter_key: 'title',
      filter_value: search,
    } : {},
  })}`;
  
  if(setupBirthday)
  */
  var url = `/occasions?filter_key=title&filter_value=Birthday&not_equal`;
 
  return fetch(url, {
    method: 'GET',
    token,
    success: (res) => {
      const occasions = res.data.filter(item =>{
        const title = item.title;//.toUpperCase();
        return title !== 'PERSONAL DESIGN' &&
        title !== 'SEASONAL' &&
        title !== 'Persönliches Design' &&
        title !== 'SAISONAL' ;
      }).sort((a,b)=>{return a.id-b.id});
      
      dispatch({type: GET_OCCASIONS_SUCCESS, occasions})
    },
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
      const maps = data.contacts.map(item => {
        let ret = item;
        for(var key in item)
        {
          if(item[key] && typeof item[key] === 'object' && item[key].hasOwnProperty('date'))
          {
            ret[key] = moment(item[key].date).format(DATE_FORMAT);
          }
        }
        return ret;
      });
      dispatch({type: UPLOAD_CONTACTS_SUCCESS, uploadedContacts: maps})
      if (data.db_columns) {
        dispatch({type: MAPPING_COLUMNS, mappingColumns: data})
      }
    },
    failure: () => dispatch({type: UPLOAD_CONTACTS_FAILURE}),
  })
}
const validateContact = (title,street,city,country,postal_code,form,intl) =>{
  if(street == null && (city || country || postal_code))
  {
    /*
    form.setFields({
      ...(title ==='office') ?
      {office_street: {
        errors: [new Error(intl.formatMessage(formMessages.required))],
      }} :
      {home_street: {
        errors: [new Error(intl.formatMessage(formMessages.required))],
      }},
    });
    */
    message.error(title+" street column isn't complete.")
    return false;
  }
  if(street && (street+'').length < 5)
  {
    /*
    form.setFields({
      ...(title ==='office') ?
      {office_street: {
        errors: [new Error(intl.formatMessage(formMessages.minLength, { length: 5 }))],
      }} :
      {home_street: {
        errors: [new Error(intl.formatMessage(formMessages.minLength, { length: 5 }))],
      }},
    });
    */
    message.error(title+" street column isn't complete. " +intl.formatMessage(formMessages.minLength, { length: 5 }))
    return false;
  }
  if(!city || (city+'').length < 1)
  {
    /*
    form.setFields({
      ...(title ==='office') ?
      {office_city: {
        errors: [new Error(intl.formatMessage(formMessages.minLength, { length: 1 }))],
      }} :
      {home_city: {
        errors: [new Error(intl.formatMessage(formMessages.minLength, { length: 1 }))],
      }},
    });
    */
    message.error(title+" city column isn't complete. ")
    return false;
  }
  if(!country || (country+'').length < 1)
  {
    /*
    form.setFields({
      ...(title ==='office') ?
      {office_country: {
        errors: [new Error(intl.formatMessage(formMessages.minLength, { length: 1 }))],
      }} :
      {home_country: {
        errors: [new Error(intl.formatMessage(formMessages.minLength, { length: 1 }))],
      }},
    });
    */
    message.error(title+" city column isn't complete. ")
    return false;
  }
  if(!postal_code ||(postal_code+'').length < 1)
  {
    /*
    form.setFields({
      ...(title ==='office') ?
      {office_postal_code: {
        errors: [new Error(intl.formatMessage(formMessages.minLength, { length: 1 }))],
      }} :
      {home_postal_code: {
        errors: [new Error(intl.formatMessage(formMessages.minLength, { length: 1 }))],
      }},
    });
    */
    message.error(title+" postal_code column isn't complete. ")
    return false;
  }
  return true;
}
export const importContacts = (columnsMapping,form,intl, callback) => (dispatch, getState, {fetch}) => {
  dispatch({type: IMPORT_CONTACTS_REQUEST})
  const {token} = dispatch(getToken())
  const {uploadedContacts, selectedContacts} = getState().contacts
  // TODO modify contacts obj for vcf/xls
  let err = null;
  const contacts = uploadedContacts
    .filter((contact, i) => selectedContacts.includes(i))
    .map(contact => {
      const {company, home_street, home_city, home_country, home_postal_code, office_street, office_city, office_country, office_postal_code, ...otherFields} = mapValues(columnsMapping, (value) => contact[value] !== undefined ? contact[value] : null)
      let addresses = [];
      if(otherFields.first_name === null || otherFields.first_name === undefined)
      {
        err = 'first name invalid'; 
        /*
        form.setFields({
          first_name: {
            errors: [new Error(intl.formatMessage(formMessages.required))],
          } 
        });
        */
       message.error("first name column isn't complete. ")
      }
      if(otherFields.last_name === null || otherFields.last_name === undefined)
      {
        err = 'last name invalid'; 
        /*
        form.setFields({
          last_name: {
            errors: [new Error(intl.formatMessage(formMessages.required))],
          } 
        });
        */
        message.error("last name column isn't complete. ")
      }
      if(home_street || home_city || home_country || home_postal_code)
      {
        if(!validateContact('home',home_street , home_city , home_country , home_postal_code, form, intl))
          err = 'Home invalid'; 
        addresses.push({address:home_street, city:home_city, country:home_country, postal_code:home_postal_code, title:'home'})
      }
      if(office_street || office_city || office_country || office_postal_code)
      {
        if(company === null)
          err = 'Company invalid'; 
        if(!validateContact('office',office_street , office_city , office_country , office_postal_code, form, intl))
          err = 'Office invalid'; 
        addresses.push({address:office_street, city:office_city, country:office_country, postal_code:office_postal_code,company_name:company, title:'office'})
      }
      else {
        if(company)
        {
          /*
          form.setFields({
            office_street: {
              errors: [new Error(intl.formatMessage(formMessages.required))],
            }
          });
          */
          message.error("Company Name column isn't complete. ")
          err = 'Company invalid'; 
        }
      }
      return {...otherFields, addresses}
    })
  
  if(err)
  {
    return ;
  }
  
  return fetch(`/contact/import-final`, {
    method: 'POST',
    body: {
      contacts,
    },
    token,
    success: (res) => {
      console.log('res',res);
      dispatch({type: IMPORT_CONTACTS_SUCCESS})

      var newrecipient = res.data
      .filter(item => item.imported)
      .map(item => item.id);
      
      dispatch({type:SET_NEW_RECIPIENT,newrecipient})
      if(callback)
        callback(newrecipient)
    },
    failure: (err) => {
      if(callback)
        callback(null);
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
export const getReminderDate = (date,recurring,callback) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  return fetch(`/get-reminder-date?${qs.stringify({
    date,
    recurring : recurring!=='1' ? recurring :null
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      if(callback)
      {
        callback(res.data);
      }
    },
    failure: (err) => {
      if(err.errors && err.errors.recurring)
      {
        message.error(err.errors.recurring[0])
      }
      else showErrorMessage(err.errors);
    },
  })
}
export const openUploadedContactsModal = () => ({type: OPEN_UPLOADED_CONTACTS_MODAL})

export const closeUploadedContactsModal = () => ({type: CLOSE_UPLOADED_CONTACTS_MODAL})

export const changeSelectedContacts = (selectedContacts) => (dispatch, getState) => {
  dispatch({type: CHANGE_SELECTED_CONTACTS, selectedContacts})
}
export const createReminder = (params) => (dispatch, getState, {fetch}) => {
  const {contact} = getState().contacts;
  if(contact && contact.id)
  {
    const {token} = dispatch(getToken())
    console.log(`/contact/${contact.id}/reminders`,params);
    return fetch(`/contact/${contact.id}/reminders`, {
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      body: {
        params
      },
      token,
      success: (res) => {
        console.log('res',res);
      },
      failure: (err) => {console.log('err',err)},
    })
  }
}
export const saveFields = (fields) => (dispatch, getState) => {
  dispatch({type: SAVE_FIELDS, fields})
}
export const setupBirthday = (setupBirthday) => async(dispatch, getState) => {
  await dispatch({type: SET_BIRTHDAY_SETUP, setupBirthday})
  dispatch(getOccasions());
}
export const clearMapColums =()=>({type: MAPPING_COLUMNS, mappingColumns: null})
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
    uploadedContacts: false
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
  setupBirthday: false
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
    contactsCount: total ? total:0,
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
  [UPLOAD_CONTACTS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      uploadedContacts: true,
    },
  }),
  [UPLOAD_CONTACTS_SUCCESS]: (state, {uploadedContacts}) => ({
    uploadedContacts,
    selectedContacts: uploadedContacts.map((item, i) => i),
    loading: {
      ...state.loading,
      uploadedContacts: false,
    },
  }),
  [UPLOAD_CONTACTS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      uploadedContacts: false,
    },
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
  [SET_CHANGE_EDITFORM]: (state, {changedForm}) => ({
    changedForm,
  }),
  [SET_ADD_EDITFORM]: (state, {changedAddForm}) => ({
    changedAddForm,
  }),
  [SET_BIRTHDAY_SETUP]: (state, {setupBirthday}) => ({
    setupBirthday,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
