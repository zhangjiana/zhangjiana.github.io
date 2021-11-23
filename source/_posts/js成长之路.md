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


基本类型存在于栈中，
引用类型的值存在堆中，它的指针存在于栈中


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
    3. 不能复制不可枚举的属性
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
    // 这里解释一些为什么不用for (let key in target).
    // 因为不能把不可枚举属性带出来。 使用Reflect.ownKeys(target)可以把不可枚举属性也列出来
    for (let key of Reflect.ownKeys(target)) {
        cloneObj[key] = (isComplexDataType(target[key]) && typeof target[key] !== 'function') ? deepClone(target[key], wm) : target[key]
    }
    return cloneObj
}
```
解释：   1. `Reflect.ownKeys` 返回一个由自身属性键组成的数组，包括对象里面的不可枚举属性。
        2. `Object.getOwnPropertyDescriptors()` 方法用来获取一个对象的所有自身属性的描述符。
        3. `weakmap` 防止内存泄漏，循环引用复制起来会比较吃内存如果不用weakmap会有问题

内存泄露： 不再用到的内存，没有及时释放，就叫内存泄漏

```javascript
// 验证代码
let obj = {
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: { name: '我是一个对象', id: 1 },
  arr: [0, 1, 2],
  func: function () { console.log('我是一个函数') },
  date: new Date(0),
  reg: new RegExp('/我是一个正则/ig'),
  [Symbol('1')]: 1,
};
Object.defineProperty(obj, 'innumerable', {
  enumerable: false, value: '不可枚举属性' }
);
obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
obj.loop = obj    // 设置loop成循环引用的属性
let cloneObj = deepClone(obj)
cloneObj.arr.push(4)
console.log('obj', obj)
console.log('cloneObj', cloneObj)
```

5. 继承

1). 原型链继承

```javascript
function Parent() {
    this.name = 'parent'
    this.friend = [1,2,3]
}
Parent.prototype.sayName = function () {
    console.log(this.name)
}
function Child() {
    this.type = 'childType'
}
Child.prototype = new Parent()
var c1 = new Child()
var c2 = new Child()
console.log(c1.friend) // 123
c2.friend.push(4)
console.log(c1.friend) // 1234
console.log(c2.friend) // 1234
```

2) 构造函数继承
```javascript
function Parent() {
    this.name = 'parent'
    this.friend = [1,2,3]
}
Parent.prototype.sayName = function () {
    console.log(this.name)
}
function Child () {
    Parent.call(this)
    this.type = 'childType'
}
var c1 = new Child()
var c2 = new Child()
console.log(c1.friend) // 123
c2.friend.push(4)
console.log(c2.friend) // 1234
```

3)组合式继承
```javascript
function Parent() {
    this.name = 'parent'
    this.friend = [1,2,3]
}
Parent.prototype.sayName = function () {
    console.log(this.name)
}
function Child () {
    Parent.call(this)
    this.type = 'childType'
}
Child.prototype = new Parent()
// 手动挂上构造器，指向自己的构造函数
Child.prototype.constructor = Child;

var c1 = new Child()
var c2 = new Child()
```
4)原型式继承
（使用对象字面量的方式）

```javascript
var parent = {
    name: 'parent',
    friend: [1,2,3],
    sayName: () => {
        console.log(this.name)
    }
}
var child = Object.create(parent)
var child2 = Object.create(parent)
console.log(child.friend) // 1,2,3
child2.friend.push(222)
console.log(child.friend) // 1,2,3,222
console.log(child2.friend) // 1,2,3,222
```

5) 寄生式继承

```javascript
var parent = {
    name: 'parent',
    friend: [1,2,3],
    sayName: () => {
        console.log(this.name)
    }
}

function clone(original) {
    let clone = Object.create(original)
    clone.getFriends = function () {
        console.log(this.friend)
    }
    return clone
}
var child3 = clone(parent)

```

6)寄生组合式继承

```javascript

function Parent() {
    this.name = 'parent'
    this.friend = [1,2,3]
}
Parent.prototype.sayName = function () {
    console.log(this.name)
}
function clone (parent, child) {
    // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
}
function Child () {
    Parent.call(this)
    this.type = 'childType'
}
clone(Parent, Child)

Child.prototype.getFriends = function () {
    return this.friend;
}

```

7) ES6 的 extends 继承
```javascript
Class Parent {
    constructor() {
        this.name = 'parent'
    }
    sayName() {
        console.log(this.name)
    }
}

