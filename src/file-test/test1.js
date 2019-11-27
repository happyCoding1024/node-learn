const fs = require('fs');
// 因为每个系统路径的表示方式不同，在这里使用path模块将路径的表示统一化
const path = require('path');

// __dirname node中自带的一个变量，表示当前文件的目录，可以理解成全局变量
// 找到当前路径下 data.txt 文件，将路径统一化后再赋给fileName，通过fileName就可以找到data.txt文件。
const fileName = path.resolve(__dirname, 'data.txt');

// 读取文件内容
// fs.readFile(fileName, (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   // data 是二进制类型，需要转换为字符串
//   console.log(data.toString());
// });

// 写入文件
const content = '这是新写入的内容\n';
const opt = {
  flag: 'a' // 追加写入，覆盖用 'w'
};

fs.writeFile(fileName, content, opt, (err) => {
  if (err) {
    console.error(err);
  }
});

// 判断文件是否存在
fs.exists(fileName, (exist) => {
  console.log('exist', exist); // true 表示存在
});
