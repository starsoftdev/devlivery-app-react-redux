import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './InputDate.css'
import CheckIcon from '../../static/card_checkmark.svg'
import cn from 'classnames'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {getItemImage} from '../../utils'
import {EMPTY_IMAGE} from '../../constants'
import MaskedInput from 'react-maskedinput'

class InputDate extends React.Component {
  render() {
    return <MaskedInput
      mask="11-11-1111"
      placeholder="DD-MM-YYYY"
      size="11"
      {...this.props}
      formatCharacters={{
        'W': {
          validate(char) { return /\w/.test(char ) },
          transform(char) { return char.toUpperCase() }
        }
      }
    }/>
  }
}

export default withStyles(s)(InputDate)
