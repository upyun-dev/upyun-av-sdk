import AvPretreatment from '../../src/av';
import {env} from 'process';
import should from 'should';
import nock from 'nock';

const bucket = env.UPYUN_BUCKET;
const username = env.UPYUN_USERNAME;
const password = env.UPYUN_PASSWORD;

let av = new AvPretreatment(bucket, username, password);
let taskIDs = ['0e9b311fd13de3067cdcb082996e1c6d'];

describe('av.js', () => {

  describe('#pretreat()', () => {
    context('when usage is normal', () => {
      before(() => {
        nock(av.HOST)
         .post(av.PRETREAT)
         .times(1)
         .reply(200, JSON.stringify(taskIDs));
      });
      it('should return ids', (done) => {
        let notifyUrl = '<notify_url>';
        let source = '/test/test.mp4';
        let tasks = [{
          type: 'video', // 视频转码
          'avopts': '/s/240p(4:3)/as/1/r/30', // 参数
          'return_info': true, // 返回元数据
          'save_as': '/test/test-o.mp4' // 保存路径
        }];
        av.pretreat(tasks, source, notifyUrl, (err, value) => {
          if (err) return done(err);
          let v = JSON.parse(value);
          v.should.be.deepEqual(taskIDs);
          done();
        });
      });
    });
  });
  describe('#status()', () => {
    context('when usage is normal', () => {
      before(() => {
        nock(av.HOST)
          .get(av.STATUS)
          .times(1)
          .query({
            service: bucket,
            task_ids: taskIDs[0]
          })
          .reply(200, JSON.stringify({
            tasks: {
              [taskIDs[0]]: 100
            }
          }));
      });
      it(`should response tasks ${taskIDs[0]} is 100`, (done) => {
        av.status(taskIDs, (err, value) => {
          if (err) return done(err);
          let v = JSON.parse(value);
          v.should.be.deepEqual({
            tasks: {
              [taskIDs[0]]: 100
            }
          });
          done();
        });
      });
    });
  });
  describe('#result()', () => {
    let str = `{"tasks":{"${taskIDs[0]}":{"bucket_name":"sl-file","timestamp":1486192670,"task_id":"${taskIDs[0]}","status_code":200,"signature":"dd7326b31c2b2e11","path":["\\/test\\/test-o.mp4"],"info":{"format":{"filesize":17755475,"duration":357.402,"bitrate":397434,"fullname":"QuickTime \\/ MOV","format":"mov,mp4,m4a,3gp,3g2,mj2"},"streams":[{"duration":357.333333,"video_height":240,"video_width":426,"codec_desc":"H.264 \\/ AVC \\/ MPEG-4 AVC \\/ MPEG-4 part 10","metadata":{"handler_name":"VideoHandler","language":"und"},"index":0,"type":"video","bitrate":259147,"codec":"h264","video_fps":30},{"audio_samplerate":44100,"duration":357.401542,"codec_desc":"AAC (Advanced Audio Coding)","metadata":{"handler_name":"SoundHandler","language":"und"},"bitrate":129725,"type":"audio","audio_channels":2,"codec":"aac","index":1}]},"description":"OK"}}}`;
    context('when usage is normal', function() {
      before(() => {
        nock(av.HOST)
          .get(av.RESULT)
          .times(1)
          .query({
            service: bucket,
            task_ids: taskIDs[0]
          })
          .reply(200, str);
      });
      it('should response an valid Object', (done) => {
        av.result(taskIDs, (err, value) => {
          if (err) return done(err);
          let v = JSON.parse(value);
          should(v.tasks[taskIDs[0]]).be.an.instanceOf(Object);
          done();
        });
      });
    });
  });
});
