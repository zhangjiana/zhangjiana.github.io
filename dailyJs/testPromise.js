
function multiRequest(urls = [], maxNum) {
    // 请求总数量
    const len = urls.length;
    // 根据请求数量创建一个数组来保存请求的结果
    const result = new Array(len).fill(false);
    // 当前完成的数量
    let count = 0;
    const fetch = function(u) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(u)
            }, 300)
        })
    }
    return new Promise((resolve, reject) => {
      // 请求maxNum个
      while (count < maxNum) {
        console.log(count)
        next();
      }
      function next() {
        let current = count++;
        // 处理边界条件
        if (current >= len) {
          // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
          !result.includes(false) && resolve(result);
          return;
        }
        const url = urls[current];
        console.log(`开始 ${current}`, new Date().toLocaleString());
        fetch(url)
          .then((res) => {
            // 保存请求结果
            result[current] = res;
            console.log(`完成 ${current}`, new Date().toLocaleString());
            // 请求没有全部完成, 就递归
            if (current < len) {
              next();
            }
          })
          .catch((err) => {
            console.log(`结束 ${current}`, new Date().toLocaleString());
            result[current] = err;
            // 请求没有全部完成, 就递归
            if (current < len) {
              next();
            }
          });
      }
    });
  }
  
  multiRequest([1,22,3,4,555,6,7,8,9,150,11], 6).then((res) => {
      console.log(res)
  })
function dealRequestByBatch(urls, maxNum) {
  let count = 0;
  let result = {};
  return new Promise((resolve, reject) => {
    while(count < maxNum) {
      next()
    }
    const next = () => {
      count++;
      let current = count;
      if (current >= urls.length) {
        resolve(result);
        return
      }
      fetch(urls[count]).then((res) => {
        result[count] = res
        if (current < urls.length) {
          next()
        }
      })
    }
  })
}


// 使用requestAnimationFrame实现setInterval
function setIntervalByRequest (fn, interval) {
  let startTime = new Date().getTime()
  let endTime = startTime
  let timer
  function loop() {
    timer = window.requestAnimationFrame(loop)
    endTime = new Date().getTime()
    if (endTime - startTime >= interval) {
      startTime = endTime = new Date().getTime()
      fn(timer)
    }
  }
  timer = window.requestAnimationFrame(loop)
  return timer
}

// 使用requestAnimationFrame 实现setTimeout
function setTimeoutByRequest(fn, interval) {
    let now = new Date.now
    let startTime = now()
    let endTime = startTime
    let timer
    function loop() {
      timer = window.requestAnimationFrame(loop)
      if (endTime - startTime >= interval) {
        fn()
        window.cancelAnimationFrame(timer)
      }
    }
    timer = window.requestAnimationFrame(loop)
    return timer
}