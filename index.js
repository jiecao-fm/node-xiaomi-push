var MiPush = require('./lib');

module.exports = exports = MiPush;

var MiPush_Config = require('config').MiPush;

var push = new MiPush(MiPush_Config);
push.stats('20140330', '20140408')(function(err, res){
	console.log('err', err);
  console.log('res', res.body);
});
