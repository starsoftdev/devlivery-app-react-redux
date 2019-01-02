import createReducer, { RESET_STORE } from '../createReducer'
import { loginSuccess } from './login'
import { message } from 'antd'
import {
  AUTH_PURCHASE_FLOW,
  DONATION_ROUTE,
  EDIT_BUNDLE_FLOW,
  ORDER_BUNDLE_FLOW,
  ORDER_VOUCHER_FLOW,
  ORDER_CARD_FLOW,
  AUTH_ORDER_CARD_FLOW,
  PURCHASE8_ROUTE,//Select Gift
  PURCHASE_FLOW,
  VOUCHER_ROUTE,
  GIFT_PURCHASE_FLOW,
  AUTH_GIFT_PURCHASE_FLOW,
  PURCHASE11_ROUTE,
  PAYMENT_FLOW
} from '../routes'
import { generateUrl } from '../router'
import qs from 'query-string'
import { getToken,GET_ALLCARDS_REQUEST, getAllCards} from './user'
import { CARD_SIZES, DATE_FORMAT, DEFAULT_OCCASION_TYPE, DONATION_TYPE, VOUCHER_TYPE } from '../constants'
import has from 'lodash/has'
import { getFormErrors, showErrorMessage } from '../utils'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import uniq from 'lodash/uniq'
import moment from 'moment'
import localStorage from 'localStorage';
import {INDIVIDUAL_ACCOUNT} from './register';
import {getIntl} from './intl';
import formMessages from '../formMessages'

// ------------------------------------
// Constants
// ------------------------------------
export const HANDWRITTEN = 'handwritten'
export const PRINTED = 'printed'

export const ADD_CONTACT_MANUALLY = 'add-contacts-manually'
export const IMPORT_CONTACTS = 'import-contacts'
export const SELECT_CONTACTS = 'select-contacts'
export const SELECT_GROUPS = 'select-groups'

export const PAYPAL = 'PAYPAL'
export const CREDIT_CARD = 'CREDIT_CARD'
export const BITPAY = 'BITPAY'
export const INVOICE = 'INVOICE'

export const SET_BUNDLE = 'Purchase.SET_BUNDLE'
export const SET_FLOW = 'Purchase.SET_FLOW'
export const SET_FLOW_INDEX = 'Purchase.SET_FLOW_INDEX'
export const SET_OCCASION = 'Purchase.SET_OCCASION'
export const SET_LETTERING_TECHNIQUE = 'Purchase.SET_LETTERING_TECHNIQUE'
export const SET_CARD_STYLE = 'Purchase.SET_CARD_STYLE'
export const SET_CARD_SIZE = 'Purchase.SET_CARD_SIZE'
export const SET_CARD = 'Purchase.SET_CARD'
export const SET_CARD_DETAILS = 'Purchase.SET_CARD_DETAILS'
export const SET_GIFT_TYPE = 'Purchase.SET_GIFT_TYPE'
export const CONTINUE_WITHOUT_GIFT = 'Purchase.CONTINUE_WITHOUT_GIFT'
export const SET_GIFT = 'Purchase.SET_GIFT'
export const SET_GIFTIDS = 'Purchase.SET_GIFTIDS'
export const SET_PAYMENT_METHOD = 'Purchase.SET_PAYMENT_METHOD'

export const GET_OCCASIONS_REQUEST = 'Purchase.GET_OCCASIONS_REQUEST'
export const GET_OCCASIONS_SUCCESS = 'Purchase.GET_OCCASIONS_SUCCESS'
export const GET_OCCASIONS_FAILURE = 'Purchase.GET_OCCASIONS_FAILURE'

export const GET_OCCASION_TYPES_REQUEST = 'Purchase.GET_OCCASION_TYPES_REQUEST'
export const GET_OCCASION_TYPES_SUCCESS = 'Purchase.GET_OCCASION_TYPES_SUCCESS'
export const GET_OCCASION_TYPES_FAILURE = 'Purchase.GET_OCCASION_TYPES_FAILURE'

export const GET_CARD_STYLES_REQUEST = 'Purchase.GET_CARD_STYLES_REQUEST'
export const GET_CARD_STYLES_SUCCESS = 'Purchase.GET_CARD_STYLES_SUCCESS'
export const GET_CARD_STYLES_FAILURE = 'Purchase.GET_CARD_STYLES_FAILURE'

export const GET_CARDS_REQUEST = 'Purchase.GET_CARDS_REQUEST'
export const GET_CARDS_SUCCESS = 'Purchase.GET_CARDS_SUCCESS'
export const GET_CARDS_FAILURE = 'Purchase.GET_CARDS_FAILURE'

export const GET_GIFTS_REQUEST = 'Purchase.GET_GIFTS_REQUEST'
export const GET_GIFTS_SUCCESS = 'Purchase.GET_GIFTS_SUCCESS'
export const GET_GIFTS_FAILURE = 'Purchase.GET_GIFTS_FAILURE'

export const REGISTER_REQUEST = 'Purchase.REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'Purchase.REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'Purchase.REGISTER_FAILURE'

export const ADD_BUNDLE_REQUEST = 'Purchase.ADD_BUNDLE_REQUEST'
export const ADD_BUNDLE_SUCCESS = 'Purchase.ADD_BUNDLE_SUCCESS'
export const ADD_BUNDLE_FAILURE = 'Purchase.ADD_BUNDLE_FAILURE'

export const MAKE_ORDER_REQUEST = 'Purchase.MAKE_ORDER_REQUEST'
export const MAKE_ORDER_SUCCESS = 'Purchase.MAKE_ORDER_SUCCESS'
export const MAKE_ORDER_FAILURE = 'Purchase.MAKE_ORDER_FAILURE'

export const MAKE_STRIPE_PAYMENT_REQUEST = 'Purchase.MAKE_STRIPE_PAYMENT_REQUEST'
export const MAKE_STRIPE_PAYMENT_SUCCESS = 'Purchase.MAKE_STRIPE_PAYMENT_SUCCESS'
export const MAKE_STRIPE_PAYMENT_FAILURE = 'Purchase.MAKE_STRIPE_PAYMENT_FAILURE'

export const MAKE_PAYPAL_PAYMENT_REQUEST = 'Purchase.MAKE_PAYPAL_PAYMENT_REQUEST'
export const MAKE_PAYPAL_PAYMENT_SUCCESS = 'Purchase.MAKE_PAYPAL_PAYMENT_SUCCESS'
export const MAKE_PAYPAL_PAYMENT_FAILURE = 'Purchase.MAKE_PAYPAL_PAYMENT_FAILURE'

export const EXECUTE_PAYPAL_PAYMENT_REQUEST = 'Purchase.EXECUTE_PAYPAL_PAYMENT_REQUEST'
export const EXECUTE_PAYPAL_PAYMENT_SUCCESS = 'Purchase.EXECUTE_PAYPAL_PAYMENT_SUCCESS'
export const EXECUTE_PAYPAL_PAYMENT_FAILURE = 'Purchase.EXECUTE_PAYPAL_PAYMENT_FAILURE'

export const CANCEL_PAYPAL_PAYMENT_REQUEST = 'Purchase.CANCEL_PAYPAL_PAYMENT_REQUEST'
export const CANCEL_PAYPAL_PAYMENT_SUCCESS = 'Purchase.CANCEL_PAYPAL_PAYMENT_SUCCESS'
export const CANCEL_PAYPAL_PAYMENT_FAILURE = 'Purchase.CANCEL_PAYPAL_PAYMENT_FAILURE'

export const MAKE_BITPAY_PAYMENT_REQUEST = 'Purchase.MAKE_BITPAY_PAYMENT_REQUEST'
export const MAKE_BITPAY_PAYMENT_SUCCESS = 'Purchase.MAKE_BITPAY_PAYMENT_SUCCESS'
export const MAKE_BITPAY_PAYMENT_FAILURE = 'Purchase.MAKE_BITPAY_PAYMENT_FAILURE'

export const GET_DONATION_ORGS_REQUEST = 'Purchase.GET_DONATION_ORGS_REQUEST'
export const GET_DONATION_ORGS_SUCCESS = 'Purchase.GET_DONATION_ORGS_SUCCESS'
export const GET_DONATION_ORGS_FAILURE = 'Purchase.GET_DONATION_ORGS_FAILURE'

export const SET_DONATION_ORG = 'Purchase.SET_DONATION_ORG'
export const SUBMIT_DONATION = 'Purchase.SUBMIT_DONATION'

