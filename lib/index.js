'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageFromStorage = exports.connect = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = connect;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cache = {};

function connect(mapStorageToProps) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { debug: false },
      debug = _ref.debug;

  return function wrap(ComponentToWrap) {
    var ConnectedComponent = function (_Component) {
      _inherits(ConnectedComponent, _Component);

      function ConnectedComponent() {
        var _ref2;

        var _temp, _this, _ret;

        _classCallCheck(this, ConnectedComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = ConnectedComponent.__proto__ || Object.getPrototypeOf(ConnectedComponent)).call.apply(_ref2, [this].concat(args))), _this), _this.state = {}, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(ConnectedComponent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          this.obtainDownloadURLsFromCache(this.props);
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.updateCacheWithDownloadURLs(this.props);
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(next) {
          this.obtainDownloadURLsFromCache(next);
          this.updateCacheWithDownloadURLs(next);
        }
      }, {
        key: 'obtainDownloadURLsFromCache',
        value: function obtainDownloadURLsFromCache(props) {
          var mapping = mapStorageToProps(props);
          var keys = Object.keys(mapping);
          var newState = {}; // Holds the updated state

          for (var i = keys.length - 1; i >= 0; i -= 1) {
            // Only check keys that have a mapping value
            if (mapping[keys[i]]) {
              // Check cache based on full path
              var url = cache[mapping[keys[i]].fullPath];
              if (url) {
                // Add url to new state
                newState[keys[i]] = url;
              }
            }
          }
          this.setState(newState);
        }
      }, {
        key: 'updateCacheWithDownloadURLs',
        value: function updateCacheWithDownloadURLs(props) {
          var _this2 = this;

          var mapping = mapStorageToProps(props);
          var keys = Object.keys(mapping);
          var newState = {}; // Holds the updated state

          Promise.all(keys.map(function (prop) {
            // Only check keys that have a mapping value and that are not in cache
            if (mapping[prop] && !cache[mapping[prop].fullPath]) {
              return mapping[prop].getDownloadURL().then(function (url) {
                // Save url in cache and new state
                newState[prop] = cache[mapping[prop].fullPath] = url;
              }).catch(function (error) {
                if (debug) console.warn(error.code);
              });
            }
            return null;
          })).then(function () {
            return _this2.setState(newState);
          });
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(ComponentToWrap, _extends({}, this.state, this.props));
        }
      }]);

      return ConnectedComponent;
    }(_react.Component);

    return ConnectedComponent;
  };
}

var ImageFromStorage = connect(function (props) {
  return {
    src: props.storageRef
  };
})(function (innerprops) {
  var as = innerprops.as,
      alt = innerprops.alt,
      imgProps = _objectWithoutProperties(innerprops, ['as', 'alt']);

  delete imgProps.storageRef;
  if (as) {
    var Image = as;
    return _react2.default.createElement(Image, _extends({ alt: alt }, imgProps));
  }
  return _react2.default.createElement('img', _extends({ alt: alt }, imgProps));
});

exports.connect = connect;
exports.ImageFromStorage = ImageFromStorage;