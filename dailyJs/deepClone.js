
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

function getType(obj) {
    return Object.prototype.toString.call(obj).replace(/\[｜\]|\object /g, '')
}
function fullClone (target) {
    const type = getType(target);
    let cloneObj = {};
    const reference = ["Set", "WeakSet", "Map", "WeakMap", "RegExp", "Date", "Error"];
    if (type === 'object') {
        for(let key in target) {
            cloneObj[key] = fullClone(target[key])
        }
    } else if (type === 'Array') {
        cloneObj = [];
        target.forEach((item) => {
            cloneObj.push(fullClone(item)) 
        })
    } else if (reference.includes(type)) {
        cloneObj = new target.constructor(target)
    } else {
        cloneObj = target
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
    },
};
//测试代码
const test1 = fullClone(target);
target.field4.push(9);
console.log('test1: ', test1);