export const CONFIRM_DONATION_REQUEST = 'Purchase.CONFIRM_DONATION_REQUEST'
export const CONFIRM_DONATION_SUCCESS = 'Purchase.CONFIRM_DONATION_SUCCESS'
export const CONFIRM_DONATION_FAILURE = 'Purchase.CONFIRM_DONATION_FAILURE'

export const GET_CARD_COLORS_REQUEST = 'Purchase.GET_CARD_COLORS_REQUEST'
export const GET_CARD_COLORS_SUCCESS = 'Purchase.GET_CARD_COLORS_SUCCESS'
export const GET_CARD_COLORS_FAILURE = 'Purchase.GET_CARD_COLORS_FAILURE'

export const ADD_CARD_BODY_REQUEST = 'Purchase.ADD_CARD_BODY_REQUEST'
export const ADD_CARD_BODY_SUCCESS = 'Purchase.ADD_CARD_BODY_SUCCESS'
export const ADD_CARD_BODY_FAILURE = 'Purchase.ADD_CARD_BODY_FAILURE'

export const SUBMIT_VOUCHER = 'Purchase.SUBMIT_VOUCHER'

export const CONFIRM_VOUCHER_REQUEST = 'Purchase.CONFIRM_VOUCHER_REQUEST'
export const CONFIRM_VOUCHER_SUCCESS = 'Purchase.CONFIRM_VOUCHER_SUCCESS'
export const CONFIRM_VOUCHER_FAILURE = 'Purchase.CONFIRM_VOUCHER_FAILURE'

export const GET_DELIVERY_LOCATIONS_REQUEST = 'Purchase.GET_DELIVERY_LOCATIONS_REQUEST'
export const GET_DELIVERY_LOCATIONS_SUCCESS = 'Purchase.GET_DELIVERY_LOCATIONS_SUCCESS'
export const GET_DELIVERY_LOCATIONS_FAILURE = 'Purchase.GET_DELIVERY_LOCATIONS_FAILURE'

export const GET_DELIVERY_OCCASIONS_REQUEST = 'Purchase.GET_DELIVERY_OCCASIONS_REQUEST'
export const GET_DELIVERY_OCCASIONS_SUCCESS = 'Purchase.GET_DELIVERY_OCCASIONS_SUCCESS'
export const GET_DELIVERY_OCCASIONS_FAILURE = 'Purchase.GET_DELIVERY_OCCASIONS_FAILURE'

export const SUBMIT_SHIPPING_REQUEST = 'Purchase.SUBMIT_SHIPPING_REQUEST'
export const SUBMIT_SHIPPING_SUCCESS = 'Purchase.SUBMIT_SHIPPING_SUCCESS'
export const SUBMIT_SHIPPING_FAILURE = 'Purchase.SUBMIT_SHIPPING_FAILURE'

export const GET_RECIPIENTS_REQUEST = 'Purchase.GET_RECIPIENTS_REQUEST'
export const GET_RECIPIENTS_SUCCESS = 'Purchase.GET_RECIPIENTS_SUCCESS'
export const GET_RECIPIENTS_FAILURE = 'Purchase.GET_RECIPIENTS_FAILURE'

export const GET_SHIPPINGTOTAL_REQUEST = 'Purchase.GET_SHIPPINGTOTAL_REQUEST'
export const GET_SHIPPINGTOTAL_SUCCESS = 'Purchase.GET_SHIPPINGTOTAL_SUCCESS'
export const GET_SHIPPINGTOTAL_FAILURE = 'Purchase.GET_SHIPPINGTOTAL_FAILURE'

export const GET_TEMPLATE_REQUEST = 'Purchase.GET_TEMPLATE_REQUEST'
export const GET_TEMPLATE_SUCCESS = 'Purchase.GET_TEMPLATE_SUCCESS'
export const GET_TEMPLATE_FAILURE = 'Purchase.GET_TEMPLATE_FAILURE'

export const ADD_RECIPIENTS_REQUEST = 'Purchase.ADD_RECIPIENTS_REQUEST'
export const ADD_RECIPIENTS_SUCCESS = 'Purchase.ADD_RECIPIENTS_SUCCESS'
export const ADD_RECIPIENTS_FAILURE = 'Purchase.ADD_RECIPIENTS_FAILURE'

export const GET_ORDER_DETAILS_REQUEST = 'Purchase.GET_ORDER_DETAILS_REQUEST'
export const GET_ORDER_DETAILS_SUCCESS = 'Purchase.GET_ORDER_DETAILS_SUCCESS'
export const GET_ORDER_DETAILS_FAILURE = 'Purchase.GET_ORDER_DETAILS_FAILURE'

export const GET_BUNDLE_DETAILS_REQUEST = 'Purchase.GET_BUNDLE_DETAILS_REQUEST'
export const GET_BUNDLE_DETAILS_SUCCESS = 'Purchase.GET_BUNDLE_DETAILS_SUCCESS'
export const GET_BUNDLE_DETAILS_FAILURE = 'Purchase.GET_BUNDLE_DETAILS_FAILURE'

export const SET_FONT_FAMILIES = 'Purchase.SET_FONT_FAMILIES'

export const CLEAR = 'Purchase.CLEAR'

export const SET_NEW_RECIPIENT = 'Purchase.SET_NEW_RECIPIENT'

export const UPDATE_BUNDLE_BODY = 'Purchase.UPDATE_BUNDLE_BODY'

export const SET_SAVED_VALUE = 'Purchase.SET_SAVED_VALUE'
export const SET_ORIENTATION = 'Purchase.SET_ORIENTATION'

export const SET_RECIPIENT_MODE = 'Purchase.SET_RECIPIENT_MODE'
// ------------------------------------
// Actions
// ------------------------------------
export const ADDCONTACTMODE = 'addingContactMode'
export const setFlow = (flow, redirect = true) => (dispatch, getState, { history }) => {
  if (redirect &&
    flow.key != ORDER_BUNDLE_FLOW.key &&
    flow.key != ORDER_CARD_FLOW.key &&
    flow.key != ORDER_VOUCHER_FLOW.key &&
    flow.key != GIFT_PURCHASE_FLOW.key &&
    flow.key != AUTH_ORDER_CARD_FLOW.key &&
    flow.key != AUTH_GIFT_PURCHASE_FLOW.key &&
    flow.key != PAYMENT_FLOW.key) {
    dispatch(clear())
  }
  dispatch({ type: SET_FLOW, flow })
  if (redirect) {
    // TODO decide if flow key should be in url to fix issue when user goes back to purchase flow
    // TODO or replace history after finishing flow to prevent this situation
    history.push(generateUrl(flow.routes[0]))
  }
}

export const setBundle = (bundle) => (dispatch, getState) => {
  localStorage.clear();
  dispatch({
    type: SET_BUNDLE,
    bundle,
    letteringTechnique: bundle.lettering,
    card: bundle.bundle_card.card,
    gift: bundle.bundle_gifts[0] && bundle.bundle_gifts[0].gift,
    giftType: bundle.voucher ? VOUCHER_TYPE : bundle.bundle_gifts[0] && bundle.bundle_gifts[0].gift.type,
    cardSize: CARD_SIZES().find(item => item.key === bundle.bundle_card.card.size),
    cardSizeKey: bundle.bundle_card.card.size,
    cardStyle: bundle.bundle_card.card.style,
    orientation: bundle.bundle_card.card.orientation,
    orderId: null,
  })
  if (bundle.voucher)
    dispatch(setFlow(ORDER_VOUCHER_FLOW))
  else dispatch(setFlow(ORDER_BUNDLE_FLOW))
}
export const setFlowFromSelectCard = (card) => (dispatch, getState) => {
  dispatch(clear())
  const occasion = { id: card.occasion_id };
  dispatch({ type: SET_OCCASION, occasion })
  const cardStyle = card.style;
  dispatch({ type: SET_CARD_STYLE, cardStyle })
  const cardSize = CARD_SIZES().find(item => item.key === card.size)
  dispatch({ type: SET_CARD_SIZE, cardSize })
  dispatch({ type: SET_CARD, card })

  const {loggedIn} = getState().user
  if(loggedIn)
    dispatch(setFlow(AUTH_ORDER_CARD_FLOW))
  else  dispatch(setFlow(ORDER_CARD_FLOW))
  
}
export const setFlowFromSelectGift = (gift) => (dispatch, getState) => {
  dispatch(clear())
  const giftType = gift.type;
  dispatch({ type: SET_GIFT_TYPE, giftType })
  dispatch({ type: SET_GIFT, gift })
  dispatch(setFlow(GIFT_PURCHASE_FLOW))
}
export const setFlowPayment = (order) => (dispatch, getState) => {
  dispatch(clear())
  dispatch({ type: MAKE_ORDER_SUCCESS, order })
  dispatch(setFlow(PAYMENT_FLOW))
}
export const setFlowIndex = () => (dispatch, getState) => {
  const { currentRouteName } = getState().global
  const { flow } = getState().purchase
  const flowIndex = flow.routes.findIndex(item => item === currentRouteName)
  const { currentPathname, prevPathname } = getState().global;

  if (currentPathname !== prevPathname) {
    localStorage.removeItem(ADDCONTACTMODE)
  }
  dispatch({ type: SET_FLOW_INDEX, flowIndex })
}

