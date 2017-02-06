'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.curDt = exports.makeSignature = exports.makeContentMD5 = undefined;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeSignature = function makeSignature(operator, password) {
  for (var _len = arguments.length, signList = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    signList[_key - 2] = arguments[_key];
  }

  var signstr = signList.join('&');
  var signature = _crypto2.default.createHmac('sha1', password).update(signstr).digest('base64');
  return 'UPYUN ' + operator + ':' + signature;
};

var makeContentMD5 = function makeContentMD5(value) {
  var contentMD5 = _crypto2.default.createHash('md5').update(value).digest('hex');
  return contentMD5;
};

var curDt = function curDt() {
  return new Date().toUTCString();
};

exports.makeContentMD5 = makeContentMD5;
exports.makeSignature = makeSignature;
exports.curDt = curDt;