Class Child extends Parent {
    constructor() {
        super()
        this.type = 'child'
    }
    getFriend () {
        console.log(this.friends)
    }
}
```


6. call, apply, bind 三个的区别
```javascript
let a = {

  name: 'jack',

  getName: function(msg) {

    return msg + this.name;

  } 

}

let b = {

  name: 'lily'

}

console.log(a.getName('hello~'));  // hello~jack

console.log(a.getName.call(b, 'hi~'));  // hi~lily

console.log(a.getName.apply(b, ['hi~']))  // hi~lily

let name = a.getName.bind(b, 'hello~');

console.log(name());  // hello~lily

```
7. 实现new
思考： new 的时候，我们都做了什么？
    1. 新建一个对象
    2. 把构造函数中的作用域赋值给这个对象
    3. 把构造函数中的方法和属性给新对象
    4. 返回这个对象

```javascript
    function _new (parent, ...args) {
        if(typeof parent !== 'function') {
            throw 'first param must be a function';
        }
        // 新建一个对象
        var tempObj = new Object()
        // 把构造器的prototype赋值给新对象
        tempObj = Object.create(parent.prototype)
        // 将this和调用参数传给构造器执行
        let res = parent.apply(tempObj, [...args])
        let isObject = typeof parent === 'object' && parent !== null
        let isFunction = typeof parent === 'fuction'  
        // 返回这个对象  
        return isObject || isFunction ? res : tempObj
    }
```
8. 实现 call 和 apply

```javascript
// call 方法接收两个参数， 1. 需要借用的对象，2. 传入的参数（arg1, arg2, ...）
function _call (lendObj, ...args) {
    let context = Object(lendObj) || window
    context.fn = this
    let result = eval('context.fn(...args)')
    delete context.fn
    return result
}
// apply 方法接收参数和call 有所不同， 第二个参数是数组
function _apply (lentObj, args) {
    var context = Object(lendObj) || window
    context.fn = this
    let result = eval('context.fn(...args)');
    delete context.fn
    return result;
}

