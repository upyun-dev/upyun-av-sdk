'use strict';
import crypto from 'crypto';

let makeSignature = (operator, password, ...signList) => {
  let signstr = signList.join('&');
  let signature = crypto.createHmac('sha1', password)
    .update(signstr).digest('base64');
  return `UPYUN ${operator}:${signature}`;
};

let makeContentMD5 = (value) => {
  let contentMD5 = crypto.createHash('md5').update(value).digest('hex');
  return contentMD5;
};

let curDt = () => {
  return new Date().toUTCString();
}

export {
  makeContentMD5,
  makeSignature,
  curDt
};