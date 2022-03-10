const Promise = require('./myPromise');

var p1 = new Promise((resolve, reject) => {
  const s = 'hhh'
  setTimeout(() => {
    resolve(s);
  }, 1000);
}).then((res) => {
  console.log('1---success:')
  console.log(res);
  return res;
}, err => {
  console.log('1---fail: ');
  console.log(err);
}).then((res) => {
  console.log('2---success:')
  console.log(res);
}, err => {
  console.log('2---fail:')
  console.log(err);
})