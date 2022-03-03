
// 数组去重



// let arr = [1, 2, 3, 4, 4, 4, 4, 5, 7, 8];

// function single(arr) {
//     if(!arr || !arr.length) {
//         return [];
//     }

//     let res = {};
//     for(let i = 0; i < arr.length; i++) {
//         if (res[arr[i]] === undefined) {
//             res[arr[i]] = arr[i];
//         }
//     }

//     return Object.keys(res);
// }


// console.log('script start');  
// setTimeout(function()  { 
//     console.log('setTimeout'); 
//  },  0);
// Promise.resolve().then(function() {
//     console.log('promise1'); 
//  })
// .then(function(){
//     console.log('promise2'); 
//  }); 

//  console.log('script end');

//  输出结果

// 深拷贝

// 多维数组变一维数组[2,3,[4,[5]]]
// function format(arr) {
//     return arr.reduce((acc, item) => {
//         return acc.concat(Array.isArray(item) ? format(item) : item)
//     }, [])
// }
// let a = format([1, [2, [ [3, 4], 5], 6]]);
// console.log(a);
// [2, 3,4,5]



// 节流
function throttle(fn,wait = 0) {
    let start = 0, end
    return function () {
        end = new Date().getTime()
        let t = end - start
        start = now
        if(t > wait) {
            fn.apply(this, ...args)
        }
    }
}








// 实现快排
function quickSort(arr) {

    if (arr.length <= 1) {
        return arr;
    }

    const mid = arr[0];
    const left = []
    const right = []

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > mid) {
            right.push(arr[i])
        } else {
            left.push(arr[i])
        }
    }

    return [...quickSort(left), mid, ...quickSort(right)]

}

// add(1)(2)(3)

// 有多条请求时，每次请求5条。
function multiRequest (urls, maxNum) {
    console.log(new Date().getTime())
    const len = urls.length;
    // 用来存储最后的结果
    const result = Array(len).fill(false);
    // 计数
    let count = 0;
    return new Promise((resolve) => {
        while (count < maxNum) {
            next()
        }

        function next() {
            let current = count++;
            if (current >= len) {
                !result.includes(false) && resolve(result);
                console.log(new Date().getTime())
                return
            }
            fetch(urls[current])
                .then((res) => {
                    console.log('完成' + current)
                    result[current] = res;
                    if (current < len) {
                        next()
                    }
                }).catch((err) => {
                    result[current] = err;
                    if (current < len) {
                        next()
                    }
                })
        }

    })
}
const fetch = function(u) {
    return new Promise((resolve) => {
        setTimeout(()=> {
            resolve(u)
        }, 3000)
    })
}
multiRequest([1,22,3,4,555,6,7,8,9,150,11], 6).then((res) => {
    console.log(res)
})