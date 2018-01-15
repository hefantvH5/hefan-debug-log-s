/**
 * Created by Cray on 2016/4/29.
 */
import http from 'http';
import url from "url";
import querystring from "querystring";
let created = false;
let instance = null;
class Log {
    constructor() {
        this.envArray = ['development', 'testing', 'preproduction', 'production'];
        this.envNameArray = ['开发环境', '测试环境', '预上线环境', '正式环境'];
        if (!created) {
            created = true;
            instance = new Log();
        }
        return instance
    }
    config(porjectName = '项目名称未配置', env) {
        this.projectName = porjectName;
        this.envName = '';
        this.enable = false;
        let index = this.envArray.indexOf(env);
        if (index > -1 && env != 'production') {
            this.enable = true;
            this.envName = this.envNameArray[index]
        }
    }
    debug(...msg) {
        this._consolePrint('debug', msg);
    }

    log(...msg) {
        this._consolePrint('log', msg);
    }

    info(...msg) {
        this._consolePrint('info', msg);
    }

    warn(...msg) {
        this._consolePrint('warn', msg);
    }

    error(...msg) {
        this._consolePrint('error', msg);
    }

    _consolePrint(type, msg) {
        const fn = console[type];
        if (fn) {
            fn.apply(console, this._formatMsg(type, msg));
            let imgData = this._paramFormat({ "projectName": this.projectName, "type": type, env: this.envName, "action": "4001", "pageName": `${this.projectName}服务端`, "logData": msg });
            if (this.enable) {
                this._sendRequst(imgData);
            }
        }

    }
    _getTime() {
        let d = new Date();
        return String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds());
    }

    _paramFormat(data) {
        let result = {};
        result.data = JSON.stringify(data);
        return result;
    }

    _formatMsg(type, msg) {
        msg.unshift(this._getTime() + ' [' + type + '] > ');
        return msg;
    }
    _sendRequst(data) {
        console.log(`响应主体:`);
        const postData = querystring.stringify(data);

        const options = {
            hostname: 'debug.hefantv.com',
            path: '/api/postDebug',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`响应主体: ${chunk}`);
            });
            res.on('end', () => {
                console.log('响应中已无数据。');
            });
        });

        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
        });

        // 写入数据到请求主体
        req.write(postData);
        req.end();

    }

}



export default new Log();