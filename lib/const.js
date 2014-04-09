exports.CONST = {
	'STATS':'https://api.xmpush.xiaomi.com/v1/stats/message/counters',
	'M_MSG_REGIDS':'https://api.xmpush.xiaomi.com/v2/multi_messages/regids',
	'M_MSG_ALIASES':'https://api.xmpush.xiaomi.com/v2/multi_messages/aliases',
	'S_MSG_REGID':'https://api.xmpush.xiaomi.com/v2/message/regid',
	'S_MSG_ALIAS':'https://api.xmpush.xiaomi.com/v2/message/alias',
	'S_MSG_TOPIC':'https://api.xmpush.xiaomi.com/v2/message/topic'
};

exports.CONST_SANDBOX = {
	'STATS':'https://sandbox.xmpush.xiaomi.com/v1/stats/message/counters',
	'MSG_REGIDS':'https://sandbox.xmpush.xiaomi.com/v2/multi_messages/regids',
	'MSG_ALIASES':'https://sandbox.xmpush.xiaomi.com/v2/multi_messages/aliases',
	'S_MSG_REGID':'https://sandbox.xmpush.xiaomi.com/v2/message/regid',
	'S_MSG_ALIAS':'https://sandbox.xmpush.xiaomi.com/v2/message/alias',
	'S_MSG_TOPIC':'https://sandbox.xmpush.xiaomi.com/v2/message/topic'
};

exports.NOTIFY_TYPE = {
  DEFAULT: -1,
  SOUND: 1 << 0,
  VIBRATE: 1 << 1,
  LIGHTS: 1 << 2
};

exports.NOTIFY_ID = {
  DEFAULT: 0,
  ID_0: 0,
  ID_1: 1,
  ID_2: 2,
  ID_3: 3,
  ID_4: 4
};

exports.NOTIFY_FOREGROUND = {
  DEFAULT: 1,
  DISCARD: 0,
  KEEP: 1
};

exports.NOTIFY_EFFECT = {
  DEFAULT: 1,
  INTENT_URI: 2,
  WEB_URI: 3
};

exports.PASS_THROUGH = {
  DEFAULT: 0,
  NO: 0,
  YES: 1
};
