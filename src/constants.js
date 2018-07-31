import messages from './routes/purchase4/messages'
import FoldedCardImage from './static/folded_card.svg'
import PostcardImage from './static/postcard.svg'
import FoldedCardWithoutPanelImage from './static/folded_without_panel.svg'
import BigFoldedCardImage from './static/folded_card_big.svg'
import FoodImage from './static/food.svg'
import NonFoodImage from './static/non_food.svg'
import DonationImage from './static/donation.svg'
import VoucherImage from './static/voucher.svg'

export const DAY = 86400
export const YEAR = 31536000

export const TOKEN_COOKIE = 'token'
export const LOCALE_COOKIE = 'locale'

export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
export const DEFAULT_PAGE_SIZE = 10

export const DEFAULT_DEBOUNCE_TIME = 800

export const DATE_FORMAT = 'YYYY-MM-DD'

export const ADDRESS_FIELDS = [
  'street',
]

export const REQUIRED_FIELDS = [
  'first_name',
  'last_name',
  'email',
  'phone',
  ...ADDRESS_FIELDS,
]

// width/height in mm
export const CARD_SIZES = (intl) => [
  {
    key: '4" x 5"',
    title: intl && intl.formatMessage(messages.foldedCard),
    svg: FoldedCardImage,
    extra: '4" × 5"',
    height: 101.6,
    width: 127,
  },
  {
    key: '5" x 7"',
    title: intl && intl.formatMessage(messages.postcard),
    svg: PostcardImage,
    extra: '5" × 7"',
    height: 127,
    width: 177.8,
  },
  {
    key: '6" x 6"',
    title: intl && intl.formatMessage(messages.foldedCardWithoutPanel),
    svg: FoldedCardWithoutPanelImage,
    extra: '6" × 6"',
    height: 152.4,
    width: 152.4,
  },
  {
    key: '4" x 9"',
    title: intl && intl.formatMessage(messages.foldedCard),
    svg: BigFoldedCardImage,
    extra: '4" × 9"',
    height: 101.6,
    width: 228.6,
  },
]

export const FOOD_TYPE = 'Food'
export const NON_FOOD_TYPE = 'Non-Food'
export const DONATION_TYPE = 'Donation'
export const VOUCHER_TYPE = 'Voucher'

// TODO add translations
export const GIFT_TYPES = (intl) => [
  {key: FOOD_TYPE, title: 'Food', svg: FoodImage},
  {key: NON_FOOD_TYPE, title: 'Non Food', svg: NonFoodImage},
]

export const ADDITIONAL_GIFT_TYPES = (intl) => [
  {key: DONATION_TYPE, title: 'Donation', svg: DonationImage},
  {key: VOUCHER_TYPE, title: 'Voucher', svg: VoucherImage},
]
