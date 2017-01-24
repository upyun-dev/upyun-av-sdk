'use strict';
import crypto from 'crypto';
import util from 'util';
import request from 'request';

export default class AvPretreatment {
  constructor(bucket, operator, password) {
    this.bucket = bucket;
    this.operator = operator;
    this.password = crypto.createHash('md5').update(password).digest('hex');
    this._host = 'http://p0.api.upyun.com';
    this.PRETREAT = '/pretreatment/';
  }
  pretreat(service, source, notify_url, tasks, accept, callback) {
    if (typeof accept == 'function') {
      callback = accept;
      accept = 'json';
    }
    tasks = new Buffer(JSON.stringify(tasks)).toString('base64');
    let data = {
      service: service,
      source: source,
      notify_url: notify_url,
      tasks: tasks,
      accept: accept
    };
    this._requestsPretreatment(data, callback);
  }

  _requestsPretreatment(data, callback) {
    let method = 'POST';
    let path = this.PRETREAT;
    let contentMD5 = this.makeContentMD5(data);
    let date = new Date().toUTCString();

    let signature = this.makeAVSignature(data, date);
    let headers = {
      'Authorization': `UPYUN ${this.operator}:${signature}`,
      'Date': date,
      'Content-MD5': contentMD5
    };
    let form = data;
    this._requests(method, path, headers, form, callback);
  }

  _requests(method, path, headers, form, callback) {
    request({
      method: method,
      url: this._host + path,
      headers: headers,
      form: form
    }, (err, response, body) => {
      callback(err, body);
    });
  }

  makeAVSignature(data, date) {
    var signature = crypto.createHmac('sha1', this.password)
      .update('POST&' + this.PRETREAT + '&' + date + '&' + this.makeContentMD5(data)).digest('base64');
    return signature;
  }
  makeContentMD5(form) {
    if (!form) return null;
    let contentMD5 = '';
    Object.keys(form).forEach(function(key) {
      contentMD5 += key + '=' + encodeURIComponent(form[key]) + '&';
    });
    contentMD5 = crypto.createHash('md5').update(contentMD5.slice(0, -1)).digest('hex');
    return contentMD5;
  }
}

