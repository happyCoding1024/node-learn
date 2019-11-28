// 标准输入输出
// 在控制台中输入内容回车马上就会输出相同的内容
// process.stdin.pipe(process.stdout);


// http 传输数据
// const http = require('http');
//
// const server = http.createServer((req, res) => {
//   if (req.method === 'POST') {
//     req.pipe(res); // req
//     req.on('end', () => {
//       res.end('receive complete');
//     })
//   }
// });
// server.listen(8000, () => {
//   console.log('listening 8000');
// });

// 利用 stream 实现复制文件
const fs = require('fs');
const path = require('path');


