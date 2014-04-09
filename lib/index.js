var request = require('request');
var co = require('co');
var thunkify = require('thunkify');
var http_get = thunkify(request.get);
var http_post = thunkify(request.post);

var http = require('http');
var https = require('https');
var querystring = require('querystring');

var debug;
try{
  debug = require('debug')('MiPush');
} catch(err){
  debug = function(){};
}

var CONST = require('./const.js').CONST;
var CONST_SANDBOX = require('./const.js').CONST_SANDBOX;
var NOTIFY_EFFECT = require('./const.js').NOTIFY_EFFECT;
var NOTIFY_TYPE = require('./const.js').NOTIFY_TYPE;
var NOTIFY_ID = require('./const.js').NOTIFY_ID;
var NOTIFY_FOREGROUND = require('./const.js').NOTIFY_FOREGROUND;
var PASS_THROUGH = require('./const.js').PASS_THROUGH;

debug('http pool size', http.globalAgent.maxSockets);
debug('https pool size', https.globalAgent.maxSockets);

var MiPush = function(_config, is_sandbox){
  this.config = _config;
  //debug('config', this.config);
  if(is_sandbox){
    this.sandbox = true;
  }
};

module.exports = exports = MiPush;

/**
 * Get stats of push notification sending
 *
 * @return {Function}
 * @api public
 */
MiPush.prototype.stats = function(start_date, end_date){
  var msg = {
    "start_date": start_date,
    "end_date": end_date
  };
	var url = this.sandbox ? CONST_SANDBOX.STATS : CONST.STATS;
  var req_option = this.build_request_option(url, msg);
  return http_get(req_option);
};

/**
 * Push to regid
 *
 * @return {Function}
 * @api public
 */
MiPush.prototype.send_to_topic = function(topic, msg, option){
  debug('topic', topic);
  debug('msg', msg);
  option = option || {};
  debug('option', option);
	var _msg = {
		'description': msg.desc,
		'payload': JSON.stringify(msg.payload),
		'topic': topic,
		'title': msg.title,
		'notify_type': option.notify_type || NOTIFY_TYPE.DEFAULT,
		'pass_through': option.pass_through || PASS_THROUGH.NO,
		'notify_id': option.notify_id || NOTIFY_ID.ID_0,
		'extra.notify_foreground': option.notify_foreground || NOTIFY_FOREGROUND.KEEP,
		/*'time_to_live': 1000,
		'alias':'string array',
		'registration_id':'000'*/
    'extra.notify_effect': option.notify_effect || NOTIFY_EFFECT.DEFAULT
	};
  debug('option.notify_foreground', option.notify_foreground);
  if(option.hasOwnProperty('notify_foreground')){
    _msg['extra.notify_foreground'] = option.notify_foreground;
  } else {
    _msg['extra.notify_foreground'] = NOTIFY_FOREGROUND.DEFAULT;
  }

  if(option.sound_url){
    _msg.extra.sound_url = option.sound_url;
  }

  if(option.notify_effect){
    if(option.notify_effect == NOTIFY_EFFECT.INTENT_URI && option.intent_uri){
      _msg['extra.intent_uri'] = option.intent_uri;
    } else if(option.notify_effect == NOTIFY_EFFECT.WEB_URI && option.web_uri){
      _msg['extra.web_uri'] = option.web_uri;
    }
  }

	var url = this.sandbox ? CONST_SANDBOX.S_MSG_TOPIC : CONST.S_MSG_TOPIC;
	var req_option = this.build_request_option(url, _msg);
  return http_post(req_option);
};

/**
 * build message for pushing
 *
 * @api private
 */
MiPush.prototype.build_msg = function(msg){
  msg['restricted_pakage_name'] = this.config.PACKAGE_NAME;
};

/**
 * build request option
 *
 * @return {Object}
 * @api private
 */
MiPush.prototype.build_request_option = function(url, msg){
  this.build_msg(msg);
  var _url = url + '?' + querystring.stringify(msg);
  debug('url', _url);
  return {
    url: _url,
    headers: {
      'Authorization': 'key=' + this.config.APP_SECRET
    }
  };
};

/*
var body = {
  "start_date": "20140330",
  "end_date": "20140408",
  "restricted_pakage_name": MiPush_Config.PACKAGE_NAME
};
var url = "https://api.xmpush.xiaomi.com/v1/stats/message/counters?" + querystring.stringify(body);

debug('url', url);
var option = {
  url: url,
  headers: {
    'Authorization': 'key=' + MiPush_Config.APP_SECRET
  }
};

http_get(option)(function(err, res){
  debug('err', err);
  debug('res', res.body);
});

var msg = {
  'description': 'this is description',
  'payload': 'this is payload',
  'restricted_pakage_name': MiPush_Config.PACKAGE_NAME,
  'topic': 'cc',
  'title': 'this is title',
  'notify_type': 2,
  'time_to_live': 1000
};
url = "https://api.xmpush.xiaomi.com/v2/message/topic?" + querystring.stringify(msg);
option = {
  url: url,
  headers: {
    'Authorization': 'key=' + MiPush_Config.APP_SECRET
  }
};
http_post(option)(function(err, res){
  debug('err', err);
  debug('res', res.body);
});
*/
