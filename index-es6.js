/**
 * Created by Cray on 2016/4/29.
 */
import http from 'http'
import url from "url"
import querystring from "querystring"
import os from 'os'

let created = false
let instance = null
class Log {
    constructor() {
        this.envArray = ['development', 'testing', 'prepare', 'production']
        
        if (!created) {
            created = true
            instance = new Log()
        }
        return instance
    }

    config(pjKey, env) {
        this.pjKey = pjKey || '0'
        this.enable = false
        this.env = env || process.env.NODE.ENV
        let index = this.envArray.indexOf(this.env)
        if (index > -1) {
            this.enable = true
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
   
    // msg struct
    // path: req.path,
    //             params: req.query || req.body,
    //             message: err.message,
    //             status: err.status,
    //             stack: err.stack

    _consolePrint(type, level, msg) {
        const fn = console[type]
        if (fn) {          
            let serverInfo = {hostname: os.hostname(), 
                ip: os.networkInterfaces().address,
                platform: os.platform(),
                release: os.release(),
                nodeVersion: process.version}

            let data = this._paramFormat({ "pjKey": this.pjKey, "type": type, env: this.env, "action": "4001", 
                "url": '', server: serverInfo, "logData": msg })

            if(this.enable){
                if(this.env == 'production'){
                    if(level > 0){
                        this._sendRequst(data)
                    }
                }else{
                    this._sendRequst(data)
                }
            } 

            fn.apply(console, this._formatMsg(type, msg))         
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