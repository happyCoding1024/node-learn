const router = require('koa-router')()
router.prefix('/api/user')
const { login } = require('../controller/user');
const { SuccessModule, ErrorModule } = require('../module/resModule');

router.post('/login', async function (ctx, next) {
  const { username, password } = ctx.request.body;
  const data = await login(username, password)

  if (data.username) {
    // 设置 session
    // 这个地方的ewq.session.username 不能被赋值，原因不知
    ctx.session.username = data.username;
    ctx.session.realname = data.realname;

    // 同步到 redis，使用了express-session 和 connect-redis 之后session会自动同步到redis
    // set(req.sessionId, req.session);
    // return new SuccessModule();
    ctx.body = new SuccessModule()
    return;
  }
  ctx.body = new ErrorModule('login fail')
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

// router.get('/session-test', async function (ctx, next) {
//   if (ctx.session.viewCount == null) {
//     ctx.session.viewCount = 0
//   }
//   ctx.session.viewCount++
//
//   ctx.body ={
//     errno: 0,
//     viewCount: ctx.session.viewCount
//   }
// })

module.exports = router
