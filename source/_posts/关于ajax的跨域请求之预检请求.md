---
title: 关于ajax的跨域请求之预检请求
copyright: true
date: 2019-04-21 11:28:09
tags: ['ajax跨域']
categories: [前端]
---
## 请求服务器，浏览器返回 OPTIONS
上周在一个项目中，我打算把token和用户id,通过http协议的header传递给后台，这样比较安全一些。可是我设置完header后，请求后台时，后台给我报了400，提示跨域请求了。我在method的方法中看到并不是我传的GET方法，而是一个OPTION.

## 跨域请求的简单请求与非简单请求
于是在网上搜了一下，找到了原因。原来跨域的时候，浏览器发起的请求分为简单请求和非简单请求。

### 简单请求
[参考链接](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
+ 使用下列方法之一：
 + GET
 + HEAD
 + POST
+ Fetch 规范定义了对 CORS 安全的首部字段集合，不得人为设置该集合之外的其他首部字段。该集合为：
 + Accept
 + Accept-Language
 + Content-Language
 + Content-Type （需要注意额外的限制）
 + DPR
 + Downlink
 + Save-Data
 + Viewport-Width
 + Width
+ Content-Type 的值仅限于下列三者之一：
 + text/plain
 + multipart/form-data
 + application/x-www-form-urlencoded
+ 请求中的任意XMLHttpRequestUpload 对象均没有注册任何事件监听器；XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问。
+ 请求中没有使用 ReadableStream 对象 

所以这样来看，我之前只是简单的通过GET方法向后台请求，后台设置 `Access-Control-Allow-Origin: *` 就可以连通了。
但是我这次是设置了自定义的header,没有符合上述简单请求的条件，所以是无法连接上的。

### 非简单请求
+ 使用了下面任意一种HTTP 方法： 
 + PUT
 + DELETE
 + CONNECT
 + OPTIONS
 + TRACE
 + PATCH
+ 人为设置了对 CORS 安全的首部字段集合之外的其他首部字段。该集合为：
 + Accept
 + Accept-Language
 + Content-Language
 + Content-Type (需要注意额外的限制)
 + DPR
 + Downlink
 + Save-Data
 + Viewport-Width
 + Width
+  Content-Type 的值不属于下列之一:
 + application/x-www-form-urlencoded
 + multipart/form-data
 + text/plain
其实说明白了，也就是简单请求的反面，就是非简单请求。非简单请求需要在正式与服务器建立连接之前发送一个预检请求，以获知服务器是否允许该实际请求。"预检请求“的使用，可以避免跨域请求对服务器的用户数据产生未预期的影响。这个预检请求就是先向服务器发送了一个METHOD 为 OPTION的方法。
我在`axios`中使用了`headers{ userid: params('userid')}`，即自定义了header,触发了预检请求，所以就向服务器发送了OPTION 方法。服务器那里可能不接受我的请求，所以返回了400。 我问了后台同事了解情况，他们那里是之前封装的统一方法，不认识 OPTION方法，所以给我返回了 400。

## 解决方法
经过协调， 后台在代码中加入以下片段，就可以调通了
```
if ("OPTIONS".equals(request.getMethod())){//这里通过判断请求的方法，判断此次是否是预检请求，如果是，立即返回一个204状态吗，标示，允许跨域；预检后，正式请求，这个方法参数就是我们设置的post了
          response.setStatus(HttpStatus.SC_NO_CONTENT); //HttpStatus.SC_NO_CONTENT = 204
          response.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS, DELETE");//当判定为预检请求后，设定允许请求的方法
          response.setHeader("Access-Control-Allow-Headers", "Content-Type, x-requested-with, Token"); //当判定为预检请求后，设定允许请求的头部类型
          response.addHeader("Access-Control-Max-Age", "1");                           
        
```
最后终于调通了。以上代码来自[cors跨域之简单请求与预检请求（发送请求头带令牌token）](https://segmentfault.com/a/1190000009971254)