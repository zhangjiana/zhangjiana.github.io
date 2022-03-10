---
title: js作用域链
copyright: true
date: 2022-03-01 17:03:43
tags:
---

全局上下文或者函数上下文中的代码在执行的时候，会创建变量对象的一个作用域链（scope chain）。这个作用域链决定

了各级上下文中的代码在访问变量和函数时的顺序。代码正在执行的上下文的变量对象始终位于作用域链的最前端。

```js
var color = "blue"; 
function changeColor() { 
 let anotherColor = "red"; 
    function swapColors() { 
        let tempColor = anotherColor; 
        anotherColor = color; 
        color = tempColor; 
    // 这里可以访问 color、anotherColor 和 tempColor 
    } 
 // 这里可以访问 color 和 anotherColor，但访问不到 tempColor 
 swapColors(); 
} 
// 这里只能访问 color 
changeColor();
```
以上代码涉及 3 个上下文：全局上下文、changeColor()的局部上下文和 swapColors()的局部上下文。

全局上下文中有一个变量 color 和一个函数 changeColor()。

changeColor()的局部上下文中有一个变量 anotherColor 和一个函数 swapColors()，但在这里可以访问全局上下文中的变量 color。

swapColors()的局部上下文中有一个变量 tempColor，只能在这个上下文中访问到。

全局上下文和changeColor()的局部上下文都无法访问到 tempColor。而在 swapColors()中则可以访问另外两个 上下文中的变量，因为它们都是父上下文。

这样就形成了一个作用域链。

内部上下文可以通过作用域链访问外部上下文中的一切，但外部上下文无法访问内部上下文中的任何东西。上下文之间的连接是线性的、有序的。

每个上下文都可以到上一级上下文中去搜索变量和函数，但任何上下文都不能到下一级上下文中去搜索。

swapColors() 局部上下文的作用域链中有 3 个对象：swapColors()的变量对象、changeColor()的变量对象和全局变量对象。

swapColors()的局部上下文首先从自己的变量对象开始搜索变量和函数，搜不到就去搜索上一级变量对象。

changeColor()上下文的作用域链中只有 2 个对象：它自己的变量对象和全局变量对象。因此，它不能访问 swapColors()的上下文。