"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Cray on 2016/4/29.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var created = false;
var instance = null;

var Log = function () {
    function Log() {
        _classCallCheck(this, Log);

        this.envArray = ['development', 'testing', 'prepare', 'production'];

        if (!created) {
            created = true;
            instance = new Log();
        }
        return instance;
    }

    _createClass(Log, [{
        key: "config",
        value: function config(pjKey, env) {
            this.pjKey = pjKey || '0';
            this.enable = false;
            this.env = env || process.env.NODE.ENV;
            var index = this.envArray.indexOf(env);
            if (index > -1) {
                this.enable = true;
            }
        }
    }, {
        key: "debug",
        value: function debug() {
            for (var _len = arguments.length, msg = Array(_len), _key = 0; _key < _len; _key++) {
                msg[_key] = arguments[_key];
            }

            this._consolePrint('log', 0, msg);
        }
    }, {
        key: "log",
        value: function log() {
            for (var _len2 = arguments.length, msg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                msg[_key2] = arguments[_key2];
            }

            this._consolePrint('log', 1, msg);
        }
    }, {
        key: "info",
        value: function info() {
            for (var _len3 = arguments.length, msg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                msg[_key3] = arguments[_key3];
            }

            this._consolePrint('info', 2, msg);
        }
    }, {
        key: "warn",
        value: function warn() {
            for (var _len4 = arguments.length, msg = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                msg[_key4] = arguments[_key4];
            }

            this._consolePrint('warn', 3, msg);
        }
    }, {
        key: "error",
        value: function error() {
            for (var _len5 = arguments.length, msg = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                msg[_key5] = arguments[_key5];
            }

            this._consolePrint('error', 4, msg);
        }
    }, {
        key: "_consolePrint",
        value: function _consolePrint(type, level, msg) {
            var fn = console[type];
            if (fn) {
                fn.apply(console, this._formatMsg(type, msg));

                var serverInfo = { hostname: _os2.default.hostname(),
                    ip: _os2.default.networkInterfaces().address,
                    platform: _os2.default.platform(),
                    release: _os2.default.release(),
                    nodeVersion: process.version };

                var data = this._paramFormat({ "pjKey": this.pjKey, "type": type, env: this.env, "action": "4001",
                    "url": '', server: serverInfo, "logData": msg });

                if (this.enable) {
                    if (this.env == 'production') {
                        if (level > 0) {
                            this._sendRequst(data);
                        }
                    } else {
                        this._sendRequst(data);
                    }
                }
            }
        }
    }, {
        key: "_getTime",
        value: function _getTime() {
            var d = new Date();
            return String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds());
        }
    }, {
        key: "_paramFormat",
        value: function _paramFormat(data) {
            var result = {};
            result.data = JSON.stringify(data);
            return result;
        }
    }, {
        key: "_formatMsg",
        value: function _formatMsg(type, msg) {
            msg.unshift(this._getTime() + ' [' + type + '] > ');
            return msg;
        }
    }, {
        key: "_sendRequst",
        value: function _sendRequst(data) {
            console.log("debug\u6D88\u606F\u5DF2\u53D1\u9001");
            var postData = _querystring2.default.stringify(data);

            var options = {
                hostname: 'debug.hefantv.com',
                path: '/api/postDebug',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            var req = _http2.default.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    // console.log(`响应主体: ${chunk}`)
                });
                res.on('end', function () {
                    //console.log('响应中已无数据。')
                });
            });

            req.on('error', function (e) {
                //console.error(`请求遇到问题: ${e.message}`)
            });

            // 写入数据到请求主体
            req.write(postData);
            req.end();
        }
    }]);

    return Log;
}();

exports.default = new Log();