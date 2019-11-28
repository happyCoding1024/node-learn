const fs = require('fs');
const path = require('path');

// 写日志
// 第一个参数是 writeSteam，就是往哪个 stream 中写
// 第二个参数log是写的内容
function writeLog(writeStream, log) {
  writeStream.write(log + '\n'); // 写完一段代码后换行
}

// 传入一个文件名，生成一个 write stream
function  createWriteStream(fileName) {
  // 拼接成一个完整的路径，__dirname 就是 ./
  // 下面这行代码的路径就是 './../../logs/fileName'
  const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName);
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: 'a'
  });
  return writeStream;
}

// 写访问日志
const accessWriteSream = createWriteStream('access.log');
function access(log) {
  writeLog(accessWriteSream, log);
}

module.exports = {
  access
};