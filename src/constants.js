import messages from './routes/purchase4/messages'
import FoldedCardImage from './static/folded_card.svg'
import PostcardImage from './static/postcard.svg'
import FoldedCardWithoutPanelImage from './static/folded_without_panel.svg'
import BigFoldedCardImage from './static/folded_card_big.svg'
import FoodImage from './static/food.svg'
import NonFoodImage from './static/non_food.svg'
import DonationImage from './static/donation.svg'
import VoucherImage from './static/voucher.svg'

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
    key: '4x5',
    title: intl && intl.formatMessage(messages.foldedCard),
    svg: FoldedCardImage,
    extra: '4" x 5"',
    height: 101.6,
    width: 127,
  },
  {
    key: '5x7',
    title: intl && intl.formatMessage(messages.postcard),
    svg: PostcardImage,
    extra: '5" x 7"',
    height: 127,
    width: 177.8,
  },
  {
    key: '6x6',
    title: intl && intl.formatMessage(messages.foldedCardWithoutPanel),
    svg: FoldedCardWithoutPanelImage,
    extra: '6" x 6"',
    height: 152.4,
    width: 152.4,
  },
  {
    key: '4x9',
    title: intl && intl.formatMessage(messages.foldedCard),
    svg: BigFoldedCardImage,
    extra: '4" x 9"',
    height: 101.6,
    width: 228.6,
  },
]

// TODO add translations
export const GIFT_TYPES = (intl) => [
  {key: 'Food', title: 'Food', svg: FoodImage},
  {key: 'Fruits', title: 'Non Food', svg: NonFoodImage},
  {key: 'Donation', title: 'Donation', svg: DonationImage},
  {key: 'Voucher', title: 'Voucher', svg: VoucherImage},
]
