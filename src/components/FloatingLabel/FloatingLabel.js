import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {Input} from 'antd'


export default class FloatingLabel extends React.Component {
  static propTypes: {
    autoComplete: PropTypes.bool,
    errorMsg: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    pattern: PropTypes.any,
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool
  };

  constructor (props) {
    super(props)
    this.state = {hasValue: props.value && props.value.length > 0 ? true:false, hasError: false};
  }
  componentWillReceiveProps(nexprops){
    if(nexprops && nexprops.value)
    {
      this.setState({hasValue: true});
    }
  }
  onBlur(event) {
    this.setState({hasValue: Boolean(event.currentTarget.value)});
    this.props.onBlur && this.props.onBlur(event);
  }

  onChange(event) {
    const {pattern} = this.props;
    this.setState({
      hasError: !pattern.test(event.currentTarget.value),
      hasValue: Boolean(event.currentTarget.value)
    });
    
  }
  onKeyDown(event){
    const keycode = event.keyCode;
    
    if(this.props.type === 'phone')
    {
      var valid = 
      (keycode > 47 && keycode < 58)   || // number keys
      //keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
      (keycode > 64 && keycode < 91)   || // letter keys
      (keycode > 95 && keycode < 112)  || // numpad keys
      (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
      keycode == 16 || //shift
      (keycode > 218 && keycode < 223);   // [\]' (in order)

      //number
      if(valid && (event.keyCode < 48 || event.keyCode > 57) || event.shiftKey)//0~9
      {
        event.preventDefault(); // Let's stop this event.
        event.stopPropagation(); // Really this time.
      }
    }
    if(this.props.type === 'name')
    {
      var valid = (keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 112) 

      //alphabet letter
      if(valid && !event.shiftKey)//letter
      {
        event.preventDefault(); 
        event.stopPropagation();
      }
    }
    if(this.props.type === 'dob')
    {
      var valid = 
      (keycode > 47 && keycode < 58)   || // number keys
      keycode == 32 || keycode == 13 || keycode == 8 ||
      (keycode > 34 && keycode < 47)   || //arrow
      (keycode > 95 && keycode < 112)  || // numpad keys
      keycode == 189 ;   // 

      //number
      if(!valid || event.shiftKey)//0~9
      {
        event.preventDefault(); // Let's stop this event.
        event.stopPropagation(); // Really this time.
      }
    }
  }
  render () {
    const {autoComplete, errorMsg, id, isDisabled, pattern, placeholder, type, value, defaultValue,maxLength,required, autoFocus} = this.props;
    const {hasValue, hasError} = this.state;
    const inputClasses = classNames('fl-input', {'fl-valid': hasValue && !hasError}, {'fl-invalid': hasValue && hasError});
    if(type === 'dob')
    {
      return(
        <Input
            autoComplete={autoComplete}
            className={inputClasses}
            disabled={isDisabled}
            onBlur={this.onBlur.bind(this)}
            onChange={this.props.onChange}
            onFocus = {this.props.onFocus}
            defaultValue = {defaultValue}
            value = {value}
            type={type === 'phone' || type === 'name' ? 'text' : type}
            maxLength={maxLength}
            required = {required}
            autoFocus = {autoFocus}
            onKeyDown = {this.onKeyDown.bind(this)}
            placeholder = {placeholder}
          />
      );
    }
    return(
      <div className='fl-input-container'>
        <Input
          autoComplete={autoComplete}
          className={inputClasses}
          disabled={isDisabled}
          onBlur={this.onBlur.bind(this)}
          onChange={this.props.onChange}
          onFocus = {this.props.onFocus}
          defaultValue = {defaultValue}
          value = {value}
          type={type === 'phone' || type === 'name' ? 'text' : type}
          maxLength={maxLength}
          required = {required}
          autoFocus = {autoFocus}
          onKeyDown = {this.onKeyDown.bind(this)}
          />
        <label className='fl-input-label' htmlFor={id}>{placeholder}</label>
        <span className='fl-input-bar'></span>
      </div>
    );
  }
}

FloatingLabel.defaultProps = {
  autoComplete: 'false',
  type: 'text',
  isDisabled: false,
  placeholder: 'name'
};
