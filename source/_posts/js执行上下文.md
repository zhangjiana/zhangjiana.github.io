---
title: js 执行上下文
copyright: true
date: 2022-02-28 17:24:11
tags: js 基础
---

## js 执行上下文

请看下面代码:
```js
function f() {
    console.log('first');
}
f();
function f() {
    console.log('second');
}
f();
```
预测执行结果？
实际执行结果如下：
```js
second
second
```
是不是和你想象中的 一样？
那么我们在看下面的这段代码，猜一下执行结果
```js
var f = function () {
    console.log('a');
}
f();

var f = function () {
    console.log('b');
}
f();
```
实际执行结果：
```js
a
b
```
那么这是为什么呢？第一段代码是函数声明，第二段是函数表达式。为什么输出结果会有不同呢？

### 全局上下文
    全局上下文指的是 由浏览器创建的`window`对象，只有一个，通常我们用this 可以访问到.

### 函数上下文
    函数上下文是指函数调用的时候，在函数内部创建的上下文。可以有多个。可以理解为，只要函数被调用，就会创建一个函数上下文。
    注意： 同一个函数被多次调用，都会创建一个新的上下文。

### eval上下文
    不做讨论；

### 执行栈（调用栈）---执行上下文的管理者
    在js执行前，有这么多的上下文。该如何管理？  执行栈就解决了执行上下文的管理问题。
    执行栈 按照先进后出的顺序，执行每个栈内的执行上下文。
    全局上下文每次先进栈，最后出栈。

### 执行上下文的 创建阶段   
    1. 确定this: 

        在全局执行上下文中，this 的值指向全局对象，在浏览器中，this 的值指向 window 对象。

        在函数执行上下文中，this 的值取决于函数的调用方式。如果它被一个对象引用调用，那么 this 的值被设置为该对象，否则 this 的值被设置为全局对象或 undefined（严格模式下）。

    2. 创建词法环境：存放函数声明与const let声明的变量；

        词法环境由 环境记录 与 外部环境引入记录 组成。

        环境记录的作用： 记录声明的变量 和函数声明的实际位置。

        外部环境引入记录 的作用： 用于记录 自身环境也可以访问外部环境。

    3. 创建变量环境：只存储var声明的变量。

    可能你也不是特别明白，看一下下面的伪代码，帮助理解。

```js
// 全局执行上下文
GlobalExectionContext = {
    // 全局词法环境
    LexicalEnvironment: {
        // 环境记录
        EnvironmentRecord: {
            Type: "Object", //类型为对象环境记录
            // 标识符绑定在这里 
        },
        // 外部环境引入记录----全局词法环境的外部环境引入记录总是为null, 因为它是最外一层的。
        outer: < null >
    }
}
// 函数 执行上下文
FunctionExectionContext = {
    // 函数词法环境
    LexicalEnvironment: {
        // 环境纪录
        EnvironmentRecord: {
            Type: "Declarative", //类型为声明性环境记录
            // 标识符绑定在这里 
        },
        // 外部环境引入记录
        outer: < Global or outerfunction environment reference >
    }
};
```   
请看以下代码：
```js
let a = 20;
const b = 10;
var c;
function multiply(e, f) {  
    var g = 20;  
    return e * f * g;  
}
c = multiply(20, 30);
``` 
如果用伪代码来解释，是下面这样的 
```js
// 全局 执行上下文
GlobalExectionContext = {
     ThisBinding: <Global Object>,
     // 词法环境
     LexicalEnvironment: {  
        //环境记录
      EnvironmentRecord: {  
        Type: "Object",  // 对象环境记录
        // 标识符绑定在这里 let const创建的变量a b在这
        a: < uninitialized >,  
        b: < uninitialized >,  
        multiply: < func >  
      }
      // 全局环境外部环境引入为null
      outer: <null>  
    },
    //  变量环境
    VariableEnvironment: {  
      EnvironmentRecord: {  
        Type: "Object",  // 对象环境记录
        // 标识符绑定在这里  var创建的c在这
        c: undefined,  
      }
      // 全局环境外部环境引入为null
      outer: <null>  
    }  
}

// 函数执行上下文
  FunctionExectionContext = {
     //由于函数是默认调用 this绑定同样是全局对象
    ThisBinding: <Global Object>,
    // 词法环境
    LexicalEnvironment: {  
      EnvironmentRecord: {  
        Type: "Declarative",  // 声明性环境记录
        // 标识符绑定在这里  arguments对象在这
        Arguments: {0: 20, 1: 30, length: 2},  
      },  
      // 外部环境引入记录为</Global>
      outer: <GlobalEnvironment>  
    },
  
    VariableEnvironment: {  
      EnvironmentRecord: {  
        Type: "Declarative",  // 声明性环境记录
        // 标识符绑定在这里  var创建的g在这
        g: undefined  
      },  
      // 外部环境引入记录为</Global>
      outer: <GlobalEnvironment>  
    }  
  }
```
从上面的伪代码可以看到：

1. 全局中的`var c` 放到了全局执行上下文的变量环境中，并被标为`undefined`. 函数中的`var g` 放到了函数执行上下文的变量环境中，也被标为了`undefined`.

2. 全局中用`let` 和 `const`声明的变量，都存到了词法环境中， 并且被标记为`uninitialized`。

3. 函数声明在全局执行上下文的词法环境中被声明，并且被设置为了自身的函数。

### 执行上下文的 执行阶段
    代码根据之前的环境记录对应赋值，比如早期var在创建阶段为undefined，如果有值就对应赋值，像let const值为未初始化，如果有值就赋值，无值则赋予undefined。

## 以上关于执行上下文的解释到这里就结束了。下面我们用上面的解释，来说一下开头的两段代码的执行结果.

1. 函数声明
```js
function f() {
    console.log('first');
}
f();
function f() {
    console.log('second');
}
f();
```
上面的代码中，在js 预编译阶段，会先把函数`f` 放到全局执行上下文的词法环境中，声明`f`并设置为自身。因为有两个函数声明，在第二次遇到`f`的时候， 又将`f` 设置了一次，做了覆盖。
在调用函数`f`的时候，打印的就是最后一个函数声明了。
前期可以理解为 函数声明提升到最顶部，然后有两个，第一个被第二个覆盖了，所以调用的时候，都是打印的第二个。
相当于以下：
```js
function f() {
    console.log('first');
}
function f() {
    console.log('second');
}
f();
f();
```
2. 函数表达式
```js
var f = function () {
    console.log('a');
}
f();

var f = function () {
    console.log('b');
}
f();
```
这段代码，使用`var`声明了变量，然后把函数赋值给了`f`这个变量。 在js 预编译阶段， 先声明了`f`变量，然后赋值，这个时候，`f`应该是在全局执行上下文的变量环境中，`var f`的时候，`f` 被赋值为`undefined`。即声明提前，赋值留在原来的地方。然后第二次`var f`的时候，同样是声明提前，赋值留下。

相当于以下：
```js
var f
var f

f = function () {
    console.log('a');
}
f();

f = function () {
    console.log('b');
}
f();
```