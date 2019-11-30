const fs = require('fs');
// 获取文件的路径
const path = require('path');

// 回调函数的方式获取一个文件的内容
// function getFileContent(fileName, callback) {
//   // fullFileName 是文件的完整路径
//   // 第二个参数 file 指的是目录名， 第三个参数 a.json 指的是文件名
//   const fullFileName = path.resolve(__dirname, 'file', fileName);
//   // 读取文件
//   fs.readFile(fullFileName, (err, data) => {
//     if(err) {
//       console.log(err);
//       return;
//     }
//     callback(
//       // 将 JSON 字符串转换为 JS 对象
//       JSON.parse(data.toString())
//     )
//   });
// }

// 使用回调函数的方式 ,如果这样的回调很多，就还会产生常说的回调地狱，使用promise可以表直观地解决这个问题
// getFileContent('a.json', aData => {
//   console.log('a data', aData);
//   getFileContent(aData.next, bData => {
//     console.log('b data', bData);
//     getFileContent(bData.next, cData => {
//       console.log('c Data', cData);
//     })
//   })
// });

// 用 promise 读取文件内容
function getFileContent(fileName) {
  const promise = new Promise((resolve, reject) => {
    const fullFileName = path.resolve(__dirname, 'file', fileName);
    fs.readFile(fullFileName, (err, data) => {
      if (err) {
        // 如果发生错误调用reject方法将promise的状态变为reject
        reject(err);
        return;
      }
      // 如果没有发生错误调用，resolve方法将promise的状态变为resolved
      resolve(
        JSON.parse(data.toString())
      );
    });
  });
  return promise;
}

// getFileContent('a.json').then((aData) => {
//   console.log('a data', aData);
//   return getFileContent(aData.next); // 它又会返回一个promise实例，传入的文件是'b.json'
// }).then((bData) => {
//   console.log(bData);
//   return getFileContent(bData.next);
// }).then((cData) => {
//   console.log(cData);
// });

async function readFileData() {
  // 同步写法，上面promise的形式还是一个异步的写法因为.then的参数还是一个回调函数
  // 只要是传入函数，就是一种类似异步的写法，而 await 就不同了。
  // await 后面跟一个promise 可以直接将primise中resolve的值直接取出来
  try {
    const aData = await getFileContent('a.json');
    console.log(' a data ', aData);
    const bData = await getFileContent(aData.next);
    console.log('b data ', bData);
    const cData = await getFileContent(bData.next);
    console.log('c data ', cData);
  } catch(err) {
    console.error(err);
  }
}
//
// // 之前执行 promise.then 之后返回的是一个promise，现在执行async函数之后返回的也是一个promise对象
readFileData();
