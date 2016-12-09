'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _client = require('../client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This is a react component that will inject the necessary code into a page for tracking via
 */
var FullStory = function (_React$Component) {
    _inherits(FullStory, _React$Component);

    function FullStory() {
        _classCallCheck(this, FullStory);

        return _possibleConstructorReturn(this, (FullStory.__proto__ || Object.getPrototypeOf(FullStory)).apply(this, arguments));
    }

    _createClass(FullStory, [{
        key: 'componentDidMount',


        /**
         * On mount we will inject our javacript settings based on the settings we have in the
         * system.
         */
        value: function componentDidMount() {
            // initialize the fullstory client not the need to use a global variable here yuck
            this.fullStoryClient = new _client2.default(this.props.settings, window);

            if (typeof window.FS === 'undefined') {
                this.fullStoryClient.render();
            }

            this.fullStoryClient.clearUserSession();
            // set out initial session based on the props passed in
            this.fullStoryClient.setSession(this.props.sessionId, this.props.custom);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.sessionId !== this.props.sessionId) {
                this.fullStoryClient.clearUserSession();
                this.fullStoryClient.setSession(nextProps.sessionId, nextProps.custom);
                return true;
            }

            return false;
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement('div', { className: 'fullstory' });
        }
    }]);

    return FullStory;
}(_react2.default.Component);

FullStory.propTypes = {
    settings: _react.PropTypes.shape({
        debug: _react.PropTypes.bool,
        host: _react.PropTypes.string,
        orgKey: _react.PropTypes.string,
        iframe: _react.PropTypes.bool
    }).isRequired,
    sessionId: _react.PropTypes.string.isRequired,
    custom: _react.PropTypes.object
};

FullStory.defaultProps = {
    settings: {
        debug: false,
        host: 'www.fullstory.com',
        orgKey: null,
        iframe: false
    },
    sessionId: null,
    custom: {}
};

exports.default = FullStory;