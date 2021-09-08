---
title: js 成长之路
copyright: true
date: 2021-08-27 14:20:09
tags: js
---

判断js  数据类型的三种方法：
typeof: 只能判断基础的数据类型，特别注意，typeof null === 'object' 
instanceOf: instanceof 可以准确地判断复杂引用数据类型，但是不能正确判断基础数据类型；
Object.prototype.toString.call()

1. 实现instanceOf

```javascript
function myInstanceOf (left, right) {
    if (left === null || typeof left !== 'object') return
    let proto = Object.getPrototypeOf(left)
    while(true) {
        if (proto === null) return false;
        if (proto === right.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}
123 instanceOf(Number) ---> false
new Number(123) instanceOf(Number) ---> true
```
2. 获取数据类型的方法

```javaScript
function getType (a) {
    let type  = typeof a
    if (type !=== 'object') return type
    Object.prototype.toString.call(a).replace(/^\[object (\S+)\]$/, '$1')
}

```
3. 浅拷贝
    1). 对基础类型做一个最基本的一个拷贝；
    2). 对引用类型开辟一个新的存储，并且拷贝一层对象属性
```javascript
function shallowCopy (obj) {
    if (typeof obj === 'object' && obj !== null) {
        let temp = Array.isArray(obj) ? [] : {}
        for(let key in obj) {
            if (obj.hasOwnProperty(key)) {
                temp[key] = obj[key]
            }
        }
        return temp
    } else {
        return obj
    }
}

```
4. 深拷贝

    (1).乞丐版
```javascript
function deepCopy (target) {
    let temp = JSON.stringify(target)
    return JSON.parse(temp)
}
```
    不能满足：
        1. 针对Date类型，复制后是一个字符串
        2. 针对函数、undefined、symbol 这几种类型，复制后，会消失
        3. 无法拷贝不可枚举的属性，即`enumerable`为`false`的属性，不可被拷贝
        4. 无法拷贝对象的原型链
        5. 拷贝 RegExp 引用类型会变成空对象；
        6. 对象中含有 NaN、Infinity 以及 -Infinity，JSON 序列化的结果会变成 null；
        7. 无法拷贝对象的循环应用，即对象成环 (obj[key] = obj)。
----------------
    (2) 改进版
```javascript
function clone(target) {
	if (typeof target === 'object') {
		let obj = Array.isArray(target) ? [] : {};
		for (const key in target) {
            obj[key] = clone(target[key]);
        }
		return obj;
	} else {
		return target;
	}
}
```
    不能满足：
    1. 拷贝后Date, 和 RegExp 变为空对象
    2. 无法拷贝对象的循环应用，即对象成环 (obj[key] = obj)。
    3. 不能复制不可枚举的属性以及 Symbol 类型
----------------
    （3）最终版
``` javascript
function deepCopy (target, wm = new WeakMap()) {
    const isComplexDataType = (o) => (typeof o === 'object' || typeof o === 'function') && o !== null
    if (target.constructor === Date) {
        return new Date(target)
    }
    if (target.constructor === RegExp) {
        return new RegExp(target)
    }
    //如果循环引用了就用 weakMap 来解决
    if (wm.has(target)) {
        return wm.get(target)
    }
    // 获取对象的所有属性
    let allDesc = Object.getOwnPropertyDescriptors(target)
    //遍历传入参数所有键的特性
    let cloneObj = Object.create(Object.getPrototypeOf(target), allDesc)
    // 把对象里面所有属性缓存起来
    wm.set(target, cloneObj)
    for (let key of Reflect.ownKeys(target)) {
        cloneObj[key] = (isComplexDataType(target[key]) && typeof target[key] !== 'function') ? deepClone(target[key], wm) : target[key]
    }
    return cloneObj
}
```  

解释：   1. `Reflect.ownKeys` 返回一个有由自身属性键组成的数组
        2. `Object.getOwnPropertyDescriptors()` 方法用来获取一个对象的所有自身属性的描述符。