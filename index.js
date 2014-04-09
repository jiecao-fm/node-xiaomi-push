var MiPush = require('./lib');
var NOTIFY_EFFECT = require('./lib/const.js').NOTIFY_EFFECT;
var NOTIFY_TYPE = require('./lib/const.js').NOTIFY_TYPE;
var NOTIFY_ID = require('./lib/const.js').NOTIFY_ID;
var NOTIFY_FOREGROUND = require('./lib/const.js').NOTIFY_FOREGROUND;
var PASS_THROUGH = require('./lib/const.js').PASS_THROUGH;

module.exports = exports = MiPush;

var MiPush_Config = require('config').MiPush;

var push = new MiPush(MiPush_Config);
/*push.stats('20140330', '20140408')(function(err, res){
	console.log('err', err);
  console.log('res', res.body);
});*/

/*
push.send_to_topic('cc',
          {
            title: 'jiecao.fm',
            desc: 'you\'ve got mail',
            payload: {
              'hello': 'world'
            }
          }
)(function(err, res){
	console.log('err', err);
  console.log('res', res.body);
});
*/

push.send_to_topic('cc',
          {
            title: 'jiecao.fm',
            desc: '22222222',
            payload: {
              'hello': 'world1'
            }
          },
          {
            notify_type: NOTIFY_TYPE.SOUND | NOTIFY_TYPE.LIGHTS | NOTIFY_TYPE.VIBRATE,
            notify_id: NOTIFY_ID.ID_1,
            notify_foreground: NOTIFY_FOREGROUND.DISCARD
          }
)(function(err, res){
	console.log('err', err);
  console.log('res', res.body);
});
