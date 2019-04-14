---
title: hexo 博客网站搭建记录
date: 2019-04-13 17:04:19
tags:
---
## hexo 热更新

```shell
$ hexo s -g --debug
```
支持热更新，修改配置文件后刷新一下可以看到即时效果

但如果修改了 post，则需要重新运行一下。（命令中 g 是 generate 的缩写，s 是 sever 的缩写）

## hexo 更改主题
[^1]: 在https://hexo.io/themes/找到喜欢的主题
[^2]: 使用git clone 下喜欢的主题
[^3]: 克隆后，找到_config.yml文件中的theme,将名称改为主题名称即可