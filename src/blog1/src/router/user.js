const { login } = require('../controller/user');
const { SuccessModule, ErrorModule } = require('../module/resModule');

// 获取cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date(); // 获取当前时间(13位毫秒数)
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000 )); // 将 d 的时间设置为当前时间加24小时
  console.log("d.toGMTString is", d.toGMTString());
  return d.toGMTString();
};


const handleUserRouter = ((req, res) => {
  const method = req.method; // GET or POST

  // 登录
  if(method === 'GET' && req.path === '/api/user/login') {
    const { username, password } = req.body;
    // const { username, password } =  req.query;
    const result = login(username, password);
    return result.then((data) => {
      if (data.username) {
        // 设置 session
        req.session.username = data.username;
        req.session.realname = data.realname;
        // 操作cookie
        // path 中的根路由/ 表示所有的网站都会生效,设置根路由的cookie
        res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`);
        return new SuccessModule();
      } else {
        return new ErrorModule('login fail');
      }
    });
  }

  // 登录验证的测试
  // if (method === 'GET' && req.path === '/api/user/login-test') {
  //   if (req.session.username) {
  //     return Promise.resolve(new SuccessModule({
  //       session: req.session
  //     }));
  //   } else {
  //     return Promise.resolve(new ErrorModule('login test fail'));
  //   }
  // }
});

module.exports = handleUserRouter;