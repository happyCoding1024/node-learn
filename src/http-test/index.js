const http = require('http');

// 处理 GET 请求
const server = http.createServer((req, res) => {
  const url = req.url;
  req.path = url.split('?')[0];
  if (req.method === 'GET' && req.path === '/api') {
    console.log('原生node处理GET请求');
  }
});
// 处理POST请求与GET请求类似

server.listen(8000, () => {
  console.log('listening 8000 port');
});