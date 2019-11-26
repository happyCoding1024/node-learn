const { loginCheck } = require('../controller/user');
const { SuccessModule, ErrorModule } = require('../module/resModule');

const handleUserRouter = ((req, res) => {
  const method = req.method; // GET or POST

  // 登录
  if(method === 'POST' && req.path === '/api/user/login') {
    const { username, password } = req.body;
    const result = loginCheck(username, password);
    return result.then((data) => {
      if (data.username) {
        return new SuccessModule();
      } else {
        return new ErrorModule('login fail');
      }
    });
  }
});

module.exports = handleUserRouter;