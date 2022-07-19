
// 普通情况下的深克隆
// function deepClone (obj) {
//     if (typeof obj === 'object') {
//         let temp = Array.isArray(obj) ? [] : {};
//         for (let i in obj) {
//             temp[i] = deepClone(obj[i])
//         }
//         return temp
//     }
//     return obj
// }

// var a = [1,2,3];
// var b = deepClone(a);
// console.log(b);
// b.push(33)
// console.log(b) 
// console.log(a)

// 全面的深克隆


function fullClone (target, wm = new WeakMap()) {
    let res = null;
    const reference = ["Set", "WeakSet", "Map", "WeakMap", "RegExp", "Date", "Error"];
    if (reference.includes(target.constructor)) {
        res = new target.constructor(target)
    } else if (typeof target === 'Object' && type !== null) {
       if (wm.has(target)) {
           return wm.get(target)
       }
       const allDescs = Object.getOwnPropertyDescriptors(target);
       const cloneObj = Object.create(Object.getPrototypeOf(target), allDescs);
       wm.set(target, cloneObj);
       console.log(target)
       for (let key in Reflect.ownKeys(target)) {
        cloneObj[key] = fullClone(target[key], wm);
       }
       res = cloneObj
    } else {
        res = target
    }
    return res
}
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
        cloneObj[key] = (isComplexDataType(target[key]) && typeof target[key] !== 'function') ? deepCopy(target[key], wm) : target[key]
    }
    return cloneObj
}
// 代码测试
const map = new Map();
map.set("key", "value");
map.set("ConardLi", "coder");

const set = new Set();
set.add("ConardLi");
set.add("coder");

const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: "child",
    },
    field4: [2, 4, 8],
    empty: null,
    map,
    set,
    bool: new Boolean(true),
    num: new Number(2),
    str: new String(2),
    symbol: Object(Symbol(1)),
    date: new Date(),
    reg: /\d+/,
    error: new Error(),
    func1: () => {
        let t = 0;
        console.log("coder", t++);
    },
    func2: function (a, b) {
        return a + b;
    }
};
//测试代码
const test1 = fullClone(target);
target.field4.push(9);
target.loop = target;
console.log('test1: ', test1);


// 带上解决循环引用的深克隆
