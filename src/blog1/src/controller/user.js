const { exec, escape } = require('../db/mysql');
const genPassword = require('../utils/cryp');

const login = (username, password) => {
  // 将可能会在mysql出现的代码用escape函数执行一下
  username = escape(username);

  // 生成加密密码
  password = genPassword(password);
  password = escape(password);

  const sql = `
    select username, realname from user 
    where username =${username} and password=${password};
  `;
  console.log('sql is', sql);
  return exec(sql).then((rows) => {
    return rows[0] || {};
  });
};

module.exports = {
  login
};
