'use strict';

var util = require('util');
var https = require('https');
var url = require('url');

var winston = require('winston');

var SlackWebHook = exports.SlackWebHook = winston.transports.SlackWebHook = function (options) {
  options = options || {};
  this.name = options.name || 'slackWebHook';
  this.level = options.level || 'info';
  this.formatter = options.formatter || null;

  this.webhookUrl = options.webhookUrl || '';
  this.channel = options.channel || '';
  this.username = options.username || '';
  this.iconEmoji = options.iconEmoji || '';
  this.iconUrl = options.iconUrl || '';
  this.unfurlLinks = !!options.unfurlLinks;

  var parsedUrl = url.parse(this.webhookUrl);
  this.host = parsedUrl.hostname;
  this.port = parsedUrl.port || 443;
  this.path = parsedUrl.path;
}

util.inherits(SlackWebHook, winston.Transport);

SlackWebHook.prototype.log = function (level, msg, meta, callback) {
  if (typeof this.formatter === 'function') {
    msg = this.formatter({
      level: level,
      message: msg,
      meta: meta
    });
  }

  var payload = {
    text: msg,
    channel: this.channel,
    username: this.username,
    icon_emoji: this.iconEmoji,
    icon_url: this.iconUrl,
    unfurl_links: this.unfurlLinks,
  };

  if (Object.keys(meta).length > 0) {
    var color;
    switch (level) {
      case 'error': color = "danger"; break;
      case 'warn': color = "warning"; break;
      default: color = "good";
    }
    var attachments = [];
    for (let key in meta){
      if (meta.hasOwnProperty(key)) {
        attachments.push({
            fallback: util.inspect(meta[key]),
            text: `${key}: ${util.inspect(meta[key])}`,
            color: color,
        })
      }
    }
    payload.attachments = attachments;
  }

  var data = JSON.stringify(payload);

  var req = https.request({
    host: this.host,
    port: this.port,
    path: this.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }, function (res) {
    var body = '';
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      if (res.statusCode === 200) {
        callback(null, body);
      } else {
        callback(new Error('https request fails. statusCode ' + res.statusCode + ', body ' + body));
      }
    });
  });

  req.write(data);
  req.end();
};
