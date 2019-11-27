const redis = require('redis');
const { REDIS_CONF } = require('../config/db');

// 创建客户端
redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('error', err => {
  // console.log(err); // 注意不是console.log 而是 console.error
  console.error(err);
});

// 设置set函数
function set(key, val) {
  // 因为redis中set方法的两个参数必须是字符串，所以如果val的参数是对象的话，那么就会自动调用 toString() 方法进行隐式类型转换，
  // 转换后的格式并不是我们想要的，所以如果val是对象的话，我们一般先将其转换成JSON字符串的格式。
  if (typeof val === 'object') {
    val = JSON.stringify(val);
  }
  redisClient.set('key', 'val', redis.print)
}
// Redis中的get是一个异步的形式所以需要利用promise进行封装
function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get('key', (err, val) => {
      if (err) {
        reject(err);
        return;
      }
      // 如果瞎传了一个key，这时候没有找到val，val就等于null
      if (val === null ){
        resolve(val);
        return;
      }

      // 如果val不是JSON格式的字符串那么转换成对象时不会成功，这个时候
      // 直接返回val
      try {
        resolve(JSON.parse(val));
      } catch (e) {
        resolve(val);
      }
    })
  });
  return promise;
}

module.exports = {
  set,
  get
};