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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var created = false;
var instance = null;

var Log = function () {
    function Log() {
        _classCallCheck(this, Log);

        this.envArray = ['development', 'testing', 'preproduction', 'production'];
        this.envNameArray = ['开发环境', '测试环境', '预上线环境', '正式环境'];
        if (!created) {
            created = true;
            instance = new Log();
        }
        return instance;
    }

    _createClass(Log, [{
        key: "config",
        value: function config() {
            var porjectName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '项目名称未配置';
            var env = arguments[1];

            this.projectName = porjectName;
            this.envName = '';
            this.enable = false;
            var index = this.envArray.indexOf(env);
            if (index > -1 && env != 'production') {
                this.enable = true;
                this.envName = this.envNameArray[index];
            }
        }
    }, {
        key: "debug",
        value: function debug() {
            for (var _len = arguments.length, msg = Array(_len), _key = 0; _key < _len; _key++) {
                msg[_key] = arguments[_key];
            }

            this._consolePrint('debug', msg);
        }
    }, {
        key: "log",
        value: function log() {
            for (var _len2 = arguments.length, msg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                msg[_key2] = arguments[_key2];
            }

            this._consolePrint('log', msg);
        }
    }, {
        key: "info",
        value: function info() {
            for (var _len3 = arguments.length, msg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                msg[_key3] = arguments[_key3];
            }

            this._consolePrint('info', msg);
        }
    }, {
        key: "warn",
        value: function warn() {
            for (var _len4 = arguments.length, msg = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                msg[_key4] = arguments[_key4];
            }

            this._consolePrint('warn', msg);
        }
    }, {
        key: "error",
        value: function error() {
            for (var _len5 = arguments.length, msg = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                msg[_key5] = arguments[_key5];
            }

            this._consolePrint('error', msg);
        }
    }, {
        key: "_consolePrint",
        value: function _consolePrint(type, msg) {
            var fn = console[type];
            if (fn) {
                fn.apply(console, this._formatMsg(type, msg));
                var imgData = this._paramFormat({ "projectName": this.projectName, "type": type, env: this.envName, "action": "4001", "pageName": this.projectName + "\u670D\u52A1\u7AEF", "logData": msg });
                if (this.enable) {
                    this._sendRequst(imgData);
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
                    // console.log(`响应主体: ${chunk}`);
                });
                res.on('end', function () {
                    //console.log('响应中已无数据。');
                });
            });

            req.on('error', function (e) {
                //console.error(`请求遇到问题: ${e.message}`);
            });

            // 写入数据到请求主体
            req.write(postData);
            req.end();
        }
    }]);

    return Log;
}();

exports.default = new Log();