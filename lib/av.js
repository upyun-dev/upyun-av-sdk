'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _utils = require('./utils');

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AvPretreatment = function () {
  function AvPretreatment(bucket, operator, password) {
    _classCallCheck(this, AvPretreatment);

    this.bucket = bucket;
    this.operator = operator;
    this.password = _crypto2.default.createHash('md5').update(password).digest('hex');
    this.HOST = 'http://p0.api.upyun.com';
    this.PRETREAT = '/pretreatment/';
    this.STATUS = '/status/';
    this.RESULT = '/result/';
  }

  _createClass(AvPretreatment, [{
    key: 'pretreat',
    value: function pretreat(tasks, source, notifyUrl, callback) {
      tasks = new Buffer(JSON.stringify(tasks)).toString('base64');
      var data = {
        service: this.bucket,
        source: source,
        notify_url: notifyUrl,
        tasks: tasks,
        accept: 'json'
      };
      this._requestsPretreat(data, callback);
    }
  }, {
    key: 'status',
    value: function status(taskIDs, callback) {
      var data = {
        service: this.bucket,
        task_ids: taskIDs
      };
      this._requestsStatus(data, callback);
    }
  }, {
    key: 'result',
    value: function result(taskIDs, callback) {
      var data = {
        service: this.bucket,
        task_ids: taskIDs
      };
      this._requestsResult(data, callback);
    }
  }, {
    key: '_requestsPretreat',
    value: function _requestsPretreat(data, callback) {
      var method = 'POST';
      var uri = this.PRETREAT;
      var value = _querystring2.default.stringify(data);
      var contentMD5 = (0, _utils.makeContentMD5)(value);
      var date = (0, _utils.curDt)();

      var signature = (0, _utils.makeSignature)(this.operator, this.password, method, uri, date, contentMD5);
      var headers = {
        Authorization: signature,
        Date: date,
        'Content-MD5': contentMD5
      };

      this._requests(method, uri, headers, data, callback);
    }
  }, {
    key: '_requestsStatus',
    value: function _requestsStatus(data, callback) {
      var method = 'GET';
      var value = _querystring2.default.stringify(data);
      var uri = this.STATUS + '?' + value;
      var date = (0, _utils.curDt)();
      var signature = (0, _utils.makeSignature)(this.operator, this.password, method, uri, date);
      var headers = {
        Authorization: signature,
        Date: date
      };

      this._requests(method, uri, headers, null, callback);
    }
  }, {
    key: '_requestsResult',
    value: function _requestsResult(data, callback) {
      var method = 'GET';
      var value = _querystring2.default.stringify(data);
      var uri = this.RESULT + '?' + value;
      var date = (0, _utils.curDt)();
      var signature = (0, _utils.makeSignature)(this.operator, this.password, method, uri, date);
      var headers = {
        Authorization: signature,
        Date: date
      };
      this._requests(method, uri, headers, null, callback);
    }
  }, {
    key: '_requests',
    value: function _requests(method, uri, headers, form, callback) {
      (0, _request2.default)({
        method: method,
        url: this.HOST + uri,
        headers: headers,
        form: form
      }, function (err, response, body) {
        callback(err, body);
      });
    }
  }]);

  return AvPretreatment;
}();

module.exports = AvPretreatment;