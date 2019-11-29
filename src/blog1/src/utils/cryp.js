// crypto 是 node.js 中一个加密库
const crypto = require('crypto');

// 密匙(shi)（一个字符串，自己随意创建的）
// 黑客就算拿到了密码，不知道密匙，也无法解析出明文
const SECRET_KEY = 'WJiol_8776#';

// md5 加密
function md5(content) {
  let md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex'); // 把输出变成16进制的方式
}

// 加密
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}

console.log(genPassword('123'));
module.exports = genPassword;

