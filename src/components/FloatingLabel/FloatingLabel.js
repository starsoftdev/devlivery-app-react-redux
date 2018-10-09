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

  render () {
    const {autoComplete, errorMsg, id, isDisabled, pattern, placeholder, type, value, defaultValue,maxLength,required} = this.props;
    const {hasValue, hasError} = this.state;
    const inputClasses = classNames('fl-input', {'fl-valid': hasValue && !hasError}, {'fl-invalid': hasValue && hasError});
    
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
          type={type}
          maxLength={maxLength}
          required = {required}
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
