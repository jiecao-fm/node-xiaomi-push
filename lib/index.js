var request = require('request');
var thunkify = require('thunkify');
var http_get = thunkify(request.get);
var http_post = thunkify(request.post);
var _ = require('lodash');
var querystring = require('querystring');

var debug;
try{
  debug = require('debug')('MiPush');
} catch(err){
  debug = function(){};
}

var CONST = require('./const.js');
var API_URL = CONST.API_URL;
var API_URL_SANDBOX = CONST.API_URL_SANDBOX;
var NOTIFY_EFFECT = CONST.NOTIFY_EFFECT;
var NOTIFY_TYPE = CONST.NOTIFY_TYPE;
var NOTIFY_ID = CONST.NOTIFY_ID;
var NOTIFY_FOREGROUND = CONST.NOTIFY_FOREGROUND;
var PASS_THROUGH = CONST.PASS_THROUGH;

var MiPush = function(_config, is_sandbox){
  this.config = _config;
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
	var url = this.sandbox ? API_URL_SANDBOX.STATS : API_URL.STATS;
  var req_option = this.build_request_option(url, msg);
  return http_get(req_option);
};

/**
 * Push to topic
 *
 * @return {Function}
 * @api public
 */
MiPush.prototype.send_to_topic = function(topic, msg, option){
  debug('topic', topic);
	var _msg = {
		'description': msg.desc,
		'payload': JSON.stringify(msg.payload),
		'title': msg.title,
		'topic': topic
	};

	var url = this.sandbox ? API_URL_SANDBOX.S_MSG_TOPIC : API_URL.S_MSG_TOPIC;
  return this.send_msg(_msg, option, url);
};

/**
 * Push to aliases
 *
 * @return {Function}
 * @api public
 */
MiPush.prototype.send_to_aliases = function(aliases, msg, option){
  debug('aliases', aliases);
	var _msg = {
		'description': msg.desc,
		'payload': JSON.stringify(msg.payload),
		'title': msg.title,
		'alias': aliases
	};

	var url = this.sandbox ? API_URL_SANDBOX.S_MSG_ALIAS : API_URL.S_MSG_ALIAS;
  return this.send_msg(_msg, option, url);
};

/**
 * Push to registration_id
 *
 * @return {Function}
 * @api public
 */
MiPush.prototype.send_to_reg_id = function(reg_id, msg, option){
  debug('reg_id', reg_id);
	var _msg = {
		'description': msg.desc,
		'payload': JSON.stringify(msg.payload),
		'title': msg.title,
		'registration_id': reg_id
	};

	var url = this.sandbox ? API_URL_SANDBOX.S_MSG_REGID : API_URL.S_MSG_REGID;
  return this.send_msg(_msg, option, url);
};

/**
 * Send msg to reg_id, topic, aliases
 *
 * @api private
 */
MiPush.prototype.send_msg = function(msg, option, url){
  option = option || {};
  debug('option', option);
	var extend_msg = {
		'notify_type': option.notify_type || NOTIFY_TYPE.DEFAULT,
		'pass_through': option.pass_through || PASS_THROUGH.NO,
		'notify_id': option.notify_id || NOTIFY_ID.ID_0,
		'extra.notify_foreground': option.notify_foreground || NOTIFY_FOREGROUND.KEEP,
    'extra.notify_effect': option.notify_effect || NOTIFY_EFFECT.DEFAULT
	};

  _.assign(msg, extend_msg);

  // Set notify_foreground
  if(option.hasOwnProperty('notify_foreground')){
    msg['extra.notify_foreground'] = option.notify_foreground;
  } else {
    msg['extra.notify_foreground'] = NOTIFY_FOREGROUND.DEFAULT;
  }

  // Custom sound_url
  if(option.sound_url){
    msg.extra.sound_url = option.sound_url;
  }

  // Custom effect of click notify
  if(option.notify_effect){
    if(option.notify_effect == NOTIFY_EFFECT.INTENT_URI && option.intent_uri){
      msg['extra.intent_uri'] = option.intent_uri;
    } else if(option.notify_effect == NOTIFY_EFFECT.WEB_URI && option.web_uri){
      msg['extra.web_uri'] = option.web_uri;
    }
  }

  // Custom obj_id
  //if(option.hasOwnProperty('obj_id')){
  //  msg['extra.obj_id'] = option.obj_id;
  //}

  debug('msg', msg);

	var req_option = this.build_request_option(url, msg);
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