// 'step' allows to skip number of steps
export const nextFlowStep = (step = 0) => (dispatch, getState, { history }) => {
  const { flow, flowIndex } = getState().purchase
  history.push(generateUrl(flow.routes[flowIndex + 1 + step]))
  // if step is last (except Thank You page/etc)
  if (flowIndex === flow.routes.length - 2) {
    dispatch(clear())
  }
}
export const ADDRECIPENT_MODE = 'addRecipientMode';
export const toAddContactFlowStep = () => (dispatch, getState, { history }) => {
  const recipientMode = true
  dispatch(setRecipientMode(recipientMode));
  history.push(generateUrl('purchase10'));
}
export const setRecipientMode = (recipientMode) => (dispatch, getState, { history }) => {
  dispatch({ type: SET_RECIPIENT_MODE, recipientMode: recipientMode })
  if (recipientMode)
    localStorage.setItem(ADDRECIPENT_MODE, recipientMode);
  else localStorage.removeItem(ADDRECIPENT_MODE);
}
export const getRecipientMode = () => (dispatch) => {
  const recipientMode = localStorage.getItem(ADDRECIPENT_MODE)
  dispatch({ type: SET_RECIPIENT_MODE, recipientMode })
}
export const gotoConfirm = () => (dispatch, getState, { history }) => {
  const { flow, flowIndex } = getState().purchase
  history.push(generateUrl(PURCHASE11_ROUTE))
  const recipientMode = null
  dispatch(setRecipientMode(recipientMode));
}
export const setSavedValue = (saved) => ({ type: SET_SAVED_VALUE, saved })

export const setOccasion = (occasion) => ({ type: SET_OCCASION, occasion })

export const getOccasions = (params = {}) => (dispatch, getState, { fetch }) => {
  dispatch({ type: GET_OCCASIONS_REQUEST, params })
  const { occasionType } = getState().purchase
  
  return fetch(`/occasions?${qs.stringify({
    take: 100,
    order_by: params && params.locale == params.defaultLocale ? 'title' : 'german_title',
    ...occasionType ? {
      filter_key: 'type',
      filter_value: occasionType,
    } : {},
  })}`, {
      method: 'GET',
      success: (res) => {
        dispatch({ type: GET_OCCASIONS_SUCCESS, occasions: res.data })
      },
      failure: (err) => {
        dispatch({ type: GET_OCCASIONS_FAILURE })
      }
    })
}

export const getOccasionTypes = () => (dispatch, getState, { fetch }) => {
  dispatch({ type: GET_OCCASION_TYPES_REQUEST })
  return fetch(`/occasion-types`, {
    method: 'GET',
    success: (res) => dispatch({ type: GET_OCCASION_TYPES_SUCCESS, occasionTypes: res.data }),
    failure: () => {
      dispatch({ type: GET_OCCASION_TYPES_FAILURE })
    }
  })
}

export const setLetteringTechnique = (letteringTechnique) => (dispatch, getState, { fetch }) => {
  const {bundleId} = getState().purchase;
  if(bundleId && letteringTechnique)
  {
    dispatch(updateBundle({lettering: letteringTechnique, _method :'PUT'}));
  }
  ({ type: SET_LETTERING_TECHNIQUE, letteringTechnique })
}

export const getCardStyles = () => (dispatch, getState, { fetch }) => {
  dispatch({ type: GET_CARD_STYLES_REQUEST })
  return fetch(`/card-styles`, {
    method: 'GET',
    success: (res) => dispatch({ type: GET_CARD_STYLES_SUCCESS, cardStyles: res.data }),
    failure: () => dispatch({ type: GET_CARD_STYLES_FAILURE })
  })
}

export const getMessageTemplate = () => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: GET_TEMPLATE_REQUEST })
  return fetch(`/message-templates`, {
    method: 'GET',
    token,
    success: (templates) => dispatch({ type: GET_TEMPLATE_SUCCESS, templates }),
    failure: () => dispatch({ type: GET_TEMPLATE_FAILURE })
  })
}

export const getRecipients = () => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: GET_RECIPIENTS_REQUEST })
  return fetch(`/view-contacts`, {
    method: 'GET',
    token,
    success: (recipients) => dispatch({ type: GET_RECIPIENTS_SUCCESS, recipients }),
    failure: () => dispatch({ type: GET_RECIPIENTS_FAILURE })
  })
}


export const GROUP_ID_KEY = 'group_id'
export const CONTACT_IDS_KEY = 'contacts_id'

export const addRecipientsOrder = (orderId) => (dispatch, getState, { fetch }) => {
  //dispatch({type: ADD_RECIPIENTS_REQUEST})
  const { token } = dispatch(getToken())
  const { newrecipient } = getState().purchase
  if (newrecipient.length <= 0) {
    return
  }
  localStorage.setItem(CONTACT_IDS_KEY, JSON.stringify(newrecipient));
  return fetch(`/order/${orderId}/update-recipients`, {
    method: 'POST',
    contentType: 'application/json',
    token,
    accept: 'application/json',
    body: {
      contacts: newrecipient,
    },
    success: (res) => {
      dispatch(getOrderDetails(orderId));
      //dispatch({type: ADD_RECIPIENTS_SUCCESS})
    },
    failure: (err) => {
      //dispatch({type: ADD_RECIPIENTS_FAILURE})
    }
  })
  /*
  return fetch(`/order-recipients`, {
    method: 'POST',
    contentType: 'application/json',
    token,
    body: {
      order_id: orderId,
      contacts: newrecipient,
    },
    success: (res) => {
      dispatch(getOrderDetails(orderId));
      //dispatch({type: ADD_RECIPIENTS_SUCCESS})
    },
    failure: (err) => {
      //dispatch({type: ADD_RECIPIENTS_FAILURE})
    }
  })
  */
}
export const removeRecipientsOrder = (repId) => (dispatch, getState, { fetch }) => {
  //dispatch({type: ADD_RECIPIENTS_REQUEST})
  const { token } = dispatch(getToken())
  const { orderId } = getState().purchase
  return fetch(`/order-recipients/${repId}`, {
    method: 'POST',
    contentType: 'multipart/form-data',
    token,
    body: {
      _method: 'DELETE',
    },
    success: async (res) => {
      await dispatch(getOrderDetails(orderId));
      await dispatch(getDeliveryOccasions(orderId))
      //dispatch({type: ADD_RECIPIENTS_SUCCESS})
    },
    failure: (err) => {
      //dispatch({type: ADD_RECIPIENTS_FAILURE})
      showErrorMessage(err);
    }
  })
}
export const setCardStyle = (cardStyle) => ({ type: SET_CARD_STYLE, cardStyle })

export const getCards = (params = {}) => (dispatch, getState, { fetch }) => {
  dispatch({ type: GET_CARDS_REQUEST, params })
  const { occasionId, cardStyle, cardColor, cardSizeKey } = getState().purchase
  return fetch(`/cards?${qs.stringify({
    take: 100,
    filters: JSON.stringify({
      ...occasionId ? {
        occasion_id: occasionId,
      } : {},
      ...cardColor ? {
        color: cardColor,
      } : {},
      ...cardStyle ? {
        style: cardStyle,
      } : {},
      ...cardSizeKey ? {
        size: cardSizeKey
      } : {}
    })
  })}`, {
      method: 'GET',
      success: (res) => {
        dispatch({ type: GET_CARDS_SUCCESS, cards: res.data })
      },
      failure: () => dispatch({ type: GET_CARDS_FAILURE })
    })
}

export const setCardSize = (cardSize) => ({ type: SET_CARD_SIZE, cardSize })

