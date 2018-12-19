'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var debounce = _interopDefault(require('lodash.debounce'));
var throttle = _interopDefault(require('lodash.throttle'));

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".magnifier {\n  position: relative;\n  display: inline-block;\n  line-height: 0; }\n\n.magnifier-image {\n  cursor: none; }\n\n.magnifying-glass {\n  position: absolute;\n  z-index: 1;\n  transition: opacity 0.3s;\n  background: #E5E5E5 no-repeat;\n  border: solid #EBEBEB;\n  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);\n  pointer-events: none;\n  opacity: 0; }\n  .magnifying-glass.circle {\n    border-radius: 50%; }\n  .magnifying-glass.visible {\n    opacity: 1; }\n";
styleInject(css);

var propTypes = {
  // Image
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // Zoom image
  zoomImgSrc: PropTypes.string,
  zoomFactor: PropTypes.number,
  // Magnifying glass
  mgWidth: PropTypes.number,
  mgHeight: PropTypes.number,
  mgBorderWidth: PropTypes.number,
  mgShape: PropTypes.oneOf(['circle', 'square']),
  mgShowOverflow: PropTypes.bool,
  mgMouseOffsetX: PropTypes.number,
  mgMouseOffsetY: PropTypes.number,
  mgTouchOffsetX: PropTypes.number,
  mgTouchOffsetY: PropTypes.number
};
var defaultProps = {
  // Image
  alt: null,
  width: '100%',
  height: 'auto',
  // Zoom image
  zoomImgSrc: null,
  zoomFactor: 1.5,
  // Magnifying glass
  mgWidth: 150,
  mgHeight: 150,
  mgBorderWidth: 2,
  mgShape: 'circle',
  mgShowOverflow: true,
  mgMouseOffsetX: 0,
  mgMouseOffsetY: 0,
  mgTouchOffsetX: -50,
  mgTouchOffsetY: -50
};

