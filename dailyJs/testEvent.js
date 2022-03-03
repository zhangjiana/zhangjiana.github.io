
// var events = require('events')
// function EventEmiter () {
//     // 自定义事件对象，结构示例： 
//     /**
//     * this._event = {
//         'say': [
//             {
//                 listener: hello1,
//                 once: false
//             },
//             {
//                 listener: hello2,
//                 once: false
//             },
//         ]
//     }
//     */ 
//     this._event = {}
// }
// EventEmiter.prototype.on = function (eventName, listener, once = false) {
//     if(!eventName) {
//         throw new Error('This methods must have a eventName')
//         return
//     }
//     if (typeof listener !== 'function') {
//         throw new Error('listener must be a function!')
//         return
//     }
//     var events = this._event[eventName] || []
//     var listeners = events
//     let item = listeners.find((item) => { return item.listener === listener })
//     // 不重复添加自定义事件
//     if (!item) {
//         listeners.push({
//             listener: listener,
//             once: once
//         })
//     }
//     this._event[eventName] = listeners
//     return this;
// }
// EventEmiter.prototype.once = function (eventName, listener) {
//     this.on(eventName, listener, true)
// }
// EventEmiter.prototype.off = function (eventName, listener) {
//     if (!eventName) {
//         return
//     }
//     var listeners = this._event[eventName] || []
//     if (!listeners.length) {
//         throw new Error('there is no listener for the' + eventName)
//         return
//     }
//     let index;
//     for (let i = 0; i < listeners.length; i++) {
//         if (listeners[i].listener === listener) {
//             index = i; break;
//         }
//     }
//     listeners.splice(index, 1)
//     return this;
// }
// EventEmiter.prototype.emit = function (eventName) {
//     if (!eventName) {
//         return
//     }
//     var args = Array.prototype.slice.call(arguments)
//     args.shift();
//     var listeners = this._event[eventName] || []
//     if (!listeners.length) return
//     listeners.forEach((item) => {
//         item.listener && item.listener.apply(this, args || [])
//         if (item.once) {
//             this.off(eventName, item.listener)
//         }
//     })
//     return this;
// }
// var emitter = new EventEmiter()


// var hello1 = function (name) {
//     console.log('111 hello ' + name)
// }
// var hello2 = function (name) {
//     console.log('222 hello ' + name)
// }

// var hello3 = function (name) {
//     console.log('333 hello ' + name)
// }
// emitter.on('say', hello1)
// emitter.on('say', hello2)

// emitter.emit('say', 'John')
// // 111 hello John
// // 222 hello John

// emitter.off('say', hello1)

// emitter.emit('say', 'Tom')
// // 222 hello John

// emitter.once('sing', hello2)
// // emitter.once('sing', hello3)
// emitter.emit('sing', 'Jane')
// // 222 hello Jane
// // 333 hello Jane

// emitter.emit('sing', 'Kang')
// // 不会触发，因为once 只执行一次


// // thunk 函数和Generator

// function run (fn) {
//     var g = fn();
//     function next(err, data) {
//         var result = g.next(data)
//         if (result.done) return
//         result.value(next)
//     }
//     next()
// }

function MyPromise(executor) {
    this.status = 'pending';
    this.data = undefined;
    // 定义两个数组，用来存储then 之后的函数，
    this.resolvedCallbacks = [];
    this.rejecteCallbacks = [];
    this.resolve = (v) => {
        if (this.status === 'pending') {
            this.status = 'fulfilled';
            this.data = v;
            this.resolvedCallbacks.forEach((onFulfilled) => {
                onFulfilled(this.data);
            })
        }
    }
    this.rejected = (r) => {
        if (this.status === 'pending') {
            this.status = 'rejected';
            this.data = r;
            this.rejecteCallbacks.forEach((onRejected) => {
                onRejected(this.data);
            })
        }
    }
    try {
        executor(this.resolve, this.rejected);
    } catch (e) {
        this.rejected(e);
    }
}
MyPromise.prototype.then = function(onFulfilled, onRejected) {
    if (this.status === 'pending') {
        // 如果是pending 状态，先存起来；等函数执行完之后，再执行then
        this.resolvedCallbacks.push(onFulfilled);
        this.rejecteCallbacks.push(onRejected);
    }
    if (this.status === 'fulfilled') {
        onFulfilled(this.data)
    }
    if (this.status === 'rejected') {
        onRejected(this.data)
    }
}

var p1 = new MyPromise((resolve, reject) => {
    // reject('fail')
    // resolve('success')
    setTimeout(() => {
        resolve(1999)
    }, 1000)
})
p1.then((res) => {
    console.log('s ' + res)
}, (err) => {
    console.log('f ' + err)
})