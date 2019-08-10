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

 # mongo 命令学习
 
首先在终端输入`mongo`,进行数据库的连接。然后输入`show dbs`查看当前的数据库， 比如`use test`,使用一个test 数据库。
## 查询命令
`db.collections.find()` 查询名字为`collections`的集合 下的所有数据。
`db.collections.find().count()` 查询数据量

`db.collections.find({name: 'zj'})` 按条件查询
`db.collections.find().limit(10)` 查询前10条数据
`db.collections.find().skip(10).limit(10)` 查询第 11条至 第20条数据
`db.collections.find({num: {$gt: 10}})` 查询 大于 10的数据
`db.collections.find({num: {$gte: 10}})` 查询 大于等于 10 的数据
`db.collections.find({num: {$lt: 10}})` 查询 小于 10 的数据
`db.collections.find({num: {$lte: 10}})` 查询小于等于 10 的数据

`db.collections.find().sort({num: 1})` 查询出来的数据按 num 进行升序排列，如果 num: -1 则为降序
`db.collections.find({}, {name: 1})` 查询出来的结果只显示姓名，如果不想显示id: 则在后面加上：id: 0

## 插入命令
`db.collections.insert({name: 'zj'})` 向集合中插入一个数据

## 删除命令
`db.collections.remove({name: 'zj'})` 删除集合中的某个数据
`db.collections.remove({})` 删除集合中的所有数据

## 更新命令
`db.collections.update({name: 'zj'}, {$set: {age: 1}})`  更新集合中某条数据，为这条数据增加一个属性
`db.collections.update({name: 'zj'}, {$set: {movies: ['hh', 'nn', 'll']}})` 为这条数据设置一个属性，属性值是一个数组
`db.collections.update({name: 'zj'}, {$push: {'movies': 'mm'}})` 为这个数据的属性中新增一个值
`db.collections.update({name: 'zj'}, {$inc: {'sal': 100}})` 意思是在原有值上增加100， `$des`在原有值上 减少一百

`db.collections.replaceOne({name: 'zj'}, {name: 'hahahah'})` 将名字为'zj'的这条数据替换为 {name: 'hahahah'}

`db.collections.update({name: 'zj'}, {$unset: {age: 12}})` 把这条数据中的 age 属性删除, age的值可以随意写