export const CARDDETAILS = "card_details";
export const submitCardDetails = (cardDetails, stayPage) => async (dispatch, getState) => {
  localStorage.setItem(CARDDETAILS, JSON.stringify(cardDetails));
  if(stayPage)
    return;
  dispatch({ type: SET_CARD_DETAILS, cardDetails })
  const { bundle, flow } = getState().purchase;
  if (bundle && bundle.id)
    dispatch({ type: UPDATE_BUNDLE_BODY, cardDetails })

  if (flow.key === GIFT_PURCHASE_FLOW.key || flow.key === AUTH_GIFT_PURCHASE_FLOW.key) {
    await dispatch(addBundle())
    dispatch(nextFlowStep())
  }
  else
    dispatch(nextFlowStep())
}
export const loadCardDetails = () => async (dispatch, getState) => {
  var cardDetails = await localStorage.getItem(CARDDETAILS);
  cardDetails = JSON.parse(cardDetails)
  dispatch({ type: SET_CARD_DETAILS, cardDetails })
}

export const setGiftType = (giftType) => (dispatch, getState, { fetch }) => {
  dispatch({ type: SET_GIFT_TYPE, giftType })
}
export const setCard = (card) => (dispatch, getState, { fetch }) => {
  const {bundleId} = getState().purchase;
  if(bundleId && card)
  {
    const { token } = dispatch(getToken())
    fetch(`/update-bundle-card/bundle/${getState().purchase.bundleId}/card/${card.id}`, {
      method: 'POST',
      token,
      body:{},
      success: (res) => {
        console.log('res',res)
      },
      failure: (err) => { console.log('err',err)},
    })
  }
  dispatch({ type: SET_CARD, card })
}

const GIFT_IDS = 'gift_ids'
export const setGift = (gift) => (dispatch, getState, { fetch }) => {
  const {gifts,giftType} = getState().purchase;
  var giftIds = JSON.parse(JSON.stringify(getState().purchase.giftIds));
  if (giftIds.includes(gift.id)) {
    //remove gift id
    var index = giftIds.indexOf(gift.id);
    if (index > -1) {
      giftIds.splice(index, 1);
    }
    if(giftIds.length <= 0)
    {
      dispatch({ type: SET_GIFT, gift:null })
    }
    else {
      dispatch({ type: SET_GIFT, gift: gifts ? gifts.find(item=>item.id===giftIds[giftIds.length-1]):null })
    }
  }
  else {
    giftIds.push(gift.id)
    dispatch({ type: SET_GIFT, gift })
  }
  //localStorage.setItem(GIFT_IDS, JSON.stringify(giftIds))
  dispatch({ type: SET_GIFTIDS, giftIds })
}
export const buyMoreGift = () => (dispatch, getState, { fetch }) => {
  const { giftId, gifts } = getState().purchase;

  var giftIds = localStorage.getItem(GIFT_IDS);

  if (giftIds === null)
    giftIds = [];
  else {
    giftIds = JSON.parse(giftIds);
  }

  dispatch({ type: SET_GIFTIDS, giftIds })
}
export const getGifts = (params = {}, isAll) => (dispatch, getState, { fetch }) => {
  dispatch({ type: GET_GIFTS_REQUEST, params })
  const { giftType } = getState().purchase
  return fetch(`/gifts?${qs.stringify({
    take: 100,
    ...giftType && !isAll ? {
      filter_key: 'type',
      filter_value: giftType,
    } : {},
  })}`, {
      method: 'GET',
      success: (res) => {
        dispatch({ type: GET_GIFTS_SUCCESS, gifts: res.data })
      },
      failure: () => {
        dispatch({ type: GET_GIFTS_FAILURE })
      }
    })
}

export const submitShipping = (values,total,callback) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: SUBMIT_SHIPPING_REQUEST, values })
  const { deliverable, delivery_occasion, schedule_date, title } = values;
  const { orderId, deliveryTime, occasion, bundle } = getState().purchase

  const deliverOpt = {};

  if (schedule_date !== undefined && schedule_date)
    deliverOpt['delivery_date'] = moment(schedule_date).format('YYYY-MM-DD');
  else if (delivery_occasion !== undefined && delivery_occasion)
    deliverOpt['delivery_occasion'] = delivery_occasion;

  const saved = values.saved ? 1 : 0;
  dispatch({ type: SET_SAVED_VALUE, saved });
  return fetch(`/set-wheretosend`, {
    method: 'POST',
    body: {
      order_id: orderId,
      deliverable: deliverable,
      ...deliverOpt
    },
    token,
    success: (res) => {
      dispatch({ type: SUBMIT_SHIPPING_SUCCESS })
      if (saved === 1) {
        const param = {
          _method: 'PUT',
          title,
          saved
        }
        dispatch(updateBundle(param));
      }
      if(total <= 0)
        dispatch(orderConfirmWithoutPrice(callback));
      else dispatch(nextFlowStep())
    },
    failure: (err) => {
      if(callback)
      {
        callback();
      }
      showErrorMessage(err);
      dispatch({ type: SUBMIT_SHIPPING_FAILURE })
    },
  })
}
export const updateBundle = (param, callback) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  return fetch(`/bundles/${getState().purchase.bundleId}`, {
    method: 'POST',
    token,
    body: param,
    success: (res) => {
      if (callback)
        callback();
      const saved = 0;
      dispatch({ type: SET_SAVED_VALUE, saved })
    },
    failure: (err) => { },
  })
}
export const setPaymentMethod = (paymentMethod) => ({ type: SET_PAYMENT_METHOD, paymentMethod })

export const register = (values, form) => (dispatch, getState, { fetch }) => {
  dispatch({ type: REGISTER_REQUEST })
  let params = JSON.parse(JSON.stringify(values));
  if (params.phone === undefined || params.phone === null)
    delete params.phone;
  if (params.company === undefined || params.company === null)
      delete params.company;
  return fetch(`/signup`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      ...params,
      account_type: INDIVIDUAL_ACCOUNT
    },
    success: (res) => {
      dispatch({ type: REGISTER_SUCCESS })
      dispatch(loginSuccess(res.data))
      dispatch(nextFlowStep())
    },
    failure: (res) => {
      const { formErrors } = getFormErrors({ ...res, values })
      if (formErrors)
        form.setFields(formErrors)
      else
        // TODO
        message.error('Something went wrong. Please try again.')
      dispatch({ type: REGISTER_FAILURE })
    },
  })
}

export const continueWithoutGift = () => async (dispatch, getState) => {
  const { loggedIn } = getState().user
  const { flow, bundleId } = getState().purchase
 
  dispatch(setGiftType(null))
  if (loggedIn && flow.key !== EDIT_BUNDLE_FLOW.key) {
    await dispatch({ type: SET_GIFTIDS, giftIds:[] });
    if(bundleId)
      await dispatch(reset_Bundle(bundleId));
    else await dispatch(addBundle())
    //await dispatch({ type: MAKE_ORDER_SUCCESS, order: null })
  }
  dispatch(nextFlowStep(1))
}
export const reset_Bundle = (bundleId) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  if (bundleId) {
    console.log(`/bundle/${bundleId}/reset`);
    return fetch(`/bundle/${bundleId}/reset`, {
      method: 'GET',
      contentType: 'application/json',
      token,
      success: (res) => {
        dispatch({type:SUBMIT_VOUCHER, voucher:null});
        localStorage.removeItem(VOUCHER_STATE);
        dispatch(setDonationOrg(null));
        localStorage.removeItem(DONATION_STATE);
      },
      failure: (err) => {
        console.log(`/bundle/${bundleId}/reset error:` ,err);
      },
    })
  }
}
export const submitGift = (gotoNext = 0) => async (dispatch, getState) => {
  const { flow } = getState().purchase
  /*
  if (flow.key !== EDIT_BUNDLE_FLOW.key) {
    await dispatch(addBundle())
    await dispatch({ type: MAKE_ORDER_SUCCESS, order: null })
  }
  */
  await dispatch(addBundle())
  //await dispatch({ type: MAKE_ORDER_SUCCESS, order: null })
  if (gotoNext === 0) {
    dispatch(nextFlowStep())
  }
  else {
    dispatch(nextFlowStep(gotoNext))
  }
}
export const syncGifts_Bundle = (giftIds, goToNext = true) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { bundleId, orderId } = getState().purchase
  dispatch({ type: ADD_BUNDLE_REQUEST })
  if (bundleId) {
    return fetch(`/sync-bundle-gifts`, {
      method: 'POST',
      contentType: 'application/json',
      body: {
        bundle_id: bundleId,
        gift_ids: giftIds
      },
      token,
      success: (res) => {
        dispatch({ type: ADD_BUNDLE_SUCCESS, bundle: res.data })
        localStorage.setItem(GIFT_IDS, JSON.stringify(giftIds))
        dispatch({ type: SET_GIFTIDS, giftIds })
        dispatch(getOrderDetails(orderId));
      },
      failure: (err) => {
        showErrorMessage(err);
        dispatch({ type: ADD_BUNDLE_FAILURE })
      },
    })
  }
}
export const addBundle = (values = {}, goToNext = true) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { letteringTechnique, cardId, gift, giftId, flow, giftIds, saved, bundleId } = getState().purchase
  dispatch({ type: ADD_BUNDLE_REQUEST })
  
  var gift_ids = giftIds;
  /*
  if (!gift_ids.includes(giftId) && giftId) {
    gift_ids.push(giftId);
    dispatch(buyMoreGift())
  }
  */
  if (bundleId) {
    return fetch(`/sync-bundle-gifts`, {
      method: 'POST',
      contentType: 'application/json',
      body: {
        bundle_id: bundleId,
        gift_ids: gift_ids ? gift_ids : []
      },
      token,
      success: (res) => {
        dispatch({ type: ADD_BUNDLE_SUCCESS, bundle: res.data })
        if (flow.key === EDIT_BUNDLE_FLOW.key) {
          if (goToNext) {
            dispatch(nextFlowStep())
          }
        }
      },
      failure: (err) => {
        showErrorMessage(err);
        dispatch({ type: ADD_BUNDLE_FAILURE })
      },
    })
  }
  
  return fetch(`/create-bundle`, {
    method: 'POST',
    contentType: 'application/json',
    body: {
      lettering: letteringTechnique,
      card_id: cardId,
      gift_ids,
      ...(values && values.title) && {
        title: values.title
      },
      saved: 0
    },
    token,
    success: (res) => {
      dispatch({ type: ADD_BUNDLE_SUCCESS, bundle: res.data })
      if (flow.key === EDIT_BUNDLE_FLOW.key) {
        if (goToNext) {
          dispatch(nextFlowStep())
        }
      }
    },
    failure: (err) => {
      showErrorMessage(err);
      dispatch({ type: ADD_BUNDLE_FAILURE })
    },
  })
}

