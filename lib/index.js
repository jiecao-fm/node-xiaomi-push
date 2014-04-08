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

debug('http pool size', http.globalAgent.maxSockets);
debug('https pool size', https.globalAgent.maxSockets);

var MiPush = function(_config, is_sandbox){
  this.config = _config;
  debug('config', this.config);
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
MiPush.prototype.send = function(_regid, _title, _desc, _payload, _topic){
	var msg = {
		'description': _desc,
		'payload': _payload,
		'topic': _topic,
		'title': _title,
		'notify_type': 2,
		'time_to_live': 1000
	};
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
