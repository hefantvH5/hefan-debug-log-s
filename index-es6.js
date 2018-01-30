/**
 * Created by Cray on 2016/4/29.
 */
import http from 'http'
import url from "url"
import querystring from "querystring"
let created = false
let instance = null
class Log {
    constructor() {
        this.envArray = ['development', 'testing', 'prepare', 'production']
        this.envNameArray = ['开发环境', '测试环境', '预上线环境', '正式环境']
        if (!created) {
            created = true
            instance = new Log()
        }
        return instance
    }
    config(porjectName = '项目名称未配置', env) {
        this.projectName = porjectName
        this.envName = ''
        this.enable = false
        this.env = env || process.env.NODE.ENV
        let index = this.envArray.indexOf(env)
        if (index > -1) {
            this.enable = true
            this.envName = this.envNameArray[index]
        }
    }
    debug(...msg) {
        this._consolePrint('log', 0, msg)
    }

    log(...msg) {
        this._consolePrint('log', 1, msg)
    }

    info(...msg) {
        this._consolePrint('info', 2, msg)
    }

    warn(...msg) {
        this._consolePrint('warn', 3, msg)
    }

    error(...msg) {
        this._consolePrint('error', 4, msg)
    }

    _consolePrint(type, level, msg) {
        const fn = console[type]
        if (fn) {
            fn.apply(console, this._formatMsg(type, msg))
            let imgData = this._paramFormat({ "projectName": this.projectName, "type": type, env: this.env, "action": "4001", "pageName": `${this.projectName}服务端`, "logData": msg })
            if(this.enable){
                if(this.env == 'production'){
                    if(level > 0){
                        this._sendRequst(imgData)
                    }
                }else{
                    this._sendRequst(imgData)
                }
            }          
        }

    }
    _getTime() {
        let d = new Date()
        return String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds())
    }

    _paramFormat(data) {
        let result = {}
        result.data = JSON.stringify(data)
        return result
    }

    _formatMsg(type, msg) {
        msg.unshift(this._getTime() + ' [' + type + '] > ')
        return msg
    }
    _sendRequst(data) {
        console.log(`debug消息已发送`)
        const postData = querystring.stringify(data)

        const options = {
            hostname: 'debug.hefantv.com',
            path: '/api/postDebug',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        }

        const req = http.request(options, (res) => {
            res.setEncoding('utf8')
            res.on('data', (chunk) => {
                // console.log(`响应主体: ${chunk}`)
            })
            res.on('end', () => {
                //console.log('响应中已无数据。')
            })
        })

        req.on('error', (e) => {
            //console.error(`请求遇到问题: ${e.message}`)
        })

        // 写入数据到请求主体
        req.write(postData)
        req.end()

    }

}



export default new Log();