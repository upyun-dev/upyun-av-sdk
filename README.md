# UPYUN-AV-SDK

## Installation

```
$ npm i git+https://github.com/upyun-dev/upyun-av-sdk.git --save
```

## initial

```
let UpYunAV = require('upyun-av-sdk');
let av = new UpYunAV(bucket, operator, password);
```

| 参数 | 作用 |
| --- | --- |
| bucket | 要使用的 `upyun` 空间名字 |
| operator | 拥有 `bucket` 授权的操作员 |
| password | 拥有 `bucket` 授权的操作员的密码 |

## Usage

### pretreat

[提交处理任务](http://docs.upyun.com/cloud/av/#_3)

```
let notify_url = '<notify_url>';
let source = '/test/test.mp4';
let tasks = [
  {
    "type": "video",                        // 视频转码
    "avopts": "/s/240p(4:3)/as/1/r/30",     // 参数
    "return_info": true,                    // 返回元数据
    "save_as": "/test/test-o.mp4"           // 保存路径
  }
];

av.pretreat(tasks, source, notify_url, (err, data) => {
  console.log(err, data);
});
/**
 * null '["0e9b311fd13de3067cdcb082996e1c6d"]'
 */
```

### status

[进度查询](http://docs.upyun.com/cloud/av/#_6)

```
let task_ids = '0e9b311fd13de3067cdcb082996e1c6d';

av.status(task_ids, (err, body) => {
  console.log(err, body);
});
/**
 * null '{"tasks":{"0e9b311fd13de3067cdcb082996e1c6d":100}}'
 */
```

### result

[结果查询](http://docs.upyun.com/cloud/av/#_7)

```
av.result(task_ids, (err, body) => {
  console.log(err, body);
});
/**
 * null { tasks:
 * { '0e9b311fd13de3067cdcb082996e1c6d':
 *   { bucket_name: 'sl-file',
 *      timestamp: 1486192670,
 *      task_id: '0e9b311fd13de3067cdcb082996e1c6d',
 *      status_code: 200,
 *      signature: 'dd7326b31c2b2e11',
 *      path: [Object],
 *      info: [Object],
 *      description: 'OK' } } }
 */
```
