import messages from './routes/purchase4/messages'
import BigCardImage from './static/big_card.svg'
import PanelCardImage from './static/panel_card.svg'
import GreetingCardImage from './static/greeting_card.svg'
import PostcardImage from './static/postcard.svg'

export const YEAR = 31536000

export const TOKEN_COOKIE = 'token'
export const LOCALE_COOKIE = 'locale'

export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
export const DEFAULT_PAGE_SIZE = 10

export const DEFAULT_DEBOUNCE_TIME = 800

export const DATE_FORMAT = 'YYYY-MM-DD'

export const REQUIRED_FIELDS = [
  'first_name',
  'last_name',
  'email',
]

// width/height in mm
export const CARD_SIZES = (intl) => [
  {
    key: 'folded_card',
    title: intl.formatMessage(messages.foldedCard),
    svg: BigCardImage,
    extra: '4" x 5"',
    height: 101.6,
    width: 127,
  },
  {
    key: 'postcard',
    title: intl.formatMessage(messages.postcard),
    svg: PostcardImage,
    extra: '5" x 7"',
    height: 127,
    width: 177.8,
  },
  {
    key: 'folder_card_without_panel',
    title: intl.formatMessage(messages.foldedCardWithoutPanel),
    svg: PanelCardImage,
    extra: '6" x 6"',
    height: 152.4,
    width: 152.4,
  },
  {
    key: 'folder_card2',
    title: intl.formatMessage(messages.foldedCard),
    svg: GreetingCardImage,
    extra: '4" x 9"',
    height: 101.6,
    width: 228.6,
  },
]