```
9. 实现bind方法
 bind方法也是实现更改this 指向的功能，但是和call，apply 不同的是，bind方法实现后，需要调用才会返回结果
 ```javascript
 function _bind (context, ...args) {
     if (typeof this !== 'function') {
         throw Error('this must be a function')
     }
     var self = this 
     var fBound = function () {
        self.apply(this instanceof self ? this : context, args.concat(Array.prototype.splice.call(arguments)))
     }
     if (this.prototype) {
         fBound.prototype = Object.create(this.prototype)
     }
     return fBound
 }
 ```


 数组抹平的六种方法：
 1. 循环遍历法
 ```javascript
    function flatten (arr) {
        let result = []
        for(let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                result = result.concat(flatten(arr[i]))
            } else {
                result.push(arr[i])
            }
        }
        return result
    }
 ```
 2. 使用`reduce`
 ```javascript
    function flatten (arr) {
        return arr.reduce((prev, next) => {
            return prev.concat(Array.isArray(next) ? flatten(next) : next)
        }, [])
    }
 ```
 3. 使用es6的 扩展运算符和 some 的方法
 ```javascript
    function flatten (arr) {
        while(arr.some(item => Array.isArray(item))) {
            arr = [].concat(...arr)
        }
        return arr
    }
 ```
 4. 使用 `toString` 和 `split` 方法
 ```javascript
    function flatten (arr) {
        return arr.toString().split(',')
    }
 ```
 5. 使用es6的flat 方法
 ```javascript
    function flatten (arr) {
        return arr.flat(Infinity)
    }
 ```
 6. 使用JSON.stringify 和 JSON.parse 和 正则 
 ```javascript
    function flatten (arr) {
        let str = JSON.stringify(arr)
        str.replace(/(\[|\])/g, '')
        str = '[' + str + ']'
        return JSON.parse(str)
    }
 ```

 排序

 1. 冒泡排序
 ```javascript
    function bubbleSort (arr) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr [j + 1]) {
                    let temp
                    temp = arr[j]
                    arr[j] = arr[j + 1]
                    arr[j + 1] = temp
                }
            }
        }
        return arr
    }
 ```
 2. 快速排序
 ```javascript
    function quickSort (arr) {
        if (arr.length <= 1) return arr
        let index
        let left = []
        let right = []
        index = Math.floor(arr.length / 2)
        let mid = arr.splice(index, 1)
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < mid[0]) {
                left.push(arr[i])
            } else {
                right.push(arr[i])
            }
        }
        return quickSort(left).concat(mid, quickSort(right))
    }
 ```
 3. 插入排序
思路：
    1). 从第一个元素开始，默认该元素已经被排序
    2). 取下一个元素和第一个元素比较，在已经排序的元素序列中从后向前扫描；
    3). 如果该元素（已排序）大于新元素，将该元素移到下一位置；
    3). 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置；
    4). 将新元素插入到该位置后；
    5). 重复步骤2~5
 ```javascript
    function insertSort (arr) {
        let current
        for (let i = 1; i < arr.length; i++) {
            let prev = i - 1
            current = arr[i]
            while(prev >=0 && current < arr[prev]) {
                arr[prev + 1] = arr[prev]
                prev--
            }
            arr[prev + 1] = current
        }
        return arr
    }
 ```


 4. 手动实现一个 `EventEmitter`， 订阅发布模式

Node 的 `EventEmitter` 示例：
 ```javascript
    var events = require('events')
    var emitter = new events.EventEmitter()
    var hello1 = function (name) {
        console.log('111 hello ' + name)
    }
    var hello2 = function (name) {
        console.log('222 hello ' + name)
    }

    var hello3 = function (name) {
        console.log('333 hello ' + name)
    }
    emitter.on('say', hello1)
    emitter.on('say', hello2)

    emitter.emit('say', 'John')
    // 111 hello John
    // 222 hello John

    emitter.off('say', hello1)

    emitter.emit('say', 'Tom')
    // 222 hello John

    emitter.once('sing', hello2)
    emitter.once('sing', hello3)
    emitter.emit('sing', 'Jane')
    // 222 hello Jane
    // 333 hello Jane

    emitter.emit('sing', 'Kang')
    // 不会触发，因为once 只执行一次
 ```

 实现

 ```javascript
    function EventEmiter () {
    // 自定义事件对象，结构示例： 
    /**
    * this._event = {
        'say': [
            {
                listener: hello1,
                once: false
            },
            {
                listener: hello2,
                once: false
            },
        ]
    }
    */ 
        this._event = {}
    }
    EventEmiter.prototype.on = function (eventName, listener, once = false) {
        if(!eventName) {
            throw new Error('This methods must have a eventName')
            return
        }
        if (typeof listener !== 'function') {
            throw new Error('listener must be a function!')
            return
        }
        var events = this._event[eventName] || []
        var listeners = events
        let item = listeners.find((item) => { return item.listener === listener })
        // 不重复添加自定义事件
        if (!item) {
            listeners.push({
                listener: listener,
                once: once
            })
        }
        this._event[eventName] = listeners
        return this;
    }
    EventEmiter.prototype.once = function (eventName, listener) {
        this.on(eventName, listener, true)
    }
    EventEmiter.prototype.off = function (eventName, listener) {
        if (!eventName) {
            return
        }
        var listeners = this._event[eventName] || []
        if (!listeners.length) {
            throw new Error('there is no listener for the' + eventName)
            return
        }
        let index;
        for (let i = 0; i < listeners.length; i++) {
            if (listeners[i].listener === listener) {
                index = i; break;
            }
        }
        listeners.splice(index, 1)
        return this;
    }
    EventEmiter.prototype.emit = function (eventName) {
        if (!eventName) {
            return
        }
        var args = Array.prototype.slice.call(arguments)
        args.shift();
        var listeners = this._event[eventName] || []
        if (!listeners.length) return
        listeners.forEach((item) => {
            item.listener && item.listener.apply(this, args || [])
            if (item.once) {
                this.off(eventName, item.listener)
            }
        })
        return this;
    }
 ```

5. 手动实现 `Promise`

```javascript
    function MyPromise(executor) {
        this.status = 'pending';
        this.data = undefined;
        this.reslove = (v) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.data = v;
            }
        }
        this.rejected = (r) => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.data = r;
            }
        }
        try {
            executor(reslove, rejected);
        } catch (e) {
            this.rejected(e);
        }
    }
    MyPromise.prototype.then = function(onFulfilled, onRejected) {
        if (this.status === 'fulfilled') {
            onFulfilled(this.data)
        }
        if (this.status === 'rejected') {
            onRejected(this.data)
        }
    }

    var p1 = new Promise((resolve, reject) => {
        // resolve('success')
        // reject('fail')
    })
    p1.then((res) => {
        console.log('s ' + res)
    }, (err) => {
        console.log('f ' + err)
    })
```