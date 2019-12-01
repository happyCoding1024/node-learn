const http = require('http');

const server = http.createServer((req, res) => {
  // 模拟日志
  console.log('cur time', Date.now());
  // 模拟错误
  console.error('假装出错', Date.now());
  // 模拟一个错误
  // 当访问 /err 时模拟出现错误，模拟进程崩溃，看之前能访问的页面是否还能正常访问，并且查看重启次数是否增加
  if (req.url === '/err') {
    throw new Error('/err 出错了');
  }

  res.setHeader('content-type', 'application/json');
  res.end(
    JSON.stringify({
      errno: 0,
      msg: 'pm2 test server 2'
    })
  );
});

server.listen(8000, () => {
  console.log('server is listening on port 8000');
});