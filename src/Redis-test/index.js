const redis = require('redis');

// 创建 redis 客户端
// 第一个参数是端口，第二个参数是主机地址
const redisClient = redis.createClient(6379, '127.0.0.1');
// 按照 redis 文档要先监控一下 error
redisClient.on('err.log', err => {
  console.err(err);
});

// 测试
// redis.print 作用是当set设置完成之后会打印出来是不是正确的
redisClient.set('myname', 'zhangsan2', redis.print);
redisClient.get('myname', (err, val) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(val);

  // 退出
  redisClient.quit();
});