var Magnifier =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Magnifier, _PureComponent);

  _createClass(Magnifier, null, [{
    key: "enforceRelative",
    value: function enforceRelative(number) {
      // Make sure the provided relative number lies between 0 and 1
      if (number < 0) {
        return 0;
      }

      if (number > 1) {
        return 1;
      }

      return number;
    }
  }]);

  function Magnifier(props) {
    var _this;

    _classCallCheck(this, Magnifier);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Magnifier).call(this, props));

    if (!props.src) {
      throw Error('Missing src prop');
    }

    _this.state = {
      showZoom: false,
      // Magnifying glass offset
      mgOffsetX: 0,
      mgOffsetY: 0,
      // Mouse position relative to image
      relX: 0,
      relY: 0
    }; // Function bindings

    _this.onMouseMove = throttle(_this.onMouseMove.bind(_assertThisInitialized(_assertThisInitialized(_this))), 20, {
      trailing: false
    });
    _this.onMouseOut = _this.onMouseOut.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onTouchMove = throttle(_this.onTouchMove.bind(_assertThisInitialized(_assertThisInitialized(_this))), 20, {
      trailing: false
    });
    _this.onTouchEnd = _this.onTouchEnd.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.calcImgBounds = _this.calcImgBounds.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.calcImgBoundsDebounced = debounce(_this.calcImgBounds, 200);
    return _this;
  }

  _createClass(Magnifier, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Add non-passive event listeners to image img (assigned in render function)
      this.img.addEventListener('mousemove', this.onMouseMove, {
        passive: false
      });
      this.img.addEventListener('mouseout', this.onMouseOut, {
        passive: false
      });
      this.img.addEventListener('touchstart', this.onTouchStart, {
        passive: false
      });
      this.img.addEventListener('touchmove', this.onTouchMove, {
        passive: false
      });
      this.img.addEventListener('touchend', this.onTouchEnd, {
        passive: false
      }); // Calculate image bounds whenever window is resized

      window.addEventListener('resize', this.calcImgBoundsDebounced);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // Remove all event listeners
      this.img.removeEventListener('mousemove', this.onMouseMove);
      this.img.removeEventListener('mouseout', this.onMouseMove);
      this.img.removeEventListener('touchstart', this.onMouseMove);
      this.img.removeEventListener('touchmove', this.onMouseMove);
      this.img.removeEventListener('touchend', this.onMouseMove);
      window.removeEventListener('resize', this.calcImgBoundsDebounced);
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
      var _this$props = this.props,
          mgMouseOffsetX = _this$props.mgMouseOffsetX,
          mgMouseOffsetY = _this$props.mgMouseOffsetY;

      if (this.imgBounds) {
        var relX = (e.clientX - this.imgBounds.left) / e.target.clientWidth;
        var relY = (e.clientY - this.imgBounds.top) / e.target.clientHeight;
        this.setState({
          showZoom: true,
          relX: Magnifier.enforceRelative(relX),
          relY: Magnifier.enforceRelative(relY),
          mgOffsetX: mgMouseOffsetX,
          mgOffsetY: mgMouseOffsetY
        });
      }
    }
  }, {
    key: "onTouchStart",
    value: function onTouchStart(e) {
      // eslint-disable-line class-methods-use-this
      e.preventDefault(); // Prevent mouse event from being fired
    }
  }, {
    key: "onTouchMove",
    value: function onTouchMove(e) {
      e.preventDefault(); // Disable scroll on touch

      if (this.imgBounds) {
        var _this$props2 = this.props,
            mgTouchOffsetX = _this$props2.mgTouchOffsetX,
            mgTouchOffsetY = _this$props2.mgTouchOffsetY;
        var relX = (e.targetTouches[0].clientX - this.imgBounds.left) / e.target.clientWidth;
        var relY = (e.targetTouches[0].clientY - this.imgBounds.top) / e.target.clientHeight; // Only show magnifying glass if touch is inside image

        if (relX >= 0 && relY >= 0 && relX <= 1 && relY <= 1) {
          this.setState({
            showZoom: true,
            relX: Magnifier.enforceRelative(relX),
            relY: Magnifier.enforceRelative(relY),
            mgOffsetX: mgTouchOffsetX,
            mgOffsetY: mgTouchOffsetY
          });
        } else {
          this.setState({
            showZoom: false
          });
        }
      }
    }
  }, {
    key: "onMouseOut",
    value: function onMouseOut() {
      this.setState({
        showZoom: false
      });
    }
  }, {
    key: "onTouchEnd",
    value: function onTouchEnd() {
      this.setState({
        showZoom: false
      });
    }
  }, {
    key: "calcImgBounds",
    value: function calcImgBounds() {
      this.imgBounds = this.img && this.img.getBoundingClientRect();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          src = _this$props3.src,
          alt = _this$props3.alt,
          width = _this$props3.width,
          height = _this$props3.height,
          zoomImgSrc = _this$props3.zoomImgSrc,
          zoomFactor = _this$props3.zoomFactor,
          mgHeight = _this$props3.mgHeight,
          mgWidth = _this$props3.mgWidth,
          mgBorderWidth = _this$props3.mgBorderWidth,
          mgShape = _this$props3.mgShape,
          mgShowOverflow = _this$props3.mgShowOverflow;
      var _this$state = this.state,
          mgOffsetX = _this$state.mgOffsetX,
          mgOffsetY = _this$state.mgOffsetY,
          relX = _this$state.relX,
          relY = _this$state.relY,
          showZoom = _this$state.showZoom; // Show/hide magnifying glass (opacity needed for transition)

      var mgClasses = 'magnifying-glass';

      if (showZoom) {
        mgClasses += ' visible';
      }

      if (mgShape === 'circle') {
        mgClasses += ' circle';
      }

      return React__default.createElement("div", {
        className: "magnifier",
        style: {
          width: width,
          height: height,
          overflow: mgShowOverflow ? 'visible' : 'hidden'
        }
      }, React__default.createElement("img", {
        className: "magnifier-image",
        src: src,
        alt: alt,
        width: "100%",
        height: "100%",
        onLoad: function onLoad() {
          _this2.calcImgBounds();
        },
        ref: function ref(e) {
          _this2.img = e;
        }
      }), this.imgBounds && React__default.createElement("div", {
        className: mgClasses,
        style: {
          width: mgWidth,
          height: mgHeight,
          left: "calc(".concat(relX * 100, "% - ").concat(mgWidth / 2, "px + ").concat(mgOffsetX, "px - ").concat(mgBorderWidth, "px)"),
          top: "calc(".concat(relY * 100, "% - ").concat(mgHeight / 2, "px + ").concat(mgOffsetY, "px - ").concat(mgBorderWidth, "px)"),
          backgroundImage: "url(".concat(zoomImgSrc || src, ")"),
          backgroundPosition: "calc(".concat(relX * 100, "% + ").concat(mgWidth / 2, "px - ").concat(relX * mgWidth, "px) calc(").concat(relY * 100, "% + ").concat(mgHeight / 2, "px - ").concat(relY * mgWidth, "px)"),
          backgroundSize: "".concat(zoomFactor * this.imgBounds.width, "% ").concat(zoomFactor * this.imgBounds.height, "%"),
          borderWidth: mgBorderWidth
        }
      }));
    }
  }]);

  return Magnifier;
}(React.PureComponent);
Magnifier.propTypes = propTypes;
Magnifier.defaultProps = defaultProps;

module.exports = Magnifier;
//# sourceMappingURL=Magnifier.js.map
