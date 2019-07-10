---
title: mongoDB的安装
copyright: true
date: 2019-04-22 22:35:52
tags: 'mongoDb'
---
## 第一步：下载
打开https://www.mongodb.com/download-center， 选择`server`tab选项，会根据你的电脑显示下载包。点击`Download`.

## 第二部：安装
将下载下来 的包解压，然后放到/usr/local/目录下（MAC电脑）。不知道如何打开/usr/local，打开Finder, 按快捷键`command + shift + G`,然后输入`/usr/local`,点击前往文件夹。把解压下来的mongodb的包拷贝到local目录下,此时的mongoDb的地址应该是`/usr/local/mongodb/bin`。

## 第三部：更换目录
如果不想用根目录的`data/db`中存数据库，可以自定义数据库的存储目录。
在目录`/usr/local/mongodb/bin`中执行`./mongodb -dbpath '你的目录'`。目录一定要加引号，不然不会生效。

## 第四部： 启动
在目录`/usr/local/mongodb/bin`中 执行`./mongod`来启动，然后再启动一个终端，在目录`/usr/local/mongodb/bin`中 执行`./mongo`来连接。然后在浏览器中输入：`http://localhost:27017/`,
 看到页面中输出 ‘It looks like you are trying to access MongoDB over HTTP on the native driver port.’。就说明启动成功了。