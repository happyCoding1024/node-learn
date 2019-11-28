const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fileName = path.join(__dirname, '../', '../',  'logs', 'access.log');
// 创建 readStream
const readStream = fs.createReadStream(fileName);
// 创建 readline 对象
const rl = readline.createInterface({
  input: readStream
});

let chromeNum = 0;
let sum = 0;

// 逐行读取
// 一行读完之后会触发
rl.on('line', (lineData) => {
  if (!lineData) {
    return;
  }
  // 记录总行数
  sum++;
  const arr = lineData.split('--');
  // indexOf 是数组中的方法用于在数组中查找某一项的索引，如果查找不到返回-1
  // 这里这样写说明 arr[2] 中存的是数组？

  if (arr[2] && arr[2].indexOf('Chrome') > 0) {
    chromeNum++;
  }

  // 监听读取完成
  rl.on('close', () => {
    console.log('chrome 占比：', chromeNum/sum);
  })
});