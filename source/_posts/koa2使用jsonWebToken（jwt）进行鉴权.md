---
title: koa2使用jsonWebToken（jwt）进行鉴权
copyright: true
date: 2020-03-08 18:59:14
tags: nodejs, koa2
---

最近使用koa2的时候，想到使用jwt进行 鉴权。于是就使用了。下面是具体引用步骤

## 安装依赖包

 `npm install jsonwebtoken` 和 `npm install koa-jwt`. `jsonwebtoken`是当下最通用
 的服务端与客户端鉴权方式。即： 客户端输入账号密码，请求服务端后，服务端通过`jsonwebtoken`
 生成一个`token`字符串，返回给客户端，此后，客户端与服务器的会话都由这个`token` 来保持, 这
 
 个生成的`token`会对应客户端传来的账号和密码。每次客户端携带这个`token`来进行身份识别。

## 使用`kow-jwt`中间件

 在`app.js`中引入 `kow-jwt`。然后设置中间件，使得每次请求都来校验`token`

 ```javascript

 const koajwt = require('koa-jwt')
 // 密钥
 const jwtSecret = 09876
 app.use(koajwt({
  secret: jwtSecret
 }).unless({
  // 表示users/register, users/login 不做token验证
  path: [/^\/users\/register/,/^\/users\/login/]
 }));

 ```

## 生成`token`

在`login`接口处使用jwt的sign 方法 生成`token`

```javascript
const jwt = require('jsonwebtoken')
// 注意，这个地方的密钥和app.js中的一样
const jwtSecret = 09876
// token的过期时间
const expireTime = '10s'
const login = async function (ctx, next) {
    const req = ctx.request.body;
    if (!req.mobile || !req.password) {
        ctx.body = {
            code: -1,
            desc: '手机号或者密码不能为空'
        }
    } else {
        const data = await user.find(req.mobile)
        if (data) {
            if (data.password === req.password) {
                // 生成token,接受三个参数： 1 存储在token中的数据，2 密钥， 3 option。设置过期时间
                const token = jwt.sign({
                    mobile: req.mobile,
                    passWord: req.password
                }, jwtSecret, { expiresIn: expireTime })
                ctx.body = {
                    code: 0,
                    desc: '登录成功',
                    data: {
                        token: token // 生成token 后将其返回
                    }
                }
            } else {
                ctx.body = {
                    code: -1,
                    desc: '密码错误'
                }
            }
        } else {
            ctx.body = {
                code: -1,
                desc: '未注册'
            }
        }
    }
}
```

## 验证`token`

我们写一个接口`getUserInfo`来验证token是否可用
```javascript
const getUserInfo = function (ctx, next) {
    const req = ctx.request.body
    // 一般情况下token 是通过header来传递的
    const token = ctx.header.authorization
    // 解析token
    const result = await tool.verifyToken(token);
    // result 就是用户登录时存到jsonwebtoken中的登录信息
    // 拿这个里面的信息去查数据库，取到用户的基本信息
    const data = await user.find(req.mobile)
    ctx.body = {
        code: 0,
        desc: '获取用户信息成功',
        data: data
    }
}

// tool.js的 verifyToken 方法
const getToken = require('jsonwebtoken')
// 注意，这个地方的密钥和app.js中的一样
const jwtSecret = 09876
const verifyToken = function (token) {
    return new Promise((reslove, reject) => {
        const info = getToken.verify(token.split(' ')[1], jwtSecret);
        reslove(info);
    })
}
```

## 总结
 上面就是`jswonwebtoken`的全部使用流程，希望可以帮助到你。谢谢