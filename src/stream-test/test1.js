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

const fileName1 = path.resolve(__dirname, 'data.txt');
const fileName2 = path.resolve(__dirname, 'data-bak.txt');

// 定义两个水桶
const readStream = fs.createReadStream(fileName1);
const writeStream = fs.createWriteStream(fileName2);

readStream.pipe(writeStream);
// 上面的语句等价于
readStream.on('data', (chunk) => {
  console.log(chunk); // 当数据文件比较大时，会打印不止一次
});
readStream.on('end', ()  => {
  console.log('copy completed');
});

