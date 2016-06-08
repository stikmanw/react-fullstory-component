'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fullstory = require('./component/fullstory');

Object.defineProperty(exports, 'FullStory', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_fullstory).default;
  }
});

var _client = require('./client');

Object.defineProperty(exports, 'FullStoryClient', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_client).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }