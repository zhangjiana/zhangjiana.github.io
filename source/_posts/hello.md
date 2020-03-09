title: hexo 博客网站搭建记录
date: 2019-04-13 17:04:19
tags:
categories: [hexo博客]
---

## hexo 写作
```shell
$ hexo new [layout] <title>
```
`[layout]`是指布局，一般用`post`;

## hexo 热更新

```shell
$ hexo s -g --debug
```
支持热更新，修改配置文件后刷新一下可以看到即时效果

但如果修改了 post，则需要重新运行一下。（命令中 g 是 generate 的缩写，s 是 sever 的缩写）

## hexo 更改主题
1. 在https://hexo.io/themes/找到喜欢的主题 
2. 使用git clone 下喜欢的主题
3. 克隆后，找到_config.yml文件中的theme,将名称改为主题名称即可

## hexo 发到github pages 上时遇到的坑
（1） 执行`hexo deploy`后， 总是收到邮件 pages build failed。回到github 上本仓库的setting,可以看到‘	The tag fancybox on line 77 in themes/landscape/’ 报了这个错误。
 根本原因是 hexo 的默认主题 landscape 中的readme.md中一些描述不符合github pages 中的一些规定， 把这个readme.md 删掉就可以了。
 
 （2）执行了`hexo deploy`后，我以为就完事了，打开我的https://zhangjiana.github.io/myBlob/页面后，发现啥也没有。
 在网上搜了一下。在_config.yml中最下面的deploy中，加上branch: master。 重新部署就可以了。官网上说的是默认会知道当前的分支，不用指定，可我发现还是指定了才能打开博客页面。

## hexo 打开阅读全文
Hexo 的 Next 主题默认是首页显示你每篇文章的全文内容，但这会使你的首页篇幅过于冗长。
在theme/next目录下的_config.yml中，找到下面代码，改为`ture`即可。
```
auto_excerpt:
      enable: false
      length: 150
```
## hexo  加入阅读次数
1. 打开leancloud官网 https://leancloud.cn，注册一个账号。然后创建一个class 为 Counter的类，然后在heme/next目录下的_config.yml中，找到`leancloud_visitors`，把你的appid 和appkey填进去，重新启动就可以了。


 ## 最后
 大功告成，一直都想拥有一个自己的博客网站。到今天才算是正式有了一个博客，莫名的开心。以后我会好好记录工作中遇到的技术难题，分享我的踩坑日常。敬请期待！
 
 