'use strict';

import crypto from 'crypto';

import request from 'request';
import { makeSignature, makeContentMD5, curDt } from './utils';
import querystring from 'querystring';

class AvPretreatment {
  constructor(bucket, operator, password) {
    this.bucket = bucket;
    this.operator = operator;
    this.password = crypto.createHash('md5').update(password).digest('hex');
    this.HOST = 'http://p0.api.upyun.com';
    this.PRETREAT = '/pretreatment/';
    this.STATUS = '/status/';
    this.RESULT = '/result/';
  }
  pretreat(tasks, source, notifyUrl, callback) {
    tasks = new Buffer(JSON.stringify(tasks)).toString('base64');
    let data = {
      service: this.bucket,
      source: source,
      notify_url: notifyUrl,
      tasks: tasks,
      accept: 'json'
    };
    this._requestsPretreat(data, callback);
  }

  status(taskIDs, callback) {
    let data = {
      service: this.bucket,
      task_ids: taskIDs
    };
    this._requestsStatus(data, callback);
  }

  result(taskIDs, callback) {
    let data = {
      service: this.bucket,
      task_ids: taskIDs
    };
    this._requestsResult(data, callback);
  }

  _requestsPretreat(data, callback) {
    let method = 'POST';
    let uri = this.PRETREAT;
    let value = querystring.stringify(data);
    let contentMD5 = makeContentMD5(value);
    let date = curDt();

    let signature = makeSignature(this.operator, this.password, method, uri, date, contentMD5);
    let headers = {
      Authorization: signature,
      Date: date,
      'Content-MD5': contentMD5
    };

    this._requests(method, uri, headers, data, callback);
  }

  _requestsStatus(data, callback) {
    let method = 'GET';
    let value = querystring.stringify(data);
    let uri = `${this.STATUS}?${value}`;
    let date = curDt();
    let signature = makeSignature(this.operator, this.password, method, uri, date);
    let headers = {
      Authorization: signature,
      Date: date
    };

    this._requests(method, uri, headers, null, callback);
  }

  _requestsResult(data, callback) {
    let method = 'GET';
    let value = querystring.stringify(data);
    let uri = `${this.RESULT}?${value}`;
    let date = curDt();
    let signature = makeSignature(this.operator, this.password, method, uri, date);
    let headers = {
      Authorization: signature,
      Date: date
    };
    this._requests(method, uri, headers, null, callback);
  }

  _requests(method, uri, headers, form, callback) {
    request({
      method: method,
      url: this.HOST + uri,
      headers: headers,
      form: form
    }, (err, response, body) => {
      callback(err, body);
    });
  }
}

module.exports = AvPretreatment;
