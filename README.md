# hefan-debug-log-s
# 说明

>  盒饭TV内部使用

>  针对服务端，解决服务端log无法及时查看问题。

>  环境 node 语言 es6



## 项目使用（nodejs 6.0+）
``` bash

# 安装
npm install --save hefan-debug-log-s

# 配置

在入口js中作如下配置

import Log from "hefan-debug-log-s";

//projectName  项目名称 env 环境

Log.config(projectName, env)

//例子

Log.config('测试项目', 'dev')

# log展示地址
http://debug.hefantv.com/debug




