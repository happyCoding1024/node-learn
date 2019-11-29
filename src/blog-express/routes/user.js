var express = require('express');
var router = express.Router();
const { login } = require('../controller/user');
const { SuccessModule, ErrorModule } = require('../module/resModule');

router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  const result = login(username, password);
  return result.then((data) => {
    if (data.username) {
      // 设置 session
      // 这个地方的ewq.session.username 不能被赋值，原因不知
      req.session.username = data.username;
      req.session.realname = data.realname;

      // 同步到 redis，使用了express-session 和 connect-redis 之后session会自动同步到redis
      // set(req.sessionId, req.session);
      // return new SuccessModule();
      res.json(
        new SuccessModule()
      );
      return;
    }
    res.json(
      new ErrorModule('login fail, please login again')
    )
  });
});

// 登录验证
router.get('/login-test', (req, res, next) => {
  if (req.session.username) {
    res.json({
      errno: 0,
      msg: 'login success'
    });
    return;
  }
  res.json({
    errno: -1,
    msg: 'please login first'
  })
});
module.exports = router;
