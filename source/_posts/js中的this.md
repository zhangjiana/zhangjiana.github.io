---
title: js中的this
copyright: true
date: 2022-03-03 15:52:52
tags:
---

## 介绍js中的this

this 是组成上下文的一部分；

1. 浏览器中，全局中的this, 始终指向window；

2. 函数中的this, 指向调用函数的对象

this最终指向的是那个调用它的对象

## 改变this 指向

call/apply/bind

```js
    function say(age) {
        console.log('my name is:' + this.name + ', my age is:' + age);
    }
    var Person = {
        name: 'jane'
    }
    say.call(Person, 10);
    say.apply(Person, [10]);
    say.bind(Person)(10);
```

## call/apply 的区别

call 是多个参数用逗号隔开

apply 多个参数用数组形式传递，即便是就一个参数，也要传数组

apply 的巧用: 
1. 求数组中最大值，或者数组中最小值
```js
Math.max.apply(null, array);
Math.min.apply(null, array);
```

2. 实现两个数组的合并

```js
var arr1=new Array("1","2","3");
var arr2=new Array("4","5","6");
Array.prototype.push.apply(arr1,arr2);
```

## 实现call，apply 和 bind
```js

Function.prototype.myCall = function (obj, ...args) {
    let context = Object(obj) || window;
    context.fn = this;
    let result = eval('context.fn(...args)')
    delete context.fn;
    return result
}

Function.prototype.myApply = function (obj, args) {
    let context = Object(obj) || window;
    context.fn = this;
    let result = eval('context.fn(...args)')
    delete context.fn;
    return result
}
// bind 最后返回的是一个函数
Function.prototype.myBind = function (obj, ...args) {
    if (typeof this !=== function) {
        throw new Error('this must be a function')
    }
    var self = this;
    var f = function () {
        self.apply(this instanceof self ? this : obj, args.concat(Array.prototype.slice.call(arguments)));
    }
    if (this.prototype) {
        f.prototype = Object.create(this.prototype)
    }
    return f;
}

```