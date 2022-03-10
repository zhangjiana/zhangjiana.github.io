

function MyPromise(executor) {
    let self = this;
    self.status = 'pending';
    self.data = undefined;
    self.onResolvedCallbacks = [];
    self.onRejectedCallbacks = [];
    function resolve(value) {
            if (self.status === 'pending') {
                self.data = value;
                self.status = 'resolved';
                self.onResolvedCallbacks.forEach((onFulfiled) => {
                    onFulfiled();
                })
            }
    };
    function reject(reason) {
            if (self.status === 'pending') {
                self.data = reason;
                self.status = 'rejected';
                self.onRejectedCallbacks.forEach((onRejected) => {
                    onRejected();
                })
            }
    }
    try {
        executor(resolve, reject);
    } catch (err) {
        reject(err)
    }
}

MyPromise.prototype.then = function(onFulfiled, onRejected) {
    var self = this;
    var onFulfiled = typeof onFulfiled === 'function' ? onFulfiled : function(v) {return v};
    var onRejected = typeof onRejected === 'function' ? onRejected : err => { throw (err) };
    let promise2 = new MyPromise((resolve, reject) => {
        if (this.status === 'pending') {
            this.onResolvedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        var x = onFulfiled(self.data)
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (r) {
                        reject(r)
                    }
                })
            });
            this.onRejectedCallbacks.push((data) => {
                setTimeout(() => {
                    try {
                        var x = onRejected(self.data)
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (r) {
                        reject(r)
                    }
                })
            });  
        };
        if (this.status === 'resolved') {
                setTimeout(() => {
                    try {
                        let x = onFulfiled(self.data);
                        resolvePromise(x, promise2, resolve, reject);
                    }
                    catch (err) {
                        reject(err);
                    }
                })
        }
        if (this.status === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(self.data);
                        resolvePromise(x, promise2, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                })
        }
    })
    return promise2
}
function resolvePromise (x, promise2, resolve, reject) {
    var thenCalledOrThrow = false; // 是否调用过
    if (x === promise2) {
        // 不能循环调用本身
      return  reject(new TypeError('Chaining cycle detected for promise!'))
    }
    if (x && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                // 借用上一个then函数
                    then.call(x, value => {
                        if (thenCalledOrThrow) return 
                        thenCalledOrThrow = true
                        // 把拿到的值放进去 递归调用；
                        resolvePromise(value, promise2, resolve, reject);
                    }, reason => {
                        if (thenCalledOrThrow) return 
                        thenCalledOrThrow = true
                        reject(reason);
                    })
            } else {
                resolve(x)
            }
        } catch(err) {
            if (thenCalledOrThrow) return 
            thenCalledOrThrow = true
            reject(err);
        }
    } else {
        resolve(x);
    }
}
// 测试用
MyPromise.deferred = function() {
    let deferred = {}
    deferred.promise = new MyPromise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    })
    return deferred;
}
var pTest = require('promises-aplus-tests');
pTest(Promise, function(err) {
    console.log('错误：' + err);
})
module.exports = MyPromise