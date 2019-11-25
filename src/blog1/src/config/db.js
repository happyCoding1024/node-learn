// 获取环境变量,process是node中进程的一些信息
const env = process.env.NODE_ENV; // 环境参数

// 配置
let MYSQL_CONF=null;

// 如果是开发环境
if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'myblog'
  }
}

// 如果是线上环境
if (env === 'production') {
  // 因为现在没有服务器，所以先写成本地的进行模拟，在工作时要写成与线上的服务器有关的信息
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'myblog'
  }
}

module.exports = {
  MYSQL_CONF
};