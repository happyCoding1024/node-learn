const http = require('http');
const querystring = require('querystring');

// 处理 GET 请求
// const server = http.createServer((req, res) => {
//   console.log('method: ', req.method); // GET
//   const url = req.url;
//   console.log('url: ', url);
//   req.query = querystring.parse(url.split('?')[1]);
//   console.log('url.split(\'?\')[1]:', url.split('?')[1]);
//   console.log('query: ', req.query);
//   res.end(
//     JSON.stringify(req.query)  // 将req.query(一个JavaScript对象)转换为一个JSON对象
//   );
// });

// 处理 POST 请求
// const server = http.createServer((req, res) => {
//   if(req.method === 'POST') {
//     // req 数据格式
//     // 注意这个地方只能使用 ['content-type']这种形式来访问headers对象的属性，因为'-'并不是合法的标识符。
//     console.log('req content-type', req.headers['content-type']);
//     // 接收数据
//     let postData = '';
//     // 只要一来数据就会触发下面的参数中的箭头函数
//     req.on('data', (chunk) => {
//       // chunk 本身是二进制格式，要转换成字符串
//       postData += chunk.toString();
//     });
//     // 数据接收结束时触发下面参数中的箭头函数
//     req.on('end', () => {
//       console.log('postData: ', postData);
//       res.end('receive over');
//     })
//   }
// });

// 处理路由
const server = http.createServer((req, res) => {
  const url = req.url;
  const path = url.split('?')[0];
  console.log(path);
});

server.listen(8000, () => {
  console.log('listening 8000 port');
});