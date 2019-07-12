---
title: Flutter 学习笔记（一）
copyright: true
date: 2019-07-10 22:29:43
tags:
---

## Flutter 的安装
由于我用的是mac 电脑，于是就按照官网上的mac安装方法一步一步安装。

### 第一步：下载并解压`flutter`的安装包
网址： https://flutter.dev/docs/get-started/install/macos

### 第二步： 配置环境变量
在根目录下找到`.base_profile`文件，或者直接打开终端，输入：
```shell
vim ~/.bash_profile
``` 
然后在打开的文件中（如果没有此文件，则是新建文件），加入以下一行代码：
```code
export PATH='$PATH: Users/XXX/flutter/bin'
```
提示： 上面的路径要写你第一步中解压后的flutter的路径。这一点很重要哦

然后执行下面的命令，使环境变量生效：
```shell
source ~/.bash_profile
```
然后试试看成功了没：
```shell
flutter -h
```
如果有flutter的相关帮助信息输出，则说明环境变量配置成功
至此，环境变量安装完成。

### 第三步： 安装`flutter`所需要的开发环境
执行以下命令来检查当前开发环境：
```shell
flutter doctor
```
按照上面的提示，一步一步在终端执行
### 