export const makeOrder = () => (dispatch, getState, { fetch, history }) => {
  const { token } = dispatch(getToken())
  const { bundleId, orderId, newrecipient } = getState().purchase

  if (orderId) {
    dispatch(getBundleDetails(bundleId))
    const { newrecipient } = getState().purchase
    if (newrecipient.length <= 0) {
      dispatch(getOrderDetails(orderId))
    }
    else dispatch(addRecipientsOrder(orderId))

    dispatch(getDeliveryLocations(orderId))
    dispatch(getDeliveryOccasions(orderId))
  } else {

    //dispatch({type: MAKE_ORDER_REQUEST})
    
    return fetch(`/make-order-from-bundle`, {
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      body: {
        bundle_id: parseInt(bundleId),
      },
      token,
      success: async (res) => {

        const order = res.data
        dispatch({ type: MAKE_ORDER_SUCCESS, order })
        await dispatch(addCardBody(order.id))
        await dispatch(getDeliveryLocations(order.id))
        await dispatch(addRecipientsOrder(order.id))
        await dispatch(getDeliveryOccasions(order.id))
        

        dispatch({ type: SET_ORIENTATION, orientation: order.print_orientation });
        //dispatch({type: GET_BUNDLE_DETAILS_SUCCESS, bundle: getState().purchase.cardDetails});
        await dispatch(restoreCouponFromLocal(order));
        await dispatch(recalculateTotal('shipping'));
      },
      failure: (err) => {
        history.goBack();
        //dispatch({type: MAKE_ORDER_FAILURE})
      },
    })
  }
}
export const recalculateTotal = (deliverable, callback) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { orderId } = getState().purchase
  if (orderId && deliverable ) {
    dispatch({ type: GET_SHIPPINGTOTAL_REQUEST })
    
    return fetch(`/recalculate-total`, {
      method: 'POST',
      body: {
        order_id: orderId,
        deliverable: deliverable ? deliverable : 'shipping'
      },
      token,
      success: (res) => {
        dispatch({ type: GET_SHIPPINGTOTAL_SUCCESS, shipping_cost: res.data })
        if(callback)
          return fetch(`/order-confirmation?${qs.stringify({order_id: orderId,})}`, {
              method: 'GET',
              token,
              success: (res) => {
                callback(res.data);
              },
              failure: (err) => {
                dispatch({ type: GET_ORDER_DETAILS_FAILURE })
              },
            })
      },
      failure: (err) => {
        dispatch({ type: GET_SHIPPINGTOTAL_FAILURE })
      },
    })
  }else {
    dispatch({ type: GET_SHIPPINGTOTAL_FAILURE })
  }
}
export const CouponStatus='CouponStatus';
export const restoreCouponFromLocal = (order) => (dispatch, getState, { fetch }) => {
  const coupon = localStorage.getItem(CouponStatus);
  if(coupon)
  {
    if(order.coupon && order.coupon.coupon === coupon)
    {
      return ;
    }
    dispatch(applycouponTotal(coupon, true))
  }
}
export const applycouponTotal = (coupon, hide_msg) => (dispatch, getState, { fetch }) => {
  const {intl} = dispatch(getIntl());
  const { token } = dispatch(getToken())
  const { orderId } = getState().purchase
  if (orderId) {
    dispatch({ type: GET_SHIPPINGTOTAL_REQUEST })
    
    return fetch(`/apply-coupon`, {
      method: 'POST',
      body: {
        order_id: orderId,
        coupon
      },
      token,
      success: (res) => {
        if(!hide_msg)
        {
          if(res.data && res.data.coupon && res.data.coupon.coupon)
            localStorage.setItem(CouponStatus,res.data.coupon.coupon);
          message.success(intl.formatMessage(formMessages.success_coupon));
        }
        dispatch(getOrderDetails(orderId));
        dispatch({ type: GET_SHIPPINGTOTAL_SUCCESS, shipping_cost: res.data })
      },
      failure: (err) => {
        showErrorMessage(err);
        dispatch({ type: GET_SHIPPINGTOTAL_FAILURE })
      },
    })
  }else {
    dispatch({ type: GET_SHIPPINGTOTAL_FAILURE })
  }
}
export const addCardBody = (orderId) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { cardDetails } = getState().purchase
  dispatch({ type: ADD_CARD_BODY_REQUEST })
  return fetch(`/order/add-htmls`, {
    method: 'POST',
    body: {
      order_id: orderId,
      html1: cardDetails && cardDetails.body && cardDetails.body.length > 0 ? cardDetails.body : '<p></p>',
    },
    token,
    success: (res) => {
      dispatch({ type: ADD_CARD_BODY_SUCCESS })
    },
    failure: (err) => {
      dispatch({ type: ADD_CARD_BODY_FAILURE })
    },
  })
}
export const makeDefaultStripePayment = (tokenid, callback) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { orderId } = getState().purchase
  if (!orderId && !card.ignore) {
    return
  }
  dispatch({ type: MAKE_STRIPE_PAYMENT_REQUEST })
  
  return fetch(`/payments/stripe/charge/${orderId}`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      card_id: tokenid,
    },
    token,
    success: () => {
      if (callback) {
        callback()
      }
      dispatch(nextFlowStep())
      dispatch({ type: MAKE_STRIPE_PAYMENT_SUCCESS })
    },
    failure: (err) => {
      if (callback) {
        callback()
      }
      showErrorMessage(err);
      dispatch({ type: MAKE_STRIPE_PAYMENT_FAILURE })
    },
  })
}
export const makeStripePayment = (card, isPaying = true, callback) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { orderId } = getState().purchase
  if (!orderId && !card.ignore) {
    return
  }
  dispatch({ type: MAKE_STRIPE_PAYMENT_REQUEST })
  dispatch({ type: GET_ALLCARDS_REQUEST})
  const {
    number,
    expiry_month,
    expiry_year,
    cvc,
  } = card
  const { stripeApiKey } = getState().global
  
  return fetch('https://api.stripe.com/v1/tokens', {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    headers: {
      Authorization: `Bearer ${stripeApiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      'card[number]': number,
      'card[exp_month]': expiry_month,
      'card[exp_year]': expiry_year,
      'card[cvc]': cvc,
    },
    token,
    success: (stripeToken) => {
      if (callback && !isPaying) {
        callback(stripeToken)
        return;
      }
      return fetch(`/payments/stripe/charge/${orderId}`, {
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        body: {
          stripeToken: stripeToken.id,
        },
        token,
        success: () => {
          if (callback) {
            callback(stripeToken)
          }
          dispatch(nextFlowStep())
          dispatch({ type: MAKE_STRIPE_PAYMENT_SUCCESS })
        },
        failure: (err) => {
          if (callback) {
            callback(null)
          }
          showErrorMessage(err)
          dispatch({ type: MAKE_STRIPE_PAYMENT_FAILURE })
          dispatch(getAllCards());
        },
      })
    },
    failure: (error) => {
      if (callback) {
        callback(error)
      }
      dispatch({ type: MAKE_STRIPE_PAYMENT_FAILURE })
      dispatch(getAllCards());
      if (error && error.error && error.error.message) {
        message.error(error.error.message)
      }
    }
  })
}

const TRANSACTION_ID_KEY = 'transaction_id'
const ORDER_ID_KEY = 'order_id'

export const makePaypalPayment = () => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { orderId } = getState().purchase
  if (!orderId) {
    return
  }

  dispatch({ type: MAKE_PAYPAL_PAYMENT_REQUEST })
  return fetch(`/payments/paypal/charge/${orderId}`, {
    method: 'POST',
    token,
    success: (res) => {
      const { approval_url, transaction_id } = res.data
      localStorage.setItem(ORDER_ID_KEY, orderId)
      localStorage.setItem(TRANSACTION_ID_KEY, transaction_id)
      window.location = approval_url
      dispatch({ type: MAKE_PAYPAL_PAYMENT_SUCCESS })
    },
    failure: (error) => {
      dispatch({ type: MAKE_PAYPAL_PAYMENT_FAILURE })
      if (error && error.error && error.error.message) {
        message.error(error.error.message)
      }
    },
  })
}
export const makeInvoicePayment = () => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { orderId } = getState().purchase
  if (!orderId) {
    return
  }
  
  return fetch(`/order/${orderId}/pay_by_invoice`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch(nextFlowStep());
    },
    failure: (error) => {
      if (error && error.error && error.error.message) {
        message.error(error.error.message)
      }
      dispatch(nextFlowStep(-2));
    },
  })
}
const returnToPaymentMethod = (keepOrder) => (dispatch, getState, { history }) => {
  const orderId = localStorage.getItem(ORDER_ID_KEY)
  dispatch({ type: MAKE_ORDER_SUCCESS, order: { id: orderId } })
  if (!keepOrder) {
    localStorage.removeItem(ORDER_ID_KEY)
  }
  localStorage.removeItem(TRANSACTION_ID_KEY)
  // let user choose another payment method or try again
  history.push('/purchase/payment-method')
}
export const orderConfirmWithoutPrice = (callback) => (dispatch, getState, { fetch,history }) => {
  const { token } = dispatch(getToken())
  const { orderId } = getState().purchase;
  if (!orderId) {
    return
  }
  
  return fetch(`/order/${orderId}/confirm`, {
    method: 'GET',
    token,
    success: (res) => {
      localStorage.removeItem(TRANSACTION_ID_KEY)
      localStorage.removeItem(ORDER_ID_KEY)
      history.push('/purchase/completed')
    },
    failure: (err) => { 
      showErrorMessage(err);
      if(callback)
        callback();
    },
  })
}
export const executePaypalPayment = ({ paymentId, paypalToken, payerId }) => async (dispatch, getState, { fetch, history }) => {
  const {intl} = dispatch(getIntl());
  const { token } = dispatch(getToken())
  const transactionId = await localStorage.getItem(TRANSACTION_ID_KEY)
  if (!transactionId) {
    message.error(intl.formatMessage(formMessages.error_transactionid));
    dispatch(returnToPaymentMethod(true))
    dispatch({ type: CANCEL_PAYPAL_PAYMENT_SUCCESS })
    return
  }
  dispatch({ type: EXECUTE_PAYPAL_PAYMENT_REQUEST })
  
  return fetch('/payments/paypal/execute', {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      transaction_id: transactionId,
      token: paymentId,
      paymentId,
      payerId,
    },
    token,
    success: (res) => {
      localStorage.removeItem(TRANSACTION_ID_KEY)
      localStorage.removeItem(ORDER_ID_KEY)
      history.push('/purchase/completed')
      dispatch({ type: EXECUTE_PAYPAL_PAYMENT_SUCCESS })
    },
    failure: (err) => {
      
      showErrorMessage(err);
      dispatch(returnToPaymentMethod())
      dispatch({ type: EXECUTE_PAYPAL_PAYMENT_FAILURE })
    },
  })
}

export const cancelPaypalPayment = () => (dispatch, getState, { fetch, history }) => {
  const { token } = dispatch(getToken())
  const transactionId = localStorage.getItem(TRANSACTION_ID_KEY)
  if (!transactionId) {
    dispatch(returnToPaymentMethod(true))
    dispatch({ type: CANCEL_PAYPAL_PAYMENT_SUCCESS })
    return
  }
  dispatch({ type: CANCEL_PAYPAL_PAYMENT_REQUEST })
  return fetch('/payments/paypal/cancel', {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      transaction_id: transactionId,
    },
    token,
    success: (res) => {
      dispatch(returnToPaymentMethod(true))
      dispatch({ type: CANCEL_PAYPAL_PAYMENT_SUCCESS })
    },
    failure: () => {
      dispatch(returnToPaymentMethod(true))
      dispatch({ type: CANCEL_PAYPAL_PAYMENT_FAILURE })
    },
  })
}

export const makeBitpayPayment = () => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { orderId } = getState().purchase
  if (!orderId) {
    return
  }
  dispatch({ type: MAKE_BITPAY_PAYMENT_REQUEST })
  return fetch(`/payments/bitpay/charge/${orderId}`, {
    method: 'POST',
    token,
    success: (res) => {
      // redirect to bitpay payment page
      window.location = res.data.approval_url
      dispatch({ type: MAKE_BITPAY_PAYMENT_SUCCESS })
    },
    failure: () => {
      dispatch({ type: MAKE_BITPAY_PAYMENT_FAILURE })
    },
  })
}

export const getDonationOrgs = (params = {}) => (dispatch, getState, { fetch }) => {
  dispatch({ type: GET_DONATION_ORGS_REQUEST, params })
  const { token } = dispatch(getToken())
  const { doPage, doPageSize } = getState().purchase
  return fetch(`/donation?${qs.stringify({
    page: doPage,
    per_page: doPageSize,
  })}`, {
      method: 'GET',
      token,
      success: (res) => {
        dispatch({ type: GET_DONATION_ORGS_SUCCESS, res })
      },
      failure: () => dispatch({ type: GET_DONATION_ORGS_FAILURE })
    })
}

export const setDonationOrg = (donationOrg) => (dispatch) => {
  dispatch({ type: SET_DONATION_ORG, donationOrg })
  if(donationOrg === null)
  {
    dispatch({ type: SUBMIT_DONATION, donation:{donationAmount:null,hideAmount :false} })
  }
}

export const submitGiftType = () => (dispatch, getState) => {
  const { flow, giftType } = getState().purchase
  // TODO try to find a better way to replace steps in the flow
  if (giftType === DONATION_TYPE) {
    dispatch(setFlow({
      ...flow,
      routes: flow.routes.map(item => {
        if (item === PURCHASE8_ROUTE || item === VOUCHER_ROUTE)
          return DONATION_ROUTE
        return item
      })
    }, false))
  } else if (giftType === VOUCHER_TYPE) {
    dispatch(setFlow({
      ...flow,
      routes: flow.routes.map(item => {
        if (item === PURCHASE8_ROUTE || item === DONATION_ROUTE)
          return VOUCHER_ROUTE
        return item
      })
    }, false))
  } else {
    dispatch(setFlow({
      ...flow,
      routes: flow.routes.map(item => {
        if (item === DONATION_ROUTE || item === VOUCHER_ROUTE)
          return PURCHASE8_ROUTE
        return item
      })
    }, false))
  }
  dispatch(nextFlowStep())
}

export const submitVoucher = (voucher, refresh = false) => async (dispatch, getState) => {
  await dispatch({ type: SUBMIT_VOUCHER, voucher })
  localStorage.setItem(VOUCHER_STATE, JSON.stringify(voucher));
  const { flow } = getState().purchase
  dispatch(confirmVoucher(null, refresh))
}
export const setVoucher = (voucher) => (dispatch, getState) => {
  dispatch({ type: SUBMIT_VOUCHER, voucher })
}
export const confirmVoucher = (bundleValues, refresh) => async (dispatch, getState, { fetch }) => {
  await dispatch(addBundle(bundleValues, false))
  const { token } = dispatch(getToken())
  const { bundleId, voucher: { html, ...values } } = getState().purchase
  if (bundleId === null) {
    message.error("Bundle Id doesn't exist.");
    return;
  }

  dispatch({ type: CONFIRM_VOUCHER_REQUEST })
  return fetch(`/vouchers`, {
    method: 'POST',
    body: {
      bundle_id: parseInt(bundleId),
      ...values,
      html,
    },
    token,
    success: async (res) => {
      await dispatch({ type: CONFIRM_VOUCHER_SUCCESS })
      //await dispatch({ type: MAKE_ORDER_SUCCESS, order: null })
      if (refresh) {
        dispatch(nextFlowStep(-2))
      }
      else dispatch(nextFlowStep())
    },
    failure: (err) => {
      showErrorMessage(err);
      dispatch({ type: CONFIRM_VOUCHER_FAILURE })
    },
  })
}

export const submitDonation = (donation, refresh = false) => async (dispatch, getState) => {
  if(donation === null && refresh)
  {
    dispatch(nextFlowStep(-2))
    return;
  }
  if(donation === null)
    return;
  await dispatch({ type: SUBMIT_DONATION, donation })
  const { flow } = getState().purchase
  dispatch(confirmDonation(null, refresh))
}
export const confirmDonation = (bundleValues, refresh) => async (dispatch, getState, { fetch }) => {
  await dispatch(addBundle(bundleValues, false))
  const { token } = dispatch(getToken())
  const { donationOrg, bundleId, donationAmount, hideAmount } = getState().purchase
  if (bundleId === null) {
    message.error("Bundle Id doesn't exist.");
    return;
  }
  dispatch({ type: CONFIRM_DONATION_REQUEST })
  return fetch(`/donations`, {
    method: 'POST',
    body: {
      bundle_id: parseInt(bundleId),
      organization_id: donationOrg.id,
      amount: donationAmount,
      hide_amount: hideAmount,
    },
    token,
    success: () => {
      dispatch({ type: CONFIRM_DONATION_SUCCESS })
      if (refresh)
        dispatch(nextFlowStep(-2))
      else dispatch(nextFlowStep())
    },
    failure: (err) => {
      showErrorMessage(err);
      dispatch({ type: CONFIRM_DONATION_FAILURE })
    },
  })
}

export const getCardColors = () => (dispatch, getState, { fetch }) => {
  dispatch({ type: GET_CARD_COLORS_REQUEST })
  return fetch(`/card-colors?${qs.stringify({
    take: 100,
    order_by: 'title',
  })}`, {
      method: 'GET',
      success: (res) => {
        dispatch({ type: GET_CARD_COLORS_SUCCESS, cardColors: res.data })
      },
      failure: () => {
        dispatch({ type: GET_CARD_COLORS_FAILURE })
      }
    })
}

export const getDeliveryLocations = (orderId) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  dispatch({ type: GET_DELIVERY_LOCATIONS_REQUEST })

  return fetch(`/order/${orderId}/get-deliverable-locations`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({ type: GET_DELIVERY_LOCATIONS_SUCCESS, deliveryLocations: res.data })
    },
    failure: (err) => {
      dispatch({ type: GET_DELIVERY_LOCATIONS_FAILURE })
    }
  })
}
export const getDeliveryOccasions = (orderId) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  //dispatch({type: GET_DELIVERY_OCCASIONS_REQUEST})
  return fetch(`/order/${orderId}/get-delivery-occasions`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({ type: GET_DELIVERY_OCCASIONS_SUCCESS, deliveryOccations: res })
    },
    failure: (err) => {
      //dispatch({type: GET_DELIVERY_OCCASIONS_FAILURE})
    }
  })
}
export const DONATION_STATE = 'donation_state'
export const removeDontationFromBundle = () => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { bundleId, orderId } = getState().purchase
  if (bundleId === null) {
    return;
  }
  return fetch(`/removeDonationFromBundle/${bundleId}`, {
    method: 'POST',
    token,
    success: (res) => {
      dispatch(getOrderDetails(orderId))
      dispatch(getBundleDetails())
      dispatch(setDonationOrg(null));
      localStorage.removeItem(DONATION_STATE);
    },
    failure: (err) => {
      showErrorMessage(err);
    }
  })
}
export const VOUCHER_STATE = 'VOUCHER_STATE'
export const removeVoucherFromBundle = () => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { bundleId, orderId } = getState().purchase
  if (bundleId === null) {
    return;
  }
  return fetch(`/removeVoucherFromBundle/${bundleId}`, {
    method: 'POST',
    token,
    success: (res) => {
      dispatch(getOrderDetails(orderId))
      dispatch(getBundleDetails())
      dispatch({type:SUBMIT_VOUCHER, voucher:null});
      localStorage.removeItem(VOUCHER_STATE);
    },
    failure: (err) => {
      showErrorMessage(err);
    }
  })
}
export const getOrderDetails = (orderId) => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  let order_id = orderId ? orderId : getState().purchase.orderId
  if (!order_id) {
    return
  }
  dispatch({ type: GET_ORDER_DETAILS_REQUEST })
  return fetch(`/order-confirmation?${qs.stringify({
    order_id,
  })}`, {
      method: 'GET',
      token,
      success: (res) => {
        const giftIds = res.data.items && res.data.items.gifts ?
          res.data.items.gifts.map(item => item.gift.id) : [];
        localStorage.setItem(GIFT_IDS, JSON.stringify(giftIds))
        dispatch({ type: SET_GIFTIDS, giftIds })

        const newrecipient = res.data.recipients ? res.data.recipients.map(item => item.contact.id) : [];
        dispatch({ type: SET_NEW_RECIPIENT, newrecipient })
        localStorage.setItem(CONTACT_IDS_KEY, JSON.stringify(newrecipient))

        dispatch({ type: GET_ORDER_DETAILS_SUCCESS, order: res.data })
        dispatch(restoreCouponFromLocal(res.data));
      },
      failure: (err) => {
        dispatch({ type: GET_ORDER_DETAILS_FAILURE })
      },
    })
}
export const updateOrderMeta = () => (dispatch, getState, { fetch }) => {
  const { token } = dispatch(getToken())
  const { orderId } = getState().purchase;
  if (!orderId) {
    return
  }
  return fetch(`/orders/${orderId}`, {
    method: 'POST',
    contentType: 'multipart/form-data',
    token,
    body: {
      _method: 'PUT',
      incomplete_payment: 1,
    },
    success: (res) => { },
    failure: (err) => {console.log('err',err); },
  })
}
export const getBundleDetails = (bundleId) => (dispatch, getState, { fetch }) => {
  dispatch({ type: GET_BUNDLE_DETAILS_REQUEST })
  const { token } = dispatch(getToken())
  return fetch(`/bundles?${qs.stringify({
    filter_key: 'id',
    filter_value: bundleId ? bundleId : getState().purchase.bundleId,
  })}`, {
      method: 'GET',
      token,
      success: (res) => {
        dispatch({ type: GET_BUNDLE_DETAILS_SUCCESS, bundle: res.data[0] })
      },
      failure: () => dispatch({ type: GET_BUNDLE_DETAILS_FAILURE }),
    })
}

export const setFontFamilies = (fontFamily) => ({ type: SET_FONT_FAMILIES, fontFamily })

export const setNewRecipients = (newrecipient) => async (dispatch, getState) => {

  var orginRecipients = await localStorage.getItem(CONTACT_IDS_KEY);

  if (orginRecipients === null) orginRecipients = [];
  else orginRecipients = JSON.parse(orginRecipients);

  var a = newrecipient ? newrecipient.concat(orginRecipients) : orginRecipients;
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j])
        a.splice(j--, 1);
    }
  }
  localStorage.setItem(CONTACT_IDS_KEY, JSON.stringify(a))
  dispatch({ type: SET_NEW_RECIPIENT, newrecipient: a })
}
export const clearVoucherAndDonation = () => (dispatch, getState) => {
  dispatch({ type: SUBMIT_VOUCHER, voucher:null })
  dispatch({ type: SET_DONATION_ORG, donationOrg:null })
}
export const clear = () => (dispatch, getState) => {
  localStorage.clear();
  dispatch({ type: CLEAR })
}


// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  loading: {
    occasions: false,
    donationOrgs: false,
    cards: false,
    payment: false,
    recipients: false
  },
  occasions: [],
  occasion: null,
  letteringTechnique: null,
  cardStyle: null,
  cardSize: null,
  cardSizeKey: null,
  cardDetails: null,
  giftType: undefined,
  card: null,
  gift: null,
  gifts: [],
  paymentMethod: null,
  cardStyles: [],
  cards: [],
  flow: PURCHASE_FLOW,
  flowIndex: null,
  occasionTypes: [],
  occasionType: DEFAULT_OCCASION_TYPE,
  bundleId: null,
  bundle: null,
  orderId: null,
  order: null,
  donationOrgs: [],
  donationOrg: null,
  donationAmount: undefined,
  hideAmount: false,
  cardColors: [],
  cardColor: undefined,
  deliveryLocations: [],
  deliveryLocation: undefined,
  deliveryTime: undefined,
  voucher: null,
  recipients: [],
  templates: null,
  orderDetails: null,
  fontFamilies: [],
  newrecipient: [],
  saved: 0,
  orientation: null,
  recipientMode: null,
  giftId: null,
  giftIds: [],
  doPage: 1,
  doPageSize: 6,
  doCount: 0,
  shipping_cost: null,
  deliveryOccations:[]
}

export default createReducer(initialState, {
  [SET_BUNDLE]: (state, { bundle, letteringTechnique, card, gift, giftType, cardSize, cardSizeKey, cardStyle, orderId }) => {
    return {
      // bundleId should be saved in cookies - bundle obj is too big
      bundle,
      bundleId: bundle.id,
      letteringTechnique,
      card,
      cardId: card.id,
      gift,
      giftType,
      cardSize,
      cardSizeKey,
      cardStyle,
      cardDetails: { body: '' },
      orderId,
      voucher: bundle.voucher
      /*
      order: {
        items:{
          card:bundle.bundle_card,
          gifts:bundle.bundle_gifts
        }
      }
      */
    }
  },
  [SET_FLOW]: (state, { flow }) => ({
    flow,
  }),
  [SET_FLOW_INDEX]: (state, { flowIndex }) => ({
    flowIndex,
  }),
  [SET_OCCASION]: (state, { occasion }) => ({
    occasion,
    occasionId: occasion.id
  }),
  [GET_OCCASIONS_REQUEST]: (state, { params }) => ({
    occasionType: has(params, 'occasionType') ? params.occasionType : state.occasionType,
    loading: {
      ...state.loading,
      occasions: true,
    }
  }),
  [GET_OCCASIONS_SUCCESS]: (state, { occasions }) => ({
    occasions,
    loading: {
      ...state.loading,
      occasions: false,
    }
  }),
  [GET_OCCASIONS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      occasions: false,
    }
  }),
  [GET_OCCASION_TYPES_SUCCESS]: (state, { occasionTypes }) => ({
    occasionTypes,
  }),
  [SET_LETTERING_TECHNIQUE]: (state, { letteringTechnique }) => ({
    letteringTechnique,
  }),
  [GET_CARD_STYLES_SUCCESS]: (state, { cardStyles }) => ({
    cardStyles,
  }),
  [SET_CARD_STYLE]: (state, { cardStyle }) => ({
    cardStyle,
  }),
  [GET_CARDS_REQUEST]: (state, { params }) => ({
    cardColor: has(params, 'cardColor') ? params.cardColor : state.cardColor,
    loading: {
      ...state.loading,
      cards: true,
    }
  }),
  [GET_CARDS_SUCCESS]: (state, { cards }) => ({
    cards,
    // if current list doesn't have selected item - deselect it
    ...(!state.card || !cards.find(item => item.id === state.card.id) ? {
      card: null
    } : {}),
    loading: {
      ...state.loading,
      cards: false,
    }
  }),
  [GET_CARDS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      cards: false,
    }
  }),
  [SET_CARD_SIZE]: (state, { cardSize }) => ({
    cardSize,
    cardSizeKey: cardSize.key
  }),
  [SET_CARD]: (state, { card }) => ({
    card,
    cardId: card && card.id,
    orientation: card && card.orientation
  }),
  [SET_CARD_DETAILS]: (state, { cardDetails }) => ({
    cardDetails,
  }),
  [SET_GIFT_TYPE]: (state, { giftType }) => ({
    giftType,
    ...giftType === null ? {
      gift: null
    } : {}
  }),
  [CONTINUE_WITHOUT_GIFT]: (state, action) => ({
    giftType: null,
  }),
  [SET_GIFT]: (state, { gift }) => ({
    gift,
    giftId: gift && gift.id
  }),
  [SET_GIFTIDS]: (state, { giftIds }) => ({
    giftIds
  }),
  [GET_GIFTS_REQUEST]: (state, { params }) => ({
    giftType: has(params, 'giftType') ? params.giftType : state.giftType,
  }),
  [GET_GIFTS_SUCCESS]: (state, { gifts }) => ({
    gifts,
    // if current list doesn't have selected item - deselect it
    ...(!state.gift || !gifts.find(item => item.id === state.gift.id) ? {
      gift: null
    } : {}),
  }),
  [SET_PAYMENT_METHOD]: (state, { paymentMethod }) => ({
    paymentMethod,
  }),
  [ADD_BUNDLE_SUCCESS]: (state, { bundle }) => ({
    bundleId: bundle && bundle.id,
    bundle,
  }),
  [MAKE_ORDER_SUCCESS]: (state, { order }) => ({
    // orderId should be saved in cookies - order obj is too big
    orderId: order && order.id,
    order,
  }),
  [SET_DONATION_ORG]: (state, { donationOrg }) => ({
    donationOrg,
  }),
  [GET_DONATION_ORGS_REQUEST]: (state, { params }) => ({
    doPage: params.pagination ? params.pagination.current : 1,
    loading: {
      ...state.loading,
      donationOrgs: true,
    }
  }),
  [GET_DONATION_ORGS_SUCCESS]: (state, { res: { data, meta: { total } } }) => ({
    donationOrgs: data,
    doCount: total,
    loading: {
      ...state.loading,
      donationOrgs: false,
    }
  }),
  [GET_DONATION_ORGS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      donationOrgs: false,
    }
  }),
  [SUBMIT_DONATION]: (state, { donation }) => ({
    donationAmount: donation.donationAmount ? +donation.donationAmount:undefined,
    hideAmount: donation.hideAmount,
  }),
  [MAKE_STRIPE_PAYMENT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: true,
    }
  }),
  [MAKE_STRIPE_PAYMENT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [MAKE_STRIPE_PAYMENT_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [MAKE_PAYPAL_PAYMENT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: true,
    }
  }),
  [MAKE_PAYPAL_PAYMENT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [MAKE_PAYPAL_PAYMENT_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [MAKE_BITPAY_PAYMENT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: true,
    }
  }),
  [MAKE_BITPAY_PAYMENT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [MAKE_BITPAY_PAYMENT_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [GET_CARD_COLORS_SUCCESS]: (state, { cardColors }) => ({
    cardColors,
  }),
  [GET_DELIVERY_LOCATIONS_SUCCESS]: (state, { deliveryLocations }) => ({
    deliveryLocations,
  }),
  [GET_DELIVERY_OCCASIONS_SUCCESS]: (state, { deliveryOccations }) => ({
    deliveryOccations,
  }),
  [SUBMIT_SHIPPING_REQUEST]: (state, { values }) => ({
    deliveryLocation: values.deliverable,
    deliveryOccasion: values.delivery_occasion,
    deliveryTime: values.schedule_date ? values.schedule_date.format(DATE_FORMAT) : undefined,
  }),
  [SUBMIT_VOUCHER]: (state, { voucher }) => ({
    voucher,
  }),
  [GET_RECIPIENTS_REQUEST]: (state) => ({
    loading: {
      ...state.loading,
      recipients: true,
    }
  }),
  [GET_RECIPIENTS_SUCCESS]: (state, res) => ({
    loading: {
      ...state.loading,
      recipients: false,
    },
    recipients: res.recipients,
  }),
  [GET_RECIPIENTS_FAILURE]: (state) => ({
    loading: {
      ...state.loading,
      recipients: false,
    },
  }),
  [GET_TEMPLATE_SUCCESS]: (state, { templates }) => ({
    templates,
  }),
  [GET_ORDER_DETAILS_SUCCESS]: (state, { order }) => ({
    order,
  }),
  [GET_BUNDLE_DETAILS_SUCCESS]: (state, { bundle }) => ({
    bundle,
  }),
  [UPDATE_BUNDLE_BODY]: (state, { cardDetails }) => ({
    bundle: {
      ...state.bundle,
      ...cardDetails
    }
  }),
  [SET_FONT_FAMILIES]: (state, { fontFamily }) => ({
    fontFamilies: uniq([...state.fontFamilies, fontFamily]),
  }),
  [SET_NEW_RECIPIENT]: (state, { newrecipient }) => ({
    newrecipient,
  }),
  [SET_SAVED_VALUE]: (state, { saved }) => ({
    saved
  }),
  [SET_ORIENTATION]: (state, { orientation }) => ({
    orientation
  }),
  [SET_RECIPIENT_MODE]: (state, { recipientMode }) => ({
    recipientMode
  }),
  [GET_SHIPPINGTOTAL_SUCCESS]: (state, { shipping_cost }) => ({
    shipping_cost
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
