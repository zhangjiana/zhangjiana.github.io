// 实现Promise.all 和 Promise.any

const isPromise = value => typeof value.then === 'function'
Promise.allSelf = function (promises, maxNum) {
    return new Promise((reslove, reject) => {
        let arr = []
        let idx = 0
        let len = promises.length
        while (idx < maxNum) {
            next()
        }
        function next() {
            let current = idx++
            if (current >= len) {
                resolve(arr)
                return;
            }
            new Promise(() => {
                
            }).then((res) => {
                arr[current] = res
                if (current < len) {
                    next()
                }
            })
        }
    })
}
Promise.allDiy = function (promises) {
    return new Promise((resolve, reject) => {
        let arr = []
        let idx = 0
        const resultData = (key, data) => {
            idx++;
            arr[key] = data;
            if (idx === promises.length) {
                resolve(arr);
            }
        }
        promises.forEach((item, i) => {
            if (isPromise(item)) {
                item.then((res) => {
                    resultData(i, res)
                }, reject)
            } else {
                resultData(i, item)
            }
        })
    })
}
const pErr = new Promise((resolve, reject) => {
    reject("总是失败");
  });
  
  const pSlow = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, "最终完成");
  });
  
  const pFast = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, "很快完成");
  });

// 测试Promise.allDiy
//   Promise.allDiy([pSlow, pFast]).then((res) => {
//       console.log(res)
//   }, (err) => {
//       console.log(err)
//   })

// Promise.any([pErr, pSlow, pFast]).then((res) => {
//     console.log(res)
//     // 期望输出 很快完成
// }, (err) => {
//     console.log(err)
// })
// 实现
Promise.anyDiy = function(promises) {
    return new Promise((resolve, reject) => {
        let arr = []
        let count = 0
        for (let i = 0; i < promises.length; i++) {
            count++;
            promises[i].then((res) => {
                arr.push(res)
                if (count === promises.length) {
                    resolve(arr[0])
                } else {
                    reject('no result!')
                }
            })
        }
    })
}
Promise.anyDiy([pErr, pSlow, pFast]).then((res) => {
    console.log(res)
    // 期望输出--> 很快完成
}, (err) => {
    console.log(err)
})

var module = {
    x: 1,
    getX: function(arg) {
        console.log('---')
        console.log(this.x)
        console.log(arg)
    }
}
var b = module.getX;
var a = {
    x: 22
}
b.bind(a, 789)()

